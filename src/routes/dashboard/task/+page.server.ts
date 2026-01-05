import { error, fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";

import { handleActionError } from "$lib/server/error-handler";
import { taskSchema } from "$lib/validation/planner";
import { TABLES } from "$lib/constants/database";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const taskForm = await superValidate(valibot(taskSchema));

  return {
    taskForm,
  };
};

export const actions: Actions = {
  createTask: async ({ locals, request, plannerDb }) => {
    const { user, activeWorkspaceId } = locals;

    if (!activeWorkspaceId) {
      throw error(404, "No active workspace found");
    }
    if (!user) {
      throw error(401, "Authentication required");
    }

    const form = await superValidate(request, valibot(taskSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      const newTask = await plannerDb
        .insertInto(TABLES.TASKS)
        .values({
          ...form.data,
          id: crypto.randomUUID(),
          organizationId: activeWorkspaceId,
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
  },
};
