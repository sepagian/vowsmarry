/**
 * Versatile file upload utilities for R2 storage
 * Supports documents, images, avatars, and any file type
 */

import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from './r2-client';
import { FileStorageError } from './file-errors';
import { sanitizeFileName } from './file-validation';

// ============================================================================
// Core Types
// ============================================================================

export interface UploadResult {
	fileUrl: string;
	fileName: string;
	fileSize: number;
	mimeType: string;
	key: string;
}

export interface UploadOptions {
	/** Path prefix for organizing files (e.g., 'documents', 'avatars', 'gallery') */
	pathPrefix: string;
	/** Scope identifier (e.g., weddingId, userId) for file organization */
	scopeId: string;
	/** Optional metadata to attach to the file */
	metadata?: Record<string, string>;
	/** Cache control header (default: 1 year) */
	cacheControl?: string;
}

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
	fileName: string
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
 *   scopeId: weddingId,
 *   metadata: { category: 'legal' }
 * });
 */
export async function uploadFile(
	file: File,
	options: UploadOptions
): Promise<UploadResult> {
	const { pathPrefix, scopeId, metadata, cacheControl = 'public, max-age=31536000' } = options;

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
		const message = error instanceof Error ? error.message : 'Unknown error';
		throw new FileStorageError(
			`Failed to upload file "${file.name}": ${message}`,
			error instanceof Error ? error : undefined
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
	options: UploadOptions
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
 */
export function extractFileKeyFromUrl(fileUrl: string): string {
	return fileUrl.replace(`${R2_PUBLIC_URL}/`, '');
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
			})
		);
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error';
		throw new FileStorageError(
			`Failed to delete file with key "${key}": ${message}`,
			error instanceof Error ? error : undefined
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
	await Promise.all(keys.map(key => deleteFileByKey(key)));
}

// ============================================================================
// Convenience Functions for Specific Use Cases
// ============================================================================

/**
 * Uploads a document file for a wedding
 * Path: documents/{weddingId}/{timestamp}-{fileName}
 */
export async function uploadDocumentFile(
	weddingId: string,
	file: File
): Promise<UploadResult> {
	return uploadFile(file, {
		pathPrefix: 'documents',
		scopeId: weddingId,
	});
}

/**
 * Uploads a gallery image for a wedding
 * Path: gallery/{weddingId}/{timestamp}-{fileName}
 */
export async function uploadGalleryImage(
	weddingId: string,
	file: File
): Promise<UploadResult> {
	return uploadFile(file, {
		pathPrefix: 'gallery',
		scopeId: weddingId,
	});
}

/**
 * Uploads an avatar image for a user
 * Path: avatars/{userId}/{timestamp}-{fileName}
 */
export async function uploadAvatarImage(
	userId: string,
	file: File
): Promise<UploadResult> {
	return uploadFile(file, {
		pathPrefix: 'avatars',
		scopeId: userId,
	});
}

/**
 * Uploads a vendor attachment for a wedding
 * Path: vendors/{weddingId}/{timestamp}-{fileName}
 */
export async function uploadVendorAttachment(
	weddingId: string,
	file: File
): Promise<UploadResult> {
	return uploadFile(file, {
		pathPrefix: 'vendors',
		scopeId: weddingId,
	});
}

/**
 * Uploads a dresscode image for a wedding
 * Path: dresscodes/{weddingId}/{timestamp}-{fileName}
 */
export async function uploadDresscodeImage(
	weddingId: string,
	file: File
): Promise<UploadResult> {
	return uploadFile(file, {
		pathPrefix: 'dresscodes',
		scopeId: weddingId,
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
 *     scopeId: weddingId
 *   });
 *   // New file uploaded successfully, old file deleted
 * } catch (error) {
 *   // Upload failed, old file remains unchanged
 * }
 */
export async function replaceFile(
	oldFileUrl: string,
	file: File,
	options: UploadOptions
): Promise<UploadResult> {
	let newFileResult: UploadResult;

	try {
		// Upload new file first - if this fails, old file remains unchanged
		newFileResult = await uploadFile(file, options);
	} catch (error) {
		// Upload failed - old file is retained, no changes made
		throw error;
	}

	// New file uploaded successfully, now delete old file
	try {
		await deleteFileByUrl(oldFileUrl);
	} catch (error) {
		// Log error but don't fail the operation
		// New file is already uploaded and will be used
		// Old file remains in storage (orphaned but acceptable to prevent data loss)
		console.error('Failed to delete old file during replacement:', error);
	}

	return newFileResult;
}
