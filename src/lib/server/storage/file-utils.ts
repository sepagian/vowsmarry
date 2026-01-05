/**
 * Versatile file upload utilities for R2 storage
 * Supports documents, images, avatars, and any file type
 * Integrates with Kysely for D1 metadata storage
 */

import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import type { Kysely } from "kysely";

import type { Database } from "$lib/server/db/schema/types";

import { FileStorageError } from "./file-errors";
import { sanitizeFileName } from "./file-validation";
import { R2_BUCKET_NAME, R2_PUBLIC_URL, r2Client } from "./r2-client";

// ============================================================================
// Core Types
// ============================================================================

export type UploadResult = {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  key: string;
};

export type UploadOptions = {
  /** Path prefix for organizing files (e.g., 'documents', 'avatars', 'gallery') */
  pathPrefix: string;
  /** Scope identifier (e.g., organizationId, userId) for file organization */
  scopeId: string;
  /** Optional metadata to attach to the file */
  metadata?: Record<string, string>;
  /** Cache control header (default: 1 year) */
  cacheControl?: string;
};

export type DocumentUploadOptions = UploadOptions & {
  /** Kysely database instance for storing document metadata */
  db: Kysely<Database>;
  /** Organization ID for the document */
  organizationId: string;
  /** Document name */
  documentName: string;
  /** Document category */
  documentCategory:
    | "legal_formal"
    | "vendor_finance"
    | "guest_ceremony"
    | "personal_keepsake";
  /** Document date (ISO date string) */
  documentDate: string;
  /** Document status */
  documentStatus?: "pending" | "approved" | "rejected";
  /** Document due date (ISO date string) */
  documentDueDate?: string;
};

export type GalleryUploadOptions = UploadOptions & {
  /** Kysely database instance for storing gallery metadata */
  db: Kysely<Database>;
  /** Invitation ID for the gallery item */
  invitationId: string;
  /** Gallery type */
  type: "photo" | "video";
  /** User ID who uploaded the file */
  uploadedBy: string;
  /** Sort order */
  sortOrder: number;
  /** Optional description */
  description?: string;
  /** Optional caption */
  caption?: string;
  /** Is public flag */
  isPublic?: boolean;
};

// ============================================================================
// Core Upload Functions
// ============================================================================

/**
 * Generates a unique file key for R2 storage
 * Format: {pathPrefix}/{scopeId}/{timestamp}-{sanitizedFileName}
 *
 * @example
 * generateFileKey('documents', 'wedding-123', 'My Document.pdf')
 * // Returns: 'documents/wedding-123/1234567890-my-document.pdf'
 */
export function generateFileKey(
  pathPrefix: string,
  scopeId: string,
  fileName: string,
): string {
  const timestamp = Date.now();
  const sanitized = sanitizeFileName(fileName);
  return `${pathPrefix}/${scopeId}/${timestamp}-${sanitized}`;
}

/**
 * Uploads a file to R2 storage
 *
 * @param file - The file to upload
 * @param options - Upload configuration
 * @returns Upload result with file URL and metadata
 * @throws FileStorageError if upload fails
 *
 * @example
 * const result = await uploadFile(file, {
 *   pathPrefix: 'documents',
 *   scopeId: organizationId,
 *   metadata: { category: 'legal' }
 * });
 */
export async function uploadFile(
  file: File,
  options: UploadOptions,
): Promise<UploadResult> {
  const {
    pathPrefix,
    scopeId,
    metadata,
    cacheControl = "public, max-age=31536000",
  } = options;

  try {
    // Generate unique file key
    const fileKey = generateFileKey(pathPrefix, scopeId, file.name);

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Prepare upload command
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileKey,
      Body: buffer,
      ContentType: file.type,
      ContentLength: file.size,
      CacheControl: cacheControl,
      Metadata: metadata,
    });

    // Upload to R2
    await r2Client.send(command);

    // Construct public URL
    const fileUrl = `${R2_PUBLIC_URL}/${fileKey}`;

    return {
      fileUrl,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      key: fileKey,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new FileStorageError(
      `Failed to upload file "${file.name}": ${message}`,
      error instanceof Error ? error : undefined,
    );
  }
}

