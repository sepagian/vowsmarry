import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { TABLES } from "$lib/constants/database";
import { validateDocumentFile } from "$lib/server/storage/file-validation";
import type { DocumentCategory } from "$lib/server/db/schema/types";

export const GET: RequestHandler = async ({ locals, plannerDb }) => {
  const { activeWorkspaceId } = locals;

  if (!activeWorkspaceId) {
    return json({ error: "No workspace" }, { status: 400 });
  }

  const documentList = await plannerDb
    .selectFrom(TABLES.DOCUMENTS)
    .selectAll()
    .where("organizationId", "=", activeWorkspaceId)
    .orderBy("documentDate", "asc")
    .execute();

  return json({ documents: documentList });
};

export const POST: RequestHandler = async ({ locals, plannerDb, request }) => {
  const { activeWorkspaceId } = locals;

  if (!activeWorkspaceId) {
    return json({ error: "No workspace" }, { status: 400 });
  }

  try {
    const formData = await request.formData();

    const documentName = formData.get("documentName") as string;
    const documentCategory = formData.get("documentCategory") as string;
    const documentDate = formData.get("documentDate") as string;
    const file = formData.get("file") as File;

    if (!documentName || !documentCategory || !documentDate || !file) {
      return json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!(file instanceof File)) {
      return json({ error: "Invalid file" }, { status: 400 });
    }

    const fileValidation = validateDocumentFile(file);
    if (!fileValidation.valid) {
      return json({ error: fileValidation.error }, { status: 400 });
    }

    const { uploadFile } = await import("$lib/server/storage");
    const uploadResult = await uploadFile(file, {
      pathPrefix: "documents",
      scopeId: activeWorkspaceId,
    });

    const newDocument = await plannerDb
      .insertInto(TABLES.DOCUMENTS)
      .values({
        id: crypto.randomUUID(),
        organizationId: activeWorkspaceId,
        documentName,
        documentCategory: documentCategory as DocumentCategory,
        documentDate,
        documentStatus: "pending",
        documentDueDate: null,
        fileUrl: uploadResult.fileUrl,
        fileName: uploadResult.fileName,
        fileSize: uploadResult.fileSize,
        mimeType: uploadResult.mimeType,
        reminderSent: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return json({ document: newDocument, success: true });
  } catch (error) {
    console.error("Document create error:", error);
    return json({ error: "Failed to create document" }, { status: 500 });
  }
};
