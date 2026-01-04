import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { TABLES } from "$lib/constants/database";
import { validateDocumentFile } from "$lib/server/storage/file-validation";
import { extractFileKeyFromUrl } from "$lib/server/storage/file-utils";
import { r2Client, R2_BUCKET_NAME } from "$lib/server/storage/r2-client";
import {
  DeleteObjectCommand,
  type DeleteObjectCommandInput,
} from "@aws-sdk/client-s3";

export const PUT: RequestHandler = async ({
  locals,
  plannerDb,
  params,
  request,
}) => {
  const { activeWorkspaceId } = locals;
  const { id } = params;

  if (!activeWorkspaceId) {
    return error(400, "No workspace");
  }

  if (!id) {
    return error(400, "Document ID is required");
  }

  try {
    const formData = await request.formData();

    const existingDocument = await plannerDb
      .selectFrom(TABLES.DOCUMENTS)
      .selectAll()
      .where("id", "=", id)
      .where("organizationId", "=", activeWorkspaceId)
      .executeTakeFirst();

    if (!existingDocument) {
      return error(404, "Document not found");
    }

    const documentName = formData.get("documentName") as string;
    const documentCategory = formData.get("documentCategory") as string;
    const documentDate = formData.get("documentDate") as string;
    const file = formData.get("file") as File | null;

    let fileMetadata = {
      fileUrl: existingDocument.fileUrl,
      fileName: existingDocument.fileName,
      fileSize: existingDocument.fileSize,
      mimeType: existingDocument.mimeType,
    };

    if (file && file instanceof File && file.size > 0) {
      const fileValidation = validateDocumentFile(file);
      if (!fileValidation.valid) {
        return error(400, fileValidation.error);
      }

      const { replaceFile } = await import("$lib/server/storage");
      const uploadResult = await replaceFile(existingDocument.fileUrl, file, {
        pathPrefix: "documents",
        scopeId: activeWorkspaceId,
      });

      fileMetadata = {
        fileUrl: uploadResult.fileUrl,
        fileName: uploadResult.fileName,
        fileSize: uploadResult.fileSize,
        mimeType: uploadResult.mimeType,
      };
    }

    const updatedDocument = await plannerDb
      .updateTable(TABLES.DOCUMENTS)
      .set({
        documentName: documentName || existingDocument.documentName,
        documentCategory:
          (documentCategory as any) || existingDocument.documentCategory,
        documentDate: documentDate || existingDocument.documentDate,
        ...fileMetadata,
        updatedAt: Date.now(),
      })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirstOrThrow();

    return json({ document: updatedDocument, success: true });
  } catch (err) {
    console.error("Document update error:", err);
    return error(500, "Failed to update document");
  }
};

export const DELETE: RequestHandler = async ({ locals, plannerDb, params }) => {
  const { activeWorkspaceId } = locals;
  const { id } = params;

  console.log("[DELETE] Starting delete for document:", id);
  console.log("[DELETE] R2_BUCKET_NAME:", R2_BUCKET_NAME);

  if (!activeWorkspaceId) {
    return error(400, "No workspace");
  }

  if (!id) {
    return error(400, "Document ID is required");
  }

  const existingDocument = await plannerDb
    .selectFrom(TABLES.DOCUMENTS)
    .selectAll()
    .where("id", "=", id)
    .where("organizationId", "=", activeWorkspaceId)
    .executeTakeFirst();

  if (!existingDocument) {
    console.log("[DELETE] Document not found in DB");
    return error(404, "Document not found");
  }

  console.log("[DELETE] Found document:", {
    id: existingDocument.id,
    fileUrl: existingDocument.fileUrl,
    fileName: existingDocument.fileName,
    mimeType: existingDocument.mimeType,
  });

  if (existingDocument.fileUrl && existingDocument.fileUrl.trim() !== "") {
    console.log("[DELETE] fileUrl is present, proceeding with deletion");

    const key = extractFileKeyFromUrl(existingDocument.fileUrl);
    console.log("[DELETE] Extracted key:", key);

    const deleteParams: DeleteObjectCommandInput = {
      Bucket: R2_BUCKET_NAME,
      Key: key,
    };

    console.log(
      "[DELETE] Sending DeleteObjectCommand:",
      JSON.stringify(deleteParams, null, 2)
    );

    try {
      const result = await r2Client.send(new DeleteObjectCommand(deleteParams));
      console.log("[DELETE] R2 delete result:", result);
    } catch (r2Error) {
      console.error("[DELETE] R2 delete failed:", r2Error);
      throw r2Error;
    }
  } else {
    console.log("[DELETE] No fileUrl to delete, skipping R2 deletion");
  }

  await plannerDb.deleteFrom(TABLES.DOCUMENTS).where("id", "=", id).execute();
  console.log("[DELETE] Document deleted from D1");

  return json({ success: true, message: "Document deleted successfully" });
};
