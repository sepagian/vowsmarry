import { json } from "@sveltejs/kit";

import type { Task } from "$lib/types";

import { TABLES } from "$lib/constants/database";

import type { RequestHandler } from "./$types";

export const DELETE: RequestHandler = async ({ locals, plannerDb, params }) => {
  const { activeWorkspaceId } = locals;
  const { id } = params;

  if (!id) {
    return json({ error: "Task ID required" }, { status: 400 });
  }

  const deletedTask = await plannerDb
    .deleteFrom(TABLES.TASKS)
    .where("id", "=", id)
    .where("organizationId", "=", activeWorkspaceId)
    .returningAll()
    .executeTakeFirst();

  if (!deletedTask) {
    return json({ error: "Task not found" }, { status: 404 });
  }

  return json({ success: true });
};

export const PUT: RequestHandler = async ({
  locals,
  plannerDb,
  params,
  request,
}) => {
  const { activeWorkspaceId } = locals;
  const { id } = params;

  if (!id) {
    return json({ error: "Task ID required" }, { status: 400 });
  }

  const data = (await request.json()) as Task;

  const updatedTask = await plannerDb
    .updateTable(TABLES.TASKS)
    .set({
      ...data,
      taskDueDate: data.taskDueDate as string,
      completedAt: data.taskStatus === "completed" ? Date.now() : null,
      updatedAt: Date.now(),
    })
    .where("id", "=", id)
    .where("organizationId", "=", activeWorkspaceId)
    .returningAll()
    .executeTakeFirst();

  if (!updatedTask) {
    return json({ error: "Task not found" }, { status: 404 });
  }

  return json({ success: true, task: updatedTask });
};
