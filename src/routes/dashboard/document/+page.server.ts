import { error, fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";

import { handleActionError } from "$lib/server/error-handler";
import { uploadFile } from "$lib/server/storage";
import { validateDocumentFile } from "$lib/server/storage/file-validation";
import { documentSchema } from "$lib/validation/planner";
import { TABLES } from "$lib/constants/database";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const documentForm = await superValidate(valibot(documentSchema));

  return {
    documentForm,
  };
};

export const actions: Actions = {
  createDocument: async ({ locals, request, plannerDb }) => {
    const { activeWorkspaceId } = locals;

    if (!activeWorkspaceId) {
      throw error(404, "No active workspace found");
    }

    const formData = await request.formData();
    const form = await superValidate(request, valibot(documentSchema));

    const file = formData.get("file") as File | null;

    if (!file || !(file instanceof File) || file.size === 0) {
      return fail(400, { error: "A valid file is required" });
    }

    const fileValidation = validateDocumentFile(file);
    if (!fileValidation.valid) {
      return fail(400, { error: fileValidation.error });
    }

    try {
      const uploadResult = await uploadFile(file, {
        pathPrefix: "documents",
        scopeId: activeWorkspaceId,
      });

      const newDocument = await plannerDb
        .insertInto(TABLES.DOCUMENTS)
        .values({
          ...form.data,
          id: crypto.randomUUID(),
          organizationId: activeWorkspaceId,
          fileUrl: uploadResult.fileUrl,
          fileName: uploadResult.fileName,
          fileSize: uploadResult.fileSize,
          mimeType: uploadResult.mimeType,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      return { success: true, document: newDocument };
    } catch (error) {
      return handleActionError(error, "create document", {
        form: {
          errors: { form: ["Failed to upload document. Please try again."] },
        },
      });
    }
  },
};
