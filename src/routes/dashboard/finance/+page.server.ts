import type { PageServerLoad, Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import { expenseSchema } from "$lib/validation/planner";
import type { ExpenseData, ExpenseStatus } from "$lib/types";
import { withAuth } from "$lib/server/auth-helpers";

export const load: PageServerLoad = async ({ locals, plannerDb, depends }) => {
	depends("expense:list");
	depends("calendar:data");
	const expenseForm = await superValidate(valibot(expenseSchema));

	const { user, activeWorkspaceId, activeWorkspace } = locals;

	if (!user) {
		redirect(302, "/login");
	}

	if (!activeWorkspaceId) {
		redirect(302, "/onboarding");
	}

	const plannedBudget = Number(activeWorkspace?.weddingBudget ?? 0);

	const [budgetSpent, totalSavings] = await Promise.all([
		plannerDb
			.selectFrom("expense_items")
			.select((eb) => eb.fn.sum<number>("expenseAmount").as("total"))
			.where("organizationId", "=", activeWorkspaceId)
			.executeTakeFirst()
			.then((result) => result?.total ?? 0),

		plannerDb
			.selectFrom("savings_items")
			.select((eb) => eb.fn.sum<number>("savingAmount").as("total"))
			.where("organizationId", "=", activeWorkspaceId)
			.executeTakeFirst()
			.then((result) => result?.total ?? 0),
	]);

	const [planned, spent] = await Promise.all([
		plannerDb
			.selectFrom("organization")
			.select("createdAt")
			.where("id", "=", activeWorkspaceId)
			.executeTakeFirst()
			.then((result) => result?.createdAt || null),

		plannerDb
			.selectFrom("expense_items")
			.select("updatedAt")
			.where("organizationId", "=", activeWorkspaceId)
			.orderBy("updatedAt", "desc")
			.limit(1)
			.executeTakeFirst()
			.then((result) => result?.updatedAt || null),
	]);

	const budgetRemaining = (plannedBudget - budgetSpent).toString();

	const savingProgress =
		plannedBudget > 0 ? Math.floor((totalSavings / plannedBudget) * 100) : 0;

	const expenses = await plannerDb
		.selectFrom("expense_items")
		.selectAll()
		.where("organizationId", "=", activeWorkspaceId)
		.orderBy("createdAt", "desc")
		.execute();

	return {
		expenseForm,
		financeStats: {
			plannedBudget: plannedBudget.toString(),
			budgetSpent: budgetSpent.toString(),
			totalSavings: totalSavings.toString(),
			budgetRemaining,
			savingProgress,
		},
		update: {
			planned,
			spent,
		},
		expenses,
	};
};

export const actions: Actions = {
	createExpenseItem: withAuth(
		async ({ organizationId, plannerDb }, { request }) => {
			const form = await superValidate(request, valibot(expenseSchema));
			if (!form.valid) return fail(400, { form });

			try {
				const {
					expenseDescription,
					expenseCategory,
					expenseAmount,
					expensePaymentStatus,
					expenseDueDate,
				} = form.data as ExpenseData;

				const newExpense = await plannerDb
					.insertInto("expense_items")
					.values({
						id: crypto.randomUUID(),
						organizationId,
						expenseDescription,
						expenseCategory,
						expenseAmount,
						expensePaymentStatus,
						expenseDueDate: String(expenseDueDate),
						createdAt: Date.now(),
						updatedAt: Date.now(),
					})
					.returningAll()
					.executeTakeFirstOrThrow();

				return { form, success: true, expense: newExpense };
			} catch (error) {
				console.error("createExpenseItem error:", error);
				return fail(500, {
					form,
					error: "Failed to create new expense. Please try again.",
				});
			}
		}
	),

	updatePaymentStatus: withAuth(
		async ({ organizationId, plannerDb }, { request }) => {
			const data = await request.formData();
			const expenseId = data.get("id") as string;
			const newPaymentStatus = data.get("paymentStatus") as ExpenseStatus;

			if (!expenseId || !newPaymentStatus) {
				return fail(400, { error: "Missing required fields" });
			}

			try {
				const updatedPaymentStatus = await plannerDb
					.updateTable("expense_items")
					.set({
						expensePaymentStatus: newPaymentStatus,
						updatedAt: Date.now(),
					})
					.where("id", "=", expenseId)
					.where("organizationId", "=", organizationId)
					.returningAll()
					.executeTakeFirst();
				if (!updatedPaymentStatus) {
					return fail(404, { error: "Expense not found" });
				}

				return { success: true, task: updatedPaymentStatus };
			} catch (error) {
				console.error("updatePaymentStatus error:", error);
				return fail(500, {
					error: "Failed to update payment status.",
				});
			}
		}
	),

	updateExpenseItem: withAuth(
		async ({ organizationId, plannerDb }, { request }) => {
			const form = await superValidate(request, valibot(expenseSchema));
			if (!form.valid) return fail(400, { form });

			const data = await request.formData();
			const expenseId = data.get("id") as string;

			if (!expenseId) {
				return fail(400, { form, error: "Missing expense ID" });
			}

			const {
				expenseDescription,
				expenseCategory,
				expenseAmount,
				expensePaymentStatus,
				expenseDueDate,
			} = form.data as ExpenseData;

			try {
				const updatedExpense = await plannerDb
					.updateTable("expense_items")
					.set({
						expenseDescription,
						expenseCategory,
						expenseAmount: expenseAmount,
						expensePaymentStatus,
						expenseDueDate: String(expenseDueDate),
						updatedAt: Date.now(),
					})
					.where("id", "=", expenseId)
					.where("organizationId", "=", organizationId)
					.returningAll()
					.executeTakeFirst();

				if (!updatedExpense) {
					return fail(404, { form, error: "Expense not found" });
				}

				return { form, success: true, expense: updatedExpense };
			} catch (error) {
				console.error("editExpenseItem error:", error);
				return fail(500, {
					form,
					error: "Failed to update expense. Please try again.",
				});
			}
		}
	),

	deleteExpenseItem: withAuth(
		async ({ organizationId, plannerDb }, { request }) => {
			const data = await request.formData();
			const expenseId = data.get("id") as string;

			if (!expenseId) {
				return fail(400, { error: "Missing expense ID" });
			}

			try {
				const deletedExpense = await plannerDb
					.deleteFrom("expense_items")
					.where("id", "=", expenseId)
					.where("organizationId", "=", organizationId)
					.returningAll()
					.executeTakeFirst();

				if (!deletedExpense) {
					return fail(404, { error: "Expense not found" });
				}

				return { success: true };
			} catch (error) {
				console.error("deleteExpenseItem error:", error);
				return fail(500, {
					error: "Failed to delete expense. Please try again.",
				});
			}
		}
	),
};
