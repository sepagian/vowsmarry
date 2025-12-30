import type { PageServerLoad, Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import { taskSchema } from "$lib/validation/planner";
import type { TaskStatus } from "$lib/types";
import { withAuth } from "$lib/server/auth-helpers";
import { handleActionError } from "$lib/server/error-handler";
import { FormDataParser } from "$lib/utils/form-helpers";

export const load: PageServerLoad = async ({
	locals,
	plannerDb,
	depends,
	url,
}) => {
	depends("task:list");
	depends("calendar:data");

	const { user, activeWorkspaceId } = locals;

	if (!user) redirect(302, "/login");
	if (!activeWorkspaceId) redirect(302, "/onboarding");

	const page = Number(url.searchParams.get("page")) || 1;
	const limit = Number(url.searchParams.get("limit")) || 10;
	const sortBy = url.searchParams.get("sortBy") || "taskDueDate";
	const sortOrder = url.searchParams.get("sortOrder") || "asc";

	const taskForm = await superValidate(valibot(taskSchema));

	const [tasksList, taskStats, latestUpdates] = await Promise.all([
		plannerDb
			.selectFrom("tasks")
			.selectAll()
			.where("organizationId", "=", activeWorkspaceId)
			.orderBy(sortBy as any, sortOrder as "asc" | "desc")
			.limit(limit)
			.offset((page - 1) * limit)
			.execute(),
		(async () => {
			const [total, pending, onProgress, completed] = await Promise.all([
				plannerDb
					.selectFrom("tasks")
					.select((eb) => eb.fn.countAll().as("count"))
					.where("organizationId", "=", activeWorkspaceId)
					.executeTakeFirst()
					.then((r) => Number(r?.count || 0)),
				plannerDb
					.selectFrom("tasks")
					.select((eb) => eb.fn.countAll().as("count"))
					.where("organizationId", "=", activeWorkspaceId)
					.where("taskStatus", "=", "pending")
					.executeTakeFirst()
					.then((r) => Number(r?.count || 0)),
				plannerDb
					.selectFrom("tasks")
					.select((eb) => eb.fn.countAll().as("count"))
					.where("organizationId", "=", activeWorkspaceId)
					.where("taskStatus", "=", "on_progress")
					.executeTakeFirst()
					.then((r) => Number(r?.count || 0)),
				plannerDb
					.selectFrom("tasks")
					.select((eb) => eb.fn.countAll().as("count"))
					.where("organizationId", "=", activeWorkspaceId)
					.where("taskStatus", "=", "completed")
					.executeTakeFirst()
					.then((r) => Number(r?.count || 0)),
			]);
			return { total, pending, onProgress, completed };
		})(),
		(async () => {
			const [all, pending, onProgress, completed] = await Promise.all([
				plannerDb
					.selectFrom("tasks")
					.select((eb) => eb.fn.max("updatedAt").as("latest"))
					.where("organizationId", "=", activeWorkspaceId)
					.executeTakeFirst()
					.then((r) => r?.latest || null),
				plannerDb
					.selectFrom("tasks")
					.select((eb) => eb.fn.max("updatedAt").as("latest"))
					.where("organizationId", "=", activeWorkspaceId)
					.where("taskStatus", "=", "pending")
					.executeTakeFirst()
					.then((r) => r?.latest || null),
				plannerDb
					.selectFrom("tasks")
					.select((eb) => eb.fn.max("updatedAt").as("latest"))
					.where("organizationId", "=", activeWorkspaceId)
					.where("taskStatus", "=", "on_progress")
					.executeTakeFirst()
					.then((r) => r?.latest || null),
				plannerDb
					.selectFrom("tasks")
					.select((eb) => eb.fn.max("updatedAt").as("latest"))
					.where("organizationId", "=", activeWorkspaceId)
					.where("taskStatus", "=", "completed")
					.executeTakeFirst()
					.then((r) => r?.latest || null),
			]);
			return { all, pending, onProgress, completed };
		})(),
	]);

	return {
		taskForm,
		tasks: {
			list: tasksList,
			pagination: {
				page,
				limit,
				total: taskStats.total,
				totalPages: Math.ceil(taskStats.total / limit),
			},
		},
		taskStats,
		update: {
			total: latestUpdates.all,
			pending: latestUpdates.pending,
			onProgress: latestUpdates.onProgress,
			completed: latestUpdates.completed,
		},
	};
};

export const actions: Actions = {
	createTask: withAuth(
		async ({ user, organizationId, plannerDb }, { request }) => {
			const form = await superValidate(request, valibot(taskSchema));
			if (!form.valid) return fail(400, { form });

			try {
				const newTask = await plannerDb
					.insertInto("tasks")
					.values({
						id: crypto.randomUUID(),
						organizationId,
						taskDescription: form.data.taskDescription,
						taskCategory: form.data.taskCategory,
						taskPriority: form.data.taskPriority,
						taskStatus: form.data.taskStatus,
						taskDueDate: String(form.data.taskDueDate),
						completedAt: null,
						assignedTo: null,
						createdBy: user.id,
						createdAt: Date.now(),
						updatedAt: Date.now(),
					})
					.returningAll()
					.executeTakeFirstOrThrow();

				return { form, success: true, task: newTask };
			} catch (error) {
				return handleActionError(error, "create task", { form });
			}
		}
	),

	updateTaskStatus: withAuth(
		async ({ organizationId, plannerDb }, { request }) => {
			try {
				const parser = new FormDataParser(await request.formData());
				const taskId = parser.getString("id");
				const newStatus = parser.getEnum("status", [
					"pending",
					"on_progress",
					"completed",
				] as const);

				const updatedTask = await plannerDb
					.updateTable("tasks")
					.set({
						taskStatus: newStatus,
						completedAt: newStatus === "completed" ? Date.now() : null,
						updatedAt: Date.now(),
					})
					.where("id", "=", taskId)
					.where("organizationId", "=", organizationId)
					.returningAll()
					.executeTakeFirst();

				if (!updatedTask) return fail(404, { error: "Task not found" });

				return { success: true, task: updatedTask };
			} catch (error) {
				return handleActionError(error, "update task status");
			}
		}
	),

	updateTask: withAuth(async ({ organizationId, plannerDb }, { request }) => {
		const clonedRequest = request.clone();
		const parser = new FormDataParser(await clonedRequest.formData());
		const taskId = parser.getString("id");

		const form = await superValidate(request, valibot(taskSchema));
		if (!form.valid) return fail(400, { form });

		try {
			const updatedTask = await plannerDb
				.updateTable("tasks")
				.set({
					...form.data,
					taskDueDate: String(form.data.taskDueDate),
					completedAt: form.data.taskStatus === "completed" ? Date.now() : null,
					updatedAt: Date.now(),
				})
				.where("id", "=", taskId)
				.where("organizationId", "=", organizationId)
				.returningAll()
				.executeTakeFirst();

			if (!updatedTask) return fail(404, { form, error: "Task not found" });

			return { form, success: true, task: updatedTask };
		} catch (error) {
			return handleActionError(error, "update task", { form });
		}
	}),

	deleteTask: withAuth(async ({ organizationId, plannerDb }, { request }) => {
		try {
			const parser = new FormDataParser(await request.formData());
			const taskId = parser.getString("id");

			const deletedTask = await plannerDb
				.deleteFrom("tasks")
				.where("id", "=", taskId)
				.where("organizationId", "=", organizationId)
				.returningAll()
				.executeTakeFirst();

			if (!deletedTask) return fail(404, { error: "Task not found" });

			return { success: true };
		} catch (error) {
			return handleActionError(error, "delete task");
		}
	}),
};
