import { error, fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";

import { handleActionError } from "$lib/server/error-handler";
import { vendorSchema } from "$lib/validation/planner";
import { TABLES } from "$lib/constants/database";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const vendorForm = await superValidate(valibot(vendorSchema));

  return {
    vendorForm,
  };
};

export const actions: Actions = {
  createVendor: async ({ locals, request, plannerDb }) => {
    const { activeWorkspaceId } = locals;

    if (!activeWorkspaceId) {
      throw error(404, "No active workspace found");
    }

    const form = await superValidate(request, valibot(vendorSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      const now = Date.now();
      const newVendor = await plannerDb
        .insertInto(TABLES.VENDORS)
        .values({
          ...form.data,
          id: crypto.randomUUID(),
          organizationId: activeWorkspaceId,
          createdAt: now,
          updatedAt: now,
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      return { form, success: true, vendor: newVendor };
    } catch (error) {
      return handleActionError(error, "create vendor", { form });
    }
  },
};