/**
 * Uploads multiple files in sequence
 *
 * @param files - Array of files to upload
 * @param options - Upload configuration (same for all files)
 * @returns Array of upload results
 * @throws FileStorageError if any upload fails
 */
export async function uploadFiles(
  files: File[],
  options: UploadOptions,
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];

  for (const file of files) {
    const result = await uploadFile(file, options);
    results.push(result);
  }

  return results;
}

// ============================================================================
// Delete Functions
// ============================================================================

/**
 * Extracts the R2 file key from a public URL
 * Handles both configured R2_PUBLIC_URL and generic R2 URLs
 */
export function extractFileKeyFromUrl(fileUrl: string): string {
  let key = fileUrl;

  // Try to use configured R2_PUBLIC_URL first
  if (R2_PUBLIC_URL && fileUrl.startsWith(R2_PUBLIC_URL)) {
    key = fileUrl.replace(`${R2_PUBLIC_URL}/`, "");
  }
  // Check if it's a path-only URL (starts with /)
  else if (fileUrl.startsWith("/")) {
    key = fileUrl.substring(1);
  }
  // Fallback: extract everything after the domain
  else {
    try {
      const url = new URL(fileUrl);
      key = url.pathname.substring(1);
    } catch {
      // If URL parsing fails and it's not a path, return as-is
      key = fileUrl;
    }
  }

  return key;
}

/**
 * Deletes a file from R2 storage by its key
 *
 * @param key - The R2 storage key
 * @throws FileStorageError if deletion fails
 */
export async function deleteFileByKey(key: string): Promise<void> {
  try {
    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
      }),
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new FileStorageError(
      `Failed to delete file with key "${key}": ${message}`,
      error instanceof Error ? error : undefined,
    );
  }
}

/**
 * Deletes a document file and its metadata from D1
 *
 * @param documentId - The document ID in the database
 * @param db - Kysely database instance
 * @throws FileStorageError if deletion fails
 */
export async function deleteDocumentFile(
  documentId: string,
  db: Kysely<Database>,
): Promise<void> {
  try {
    // Get document metadata from D1
    const document = await db
      .selectFrom("documents")
      .select(["fileUrl"])
      .where("id", "=", documentId)
      .executeTakeFirst();

    if (!document) {
      throw new FileStorageError(`Document with ID "${documentId}" not found`);
    }

    // Extract file key from URL
    const fileKey = extractFileKeyFromUrl(document.fileUrl);

    // Delete from R2
    await deleteFileByKey(fileKey);

    // Delete metadata from D1
    await db.deleteFrom("documents").where("id", "=", documentId).execute();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new FileStorageError(
      `Failed to delete document: ${message}`,
      error instanceof Error ? error : undefined,
    );
  }
}

/**
 * Deletes a gallery file and its metadata from D1
 *
 * @param galleryId - The gallery item ID in the database
 * @param db - Kysely database instance
 * @throws FileStorageError if deletion fails
 */
export async function deleteGalleryFile(
  galleryId: string,
  db: Kysely<Database>,
): Promise<void> {
  try {
    // Get gallery metadata from D1
    const galleryItem = await db
      .selectFrom("gallery")
      .select(["url"])
      .where("id", "=", galleryId)
      .executeTakeFirst();

    if (!galleryItem) {
      throw new FileStorageError(
        `Gallery item with ID "${galleryId}" not found`,
      );
    }

    // Extract file key from URL
    const fileKey = extractFileKeyFromUrl(galleryItem.url);

    // Delete from R2
    await deleteFileByKey(fileKey);

    // Delete metadata from D1
    await db.deleteFrom("gallery").where("id", "=", galleryId).execute();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new FileStorageError(
      `Failed to delete gallery item: ${message}`,
      error instanceof Error ? error : undefined,
    );
  }
}

/**
 * Deletes a file from R2 storage by its public URL
 *
 * @param fileUrl - The public URL of the file
 * @throws FileStorageError if deletion fails
 */
export async function deleteFileByUrl(fileUrl: string): Promise<void> {
  const key = extractFileKeyFromUrl(fileUrl);
  await deleteFileByKey(key);
}

