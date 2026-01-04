import { json } from "@sveltejs/kit";

import { TABLES } from "$lib/constants/database";
import type { Task, TaskStatus } from "$lib/types";

import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals, plannerDb }) => {
  const { activeWorkspaceId } = locals;

  const [taskStats, tasksList] = await Promise.all([
    plannerDb
      .selectFrom(TABLES.TASKS)
      .select((eb) => [
        eb.fn.countAll<number>().as("total"),
        eb.fn
          .countAll<number>()
          .filterWhere("taskStatus", "=", "pending")
          .as("pending"),
        eb.fn
          .countAll<number>()
          .filterWhere("taskStatus", "=", "on_progress")
          .as("onProgress"),
        eb.fn
          .countAll<number>()
          .filterWhere("taskStatus", "=", "completed")
          .as("completed"),
      ])
      .where("organizationId", "=", activeWorkspaceId)
      .executeTakeFirst(),

    plannerDb
      .selectFrom(TABLES.TASKS)
      .selectAll()
      .where("organizationId", "=", activeWorkspaceId)
      .orderBy("taskDueDate", "asc")
      .execute(),
  ]);

  const getLatestUpdate = (status?: string) =>
    tasksList
      .filter((t) => !status || t.taskStatus === status)
      .sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt))[0]
      ?.updatedAt ?? null;

  return json({
    tasks: tasksList,
    taskStats,
    update: {
      total: getLatestUpdate(),
      pending: getLatestUpdate("pending"),
      onProgress: getLatestUpdate("on_progress"),
      completed: getLatestUpdate("completed"),
    },
  });
};

export const POST: RequestHandler = async ({ locals, plannerDb, request }) => {
  const { activeWorkspaceId, user } = locals;
  if (!user) {
    throw new Error("User not found");
  }
  const data = (await request.json()) as Task;

  const newTask = await plannerDb
    .insertInto(TABLES.TASKS)
    .values({
      ...data,
      id: crypto.randomUUID(),
      organizationId: activeWorkspaceId as string,
      createdBy: user.id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  return json({ success: true, task: newTask });
};

export const PATCH: RequestHandler = async ({ locals, plannerDb, request }) => {
  const { activeWorkspaceId } = locals;
  const { id, status }: { id: string; status: TaskStatus } =
    await request.json();

  const updatedTask = await plannerDb
    .updateTable(TABLES.TASKS)
    .set({
      taskStatus: status,
      completedAt: status === "completed" ? Date.now() : null,
      updatedAt: Date.now(),
    })
    .where("id", "=", id)
    .where("organizationId", "=", activeWorkspaceId)
    .returningAll()
    .executeTakeFirst();

  if (!updatedTask) {
    return json({ error: "Task not found" }, { status: 404 });
  }

  return json({ success: true, updatedTask });
};
