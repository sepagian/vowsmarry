import type { FileUploadResult } from '$lib/server/storage/file-utils.js';

export interface ClientFileUploadOptions {
	generateThumbnail?: boolean;
	maxSize?: number;
	allowedTypes?: string[];
	onProgress?: (completed: number, total: number) => void;
	onError?: (error: string) => void;
}

export interface FileUploadResponse {
	success: boolean;
	files?: FileUploadResult[];
	error?: string;
}

/**
 * Upload files from the client side
 */
export async function uploadFilesClient(
	files: File[],
	options: ClientFileUploadOptions = {}
): Promise<FileUploadResponse> {
	const {
		generateThumbnail = false,
		maxSize = 10 * 1024 * 1024,
		allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'],
		onProgress,
		onError
	} = options;

	try {
		// Validate files before upload
		for (const file of files) {
			if (file.size > maxSize) {
				const error = `File "${file.name}" is too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB`;
				onError?.(error);
				return { success: false, error };
			}

			if (!allowedTypes.includes(file.type)) {
				const error = `File type "${file.type}" is not allowed for file "${file.name}"`;
				onError?.(error);
				return { success: false, error };
			}
		}

		// Create form data
		const formData = new FormData();
		files.forEach((file, index) => {
			formData.append(`file_${index}`, file);
		});

		formData.append('generateThumbnail', generateThumbnail.toString());
		formData.append('maxSize', maxSize.toString());
		formData.append('allowedTypes', JSON.stringify(allowedTypes));

		// Upload with progress tracking
		const response = await fetch('/api/upload', {
			method: 'POST',
			body: formData
		});

		if (!response.ok) {
			const errorData = await response.json();
			const error = errorData.message || 'Upload failed';
			onError?.(error);
			return { success: false, error };
		}

		const results: FileUploadResult[] = await response.json();
		onProgress?.(files.length, files.length);

		return { success: true, files: results };

	} catch (err) {
		const error = err instanceof Error ? err.message : 'Upload failed';
		onError?.(error);
		return { success: false, error };
	}
}

/**
 * Delete files from the client side
 */
export async function deleteFilesClient(keys: string[]): Promise<{ success: boolean; error?: string }> {
	try {
		const response = await fetch('/api/upload', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ keys })
		});

		if (!response.ok) {
			const errorData = await response.json();
			return { success: false, error: errorData.message || 'Delete failed' };
		}

		return { success: true };

	} catch (err) {
		const error = err instanceof Error ? err.message : 'Delete failed';
		return { success: false, error };
	}
}

/**
 * Validate file before upload
 */
export function validateFileClient(
	file: File,
	options: { maxSize?: number; allowedTypes?: string[] } = {}
): { isValid: boolean; error?: string } {
	const {
		maxSize = 10 * 1024 * 1024,
		allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
	} = options;

	if (file.size > maxSize) {
		return {
			isValid: false,
			error: `File "${file.name}" is too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB`
		};
	}

	if (!allowedTypes.includes(file.type)) {
		return {
			isValid: false,
			error: `File type "${file.type}" is not allowed`
		};
	}

	return { isValid: true };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
	if (bytes === 0) return '0 Bytes';
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Generate preview URL for image files
 */
export function generatePreviewUrl(file: File): string | null {
	if (!file.type.startsWith('image/')) {
		return null;
	}
	return URL.createObjectURL(file);
}

/**
 * Cleanup preview URLs to prevent memory leaks
 */
export function cleanupPreviewUrls(urls: string[]): void {
	urls.forEach(url => {
		if (url.startsWith('blob:')) {
			URL.revokeObjectURL(url);
		}
	});
}