/**
 * Deletes multiple files by their keys
 *
 * @param keys - Array of R2 storage keys
 */
export async function deleteFiles(keys: string[]): Promise<void> {
  await Promise.all(keys.map((key) => deleteFileByKey(key)));
}

// ============================================================================
// Query Functions for File Metadata
// ============================================================================

/**
 * Gets document metadata from D1
 *
 * @param documentId - The document ID
 * @param db - Kysely database instance
 * @returns Document metadata or null if not found
 */
export async function getDocumentMetadata(
  documentId: string,
  db: Kysely<Database>,
) {
  return await db
    .selectFrom("documents")
    .selectAll()
    .where("id", "=", documentId)
    .executeTakeFirst();
}

/**
 * Gets all documents for an organization from D1
 *
 * @param organizationId - The organization ID
 * @param db - Kysely database instance
 * @returns Array of document metadata
 */
export async function getOrganizationDocuments(
  organizationId: string,
  db: Kysely<Database>,
) {
  return await db
    .selectFrom("documents")
    .selectAll()
    .where("organizationId", "=", organizationId)
    .orderBy("createdAt", "desc")
    .execute();
}

/**
 * Gets gallery item metadata from D1
 *
 * @param galleryId - The gallery item ID
 * @param db - Kysely database instance
 * @returns Gallery item metadata or null if not found
 */
export async function getGalleryMetadata(
  galleryId: string,
  db: Kysely<Database>,
) {
  return await db
    .selectFrom("gallery")
    .selectAll()
    .where("id", "=", galleryId)
    .executeTakeFirst();
}

/**
 * Gets all gallery items for an invitation from D1
 *
 * @param invitationId - The invitation ID
 * @param db - Kysely database instance
 * @returns Array of gallery item metadata
 */
export async function getInvitationGallery(
  invitationId: string,
  db: Kysely<Database>,
) {
  return await db
    .selectFrom("gallery")
    .selectAll()
    .where("invitationId", "=", invitationId)
    .orderBy("sortOrder", "asc")
    .execute();
}

// ============================================================================
// Convenience Functions for Specific Use Cases
// ============================================================================

/**
 * Uploads a document file for an organization and stores metadata in D1
 * Path: documents/{organizationId}/{timestamp}-{fileName}
 *
 * @param file - The file to upload
 * @param options - Document upload options including database instance
 * @returns Upload result with file URL and metadata
 * @throws FileStorageError if upload or database operation fails
 */
