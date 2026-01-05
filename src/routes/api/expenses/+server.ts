import { json } from "@sveltejs/kit";

import { TABLES } from "$lib/constants/database";
import type { Expense, ExpenseStatus } from "$lib/types";

import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals, plannerDb }) => {
  const { activeWorkspaceId } = locals;

  if (!activeWorkspaceId) {
    return json({ error: "No workspace" }, { status: 400 });
  }

  const plannedBudget = Number(
    (
      await plannerDb
        .selectFrom("organization")
        .select("weddingBudget")
        .where("id", "=", activeWorkspaceId)
        .executeTakeFirst()
    )?.weddingBudget ?? 0
  );

  const [budgetSpent, totalSavings, planned, spent, expenses] =
    await Promise.all([
      plannerDb
        .selectFrom(TABLES.EXPENSES)
        .select((eb) => eb.fn.sum<number>("expenseAmount").as("total"))
        .where("organizationId", "=", activeWorkspaceId)
        .executeTakeFirst()
        .then((r) => r?.total ?? 0),

      plannerDb
        .selectFrom("savings_items")
        .select((eb) => eb.fn.sum<number>("savingAmount").as("total"))
        .where("organizationId", "=", activeWorkspaceId)
        .executeTakeFirst()
        .then((r) => r?.total ?? 0),

      plannerDb
        .selectFrom("organization")
        .select("createdAt")
        .where("id", "=", activeWorkspaceId)
        .executeTakeFirst()
        .then((r) => r?.createdAt || null),

      plannerDb
        .selectFrom(TABLES.EXPENSES)
        .select("updatedAt")
        .where("organizationId", "=", activeWorkspaceId)
        .orderBy("updatedAt", "desc")
        .limit(1)
        .executeTakeFirst()
        .then((r) => r?.updatedAt || null),

      plannerDb
        .selectFrom(TABLES.EXPENSES)
        .selectAll()
        .where("organizationId", "=", activeWorkspaceId)
        .orderBy("createdAt", "desc")
        .execute(),
    ]);

  const budgetRemaining = (plannedBudget - budgetSpent).toString();
  const savingProgress =
    plannedBudget > 0 ? Math.floor((totalSavings / plannedBudget) * 100) : 0;

  return json({
    expenses,
    financeStats: {
      plannedBudget: plannedBudget.toString(),
      budgetSpent: budgetSpent.toString(),
      totalSavings: totalSavings.toString(),
      budgetRemaining,
      savingProgress,
    },
    update: { planned, spent },
  });
};

export const POST: RequestHandler = async ({ locals, plannerDb, request }) => {
  const { activeWorkspaceId } = locals;
  const data = (await request.json()) as Expense;

  const newExpense = await plannerDb
    .insertInto(TABLES.EXPENSES)
    .values({
      ...data,
      id: crypto.randomUUID(),
      organizationId: activeWorkspaceId as string,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
    .returningAll()
    .executeTakeFirst();

  return json(newExpense);
};

export const PATCH: RequestHandler = async ({ locals, plannerDb, request }) => {
  const { activeWorkspaceId } = locals;
  const { id, status }: { id: string; status: ExpenseStatus } =
    await request.json();

  const updatedExpense = await plannerDb
    .updateTable(TABLES.EXPENSES)
    .set({
      expensePaymentStatus: status,
      updatedAt: Date.now(),
    })
    .where("id", "=", id)
    .where("organizationId", "=", activeWorkspaceId)
    .returningAll()
    .executeTakeFirst();

  return json({ success: true, updatedExpense });
};
