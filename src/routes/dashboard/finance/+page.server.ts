import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";

import { withAuth } from "$lib/server/auth";
import { handleActionError } from "$lib/server/error-handler";
import { expenseSchema } from "$lib/validation/planner";
import { TABLES } from "$lib/constants/database";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const { user } = locals;

  if (!user) {
    redirect(302, "/login");
  }

  const expenseForm = await superValidate(valibot(expenseSchema));

  return {
    expenseForm,
  };
};

export const actions: Actions = {
  createExpense: withAuth(
    async ({ organizationId, plannerDb }, { request }) => {
      const form = await superValidate(request, valibot(expenseSchema));
      if (!form.valid) {
        return fail(400, { form });
      }

      try {
        const now = Date.now();
        const newExpense = await plannerDb
          .insertInto(TABLES.EXPENSES)
          .values({
            ...form.data,
            id: crypto.randomUUID(),
            organizationId,
            createdAt: now,
            updatedAt: now,
          })
          .returningAll()
          .executeTakeFirstOrThrow();

        return { form, success: true, expense: newExpense };
      } catch (error) {
        return handleActionError(error, "create expense", { form });
      }
    }
  ),
};
