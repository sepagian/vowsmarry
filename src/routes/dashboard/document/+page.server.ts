import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";

import { withAuth } from "$lib/server/auth";
import { handleActionError } from "$lib/server/error-handler";
import { uploadFile } from "$lib/server/storage";
import { validateDocumentFile } from "$lib/server/storage/file-validation";
import { documentSchema } from "$lib/validation/planner";
import { TABLES } from "$lib/constants/database";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const { user } = locals;

  if (!user) {
    redirect(302, "/login");
  }

  const documentForm = await superValidate(valibot(documentSchema));

  return {
    documentForm,
  };
};

export const actions: Actions = {
  createDocument: withAuth(
    async ({ organizationId, plannerDb }, { request }) => {
      const formData = await request.formData();

      const documentName = formData.get("documentName") as string;
      const documentCategory = formData.get("documentCategory") as string;
      const documentDate = formData.get("documentDate") as string;
      const file = formData.get("file") as File | null;

      if (!(documentName && documentCategory && documentDate)) {
        return fail(400, { error: "Missing required fields" });
      }

      if (!(file && file instanceof File) || file.size === 0) {
        return fail(400, { error: "A valid file is required" });
      }

      const fileValidation = validateDocumentFile(file);
      if (!fileValidation.valid) {
        return fail(400, { error: fileValidation.error });
      }

      try {
        const uploadResult = await uploadFile(file, {
          pathPrefix: "documents",
          scopeId: organizationId,
        });

        const now = Date.now();
        const newDocument = await plannerDb
          .insertInto(TABLES.DOCUMENTS)
          .values({
            id: crypto.randomUUID(),
            organizationId,
            documentName,
            documentCategory: documentCategory as
              | "legal_formal"
              | "vendor_finance"
              | "guest_ceremony"
              | "personal_keepsake",
            documentDate,
            documentStatus: "pending",
            reminderSent: 0,
            fileUrl: uploadResult.fileUrl,
            fileName: uploadResult.fileName,
            fileSize: uploadResult.fileSize,
            mimeType: uploadResult.mimeType,
            createdAt: now,
            updatedAt: now,
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
    }
  ),
};
