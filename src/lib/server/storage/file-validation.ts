/**
 * File validation utilities for document uploads
 * Validates file size, MIME type, and sanitizes file names
 */

export interface ValidationResult {
	valid: boolean;
	error?: string;
}

export interface FileConstraints {
	maxSizeBytes: number;
	allowedMimeTypes: string[];
}

/**
 * Default constraints for document uploads
 */
export const DOCUMENT_CONSTRAINTS: FileConstraints = {
	maxSizeBytes: 10 * 1024 * 1024, // 10MB
	allowedMimeTypes: [
		'application/pdf',
		'image/jpeg',
		'image/png',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
	],
};

/**
 * Validates a document file against size and MIME type constraints
 * @param file - The file to validate
 * @param constraints - Optional custom constraints (defaults to DOCUMENT_CONSTRAINTS)
 * @returns ValidationResult with valid flag and optional error message
 */
export function validateDocumentFile(
	file: File,
	constraints: FileConstraints = DOCUMENT_CONSTRAINTS,
): ValidationResult {
	// Validate file size
	if (file.size > constraints.maxSizeBytes) {
		const maxSizeMB = Math.round(constraints.maxSizeBytes / 1024 / 1024);
		return {
			valid: false,
			error: `File size must not exceed ${maxSizeMB}MB`,
		};
	}

	// Validate MIME type
	if (!constraints.allowedMimeTypes.includes(file.type)) {
		return {
			valid: false,
			error: 'Only PDF, JPEG, PNG, and DOCX files are allowed',
		};
	}

	return { valid: true };
}

/**
 * Sanitizes a file name by removing or replacing unsafe characters
 * - Removes leading/trailing whitespace
 * - Replaces spaces with hyphens
 * - Removes special characters except hyphens, underscores, and dots
 * - Converts to lowercase
 * - Preserves file extension
 * @param fileName - The original file name
 * @returns Sanitized file name
 */
export function sanitizeFileName(fileName: string): string {
	// Extract extension
	const lastDotIndex = fileName.lastIndexOf('.');
	const extension = lastDotIndex !== -1 ? fileName.substring(lastDotIndex) : '';
	const nameWithoutExtension = lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;

	// Sanitize the name part
	const sanitized = nameWithoutExtension
		.trim() // Remove leading/trailing whitespace
		.toLowerCase() // Convert to lowercase
		.replace(/\s+/g, '-') // Replace spaces with hyphens
		.replace(/[^a-z0-9-_]/g, '') // Remove special characters except hyphens and underscores
		.replace(/-+/g, '-') // Replace multiple consecutive hyphens with single hyphen
		.replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

	// Return sanitized name with original extension (also sanitized)
	const sanitizedExtension = extension.toLowerCase().replace(/[^a-z0-9.]/g, '');
	
	return sanitized + sanitizedExtension;
}

/**
 * Validates document file size only
 * @param file - The file to validate
 * @param maxSizeBytes - Maximum allowed file size in bytes
 * @returns ValidationResult with valid flag and optional error message
 */
export function validateDocumentFileSize(file: File, maxSizeBytes: number): ValidationResult {
	if (file.size > maxSizeBytes) {
		const maxSizeMB = Math.round(maxSizeBytes / 1024 / 1024);
		return {
			valid: false,
			error: `File size must not exceed ${maxSizeMB}MB`,
		};
	}
	return { valid: true };
}

/**
 * Validates document MIME type only
 * @param file - The file to validate
 * @param allowedMimeTypes - Array of allowed MIME types
 * @returns ValidationResult with valid flag and optional error message
 */
export function validateDocumentMimeType(file: File, allowedMimeTypes: string[]): ValidationResult {
	if (!allowedMimeTypes.includes(file.type)) {
		return {
			valid: false,
			error: 'Only PDF, JPEG, PNG, and DOCX files are allowed',
		};
	}
	return { valid: true };
}