export async function uploadDocumentFile(
  file: File,
  options: DocumentUploadOptions,
): Promise<UploadResult> {
  const {
    db,
    organizationId,
    documentName,
    documentCategory,
    documentDate,
    documentStatus = "pending",
    documentDueDate,
  } = options;

  // Upload file to R2
  const uploadResult = await uploadFile(file, {
    pathPrefix: "documents",
    scopeId: organizationId,
    metadata: options.metadata,
    cacheControl: options.cacheControl,
  });

  try {
    // Store metadata in D1 using Kysely
    await db
      .insertInto("documents")
      .values({
        id: crypto.randomUUID(),
        organizationId,
        documentName,
        documentCategory,
        documentDate,
        documentStatus,
        documentDueDate: documentDueDate || null,
        fileUrl: uploadResult.fileUrl,
        fileName: uploadResult.fileName,
        fileSize: uploadResult.fileSize,
        mimeType: uploadResult.mimeType,
        reminderSent: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .execute();

    return uploadResult;
  } catch (error) {
    // If database operation fails, attempt to clean up the uploaded file
    try {
      await deleteFileByKey(uploadResult.key);
    } catch (cleanupError) {
      console.error(
        "Failed to clean up file after database error:",
        cleanupError,
      );
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    throw new FileStorageError(
      `Failed to store document metadata: ${message}`,
      error instanceof Error ? error : undefined,
    );
  }
}

/**
 * Uploads a gallery image for an invitation and stores metadata in D1
 * Path: gallery/{invitationId}/{timestamp}-{fileName}
 *
 * @param file - The file to upload
 * @param options - Gallery upload options including database instance
 * @returns Upload result with file URL and metadata
 * @throws FileStorageError if upload or database operation fails
 */
export async function uploadGalleryImage(
  file: File,
  options: GalleryUploadOptions,
): Promise<UploadResult> {
  const {
    db,
    invitationId,
    type,
    uploadedBy,
    sortOrder,
    description,
    caption,
    isPublic = false,
  } = options;

  // Upload file to R2
  const uploadResult = await uploadFile(file, {
    pathPrefix: "gallery",
    scopeId: invitationId,
    metadata: options.metadata,
    cacheControl: options.cacheControl,
  });

  try {
    // Store metadata in D1 using Kysely
    await db
      .insertInto("gallery")
      .values({
        id: crypto.randomUUID(),
        invitationId,
        type,
        url: uploadResult.fileUrl,
        description: description || null,
        fileName: uploadResult.fileName,
        fileSize: uploadResult.fileSize,
        mimeType: uploadResult.mimeType,
        caption: caption || null,
        sortOrder,
        isPublic: isPublic ? 1 : 0,
        uploadedBy,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .execute();

    return uploadResult;
  } catch (error) {
    // If database operation fails, attempt to clean up the uploaded file
    try {
      await deleteFileByKey(uploadResult.key);
    } catch (cleanupError) {
      console.error(
        "Failed to clean up file after database error:",
        cleanupError,
      );
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    throw new FileStorageError(
      `Failed to store gallery metadata: ${message}`,
      error instanceof Error ? error : undefined,
    );
  }
}

/**
 * Uploads an avatar image for a user
 * Path: avatars/{userId}/{timestamp}-{fileName}
 * Note: Avatar URLs are stored in the users table, not in a separate file metadata table
 */
export async function uploadAvatarImage(
  userId: string,
  file: File,
): Promise<UploadResult> {
  return uploadFile(file, {
    pathPrefix: "avatars",
    scopeId: userId,
  });
}

/**
 * Uploads a vendor attachment for an organization
 * Path: vendors/{organizationId}/{timestamp}-{fileName}
 * Note: Vendor attachment URLs can be stored in vendor-related tables
 */
export async function uploadVendorAttachment(
  organizationId: string,
  file: File,
): Promise<UploadResult> {
  return uploadFile(file, {
    pathPrefix: "vendors",
    scopeId: organizationId,
  });
}

/**
 * Uploads a dresscode image for an organization
 * Path: dresscodes/{organizationId}/{timestamp}-{fileName}
 * Note: Dresscode image URLs are stored in the dresscodes table
 */
export async function uploadDresscodeImage(
  organizationId: string,
  file: File,
): Promise<UploadResult> {
  return uploadFile(file, {
    pathPrefix: "dresscodes",
    scopeId: organizationId,
  });
}

/**
 * Replaces an existing file with a new one
 * Uploads the new file first, then deletes the old file
 * If the new file upload fails, the old file is retained (no changes made)
 * If the new file uploads successfully but old file deletion fails, the new file is still used
 *
 * @param oldFileUrl - URL of the file to replace
 * @param file - New file to upload
 * @param options - Upload configuration
 * @returns Upload result for the new file
 * @throws FileStorageError if new file upload fails (old file remains unchanged)
 *
 * @example
 * try {
 *   const result = await replaceFile(oldUrl, newFile, {
 *     pathPrefix: 'documents',
 *     scopeId: organizationId
 *   });
 *   // New file uploaded successfully, old file deleted
 * } catch (error) {
 *   // Upload failed, old file remains unchanged
 * }
 */
export async function replaceFile(
  oldFileUrl: string,
  file: File,
  options: UploadOptions,
): Promise<UploadResult> {
  // Upload new file first - if this fails, old file remains unchanged
  const newFileResult = await uploadFile(file, options);

  // New file uploaded successfully, now delete old file
  try {
    await deleteFileByUrl(oldFileUrl);
  } catch (error) {
    // Log error but don't fail the operation
    // New file is already uploaded and will be used
    // Old file remains in storage (orphaned but acceptable to prevent data loss)
    console.error("Failed to delete old file during replacement:", error);
  }

  return newFileResult;
}
