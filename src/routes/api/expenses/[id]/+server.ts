import { json } from "@sveltejs/kit";

import { TABLES } from "$lib/constants/database";
import type { Expense } from "$lib/types";

import type { RequestHandler } from "./$types";

export const DELETE: RequestHandler = async ({ locals, plannerDb, params }) => {
  const { activeWorkspaceId } = locals;
  const { id } = params;

  if (!id) {
    return json({ error: "Missing expense ID" }, { status: 400 });
  }

  const deleteExpense = await plannerDb
    .deleteFrom(TABLES.EXPENSES)
    .where("id", "=", id)
    .where("organizationId", "=", activeWorkspaceId)
    .returningAll()
    .executeTakeFirst();

  if (!deleteExpense) {
    return json({ error: "Expense not found" }, { status: 404 });
  }

  return json({ success: true, message: "Expense deleted successfully" });
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
    return json({ error: "Missing expense ID" }, { status: 400 });
  }

  const data = (await request.json()) as Expense;

  const updatedExpense = await plannerDb
    .updateTable(TABLES.EXPENSES)
    .set({
      ...data,
    })
    .where("id", "=", id)
    .where("organizationId", "=", activeWorkspaceId)
    .returningAll()
    .executeTakeFirst();

  if (!updatedExpense) {
    return json({ error: "Expense not found" }, { status: 404 });
  }

  return json({ success: true, message: "Expense updated successfully" });
};
