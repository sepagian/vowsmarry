import { RETRY_CONFIG } from '$lib/constants/config.js';

/**
 * Custom error classes for file operations
 */

export class FileUploadError extends Error {
	constructor(
		message: string,
		public code: string,
		public statusCode: number = 400,
	) {
		super(message);
		this.name = 'FileUploadError';
	}
}

export class FileValidationError extends FileUploadError {
	constructor(
		message: string,
		public fileName?: string,
	) {
		super(message, 'VALIDATION_ERROR', 400);
		this.name = 'FileValidationError';
	}
}

export class FileSizeError extends FileValidationError {
	constructor(fileName: string, actualSize: number, maxSize: number) {
		const actualSizeMB = Math.round((actualSize / 1024 / 1024) * 100) / 100;
		const maxSizeMB = Math.round(maxSize / 1024 / 1024);
		super(
			`File "${fileName}" is too large (${actualSizeMB}MB). Maximum allowed size is ${maxSizeMB}MB`,
			fileName,
		);
		this.name = 'FileSizeError';
	}
}

export class FileTypeError extends FileValidationError {
	constructor(fileName: string, actualType: string, allowedTypes: string[]) {
		super(
			`File "${fileName}" has unsupported type "${actualType}". Allowed types: ${allowedTypes.join(', ')}`,
			fileName,
		);
		this.name = 'FileTypeError';
	}
}

export class FileStorageError extends FileUploadError {
	constructor(
		message: string,
		public originalError?: Error,
	) {
		super(message, 'STORAGE_ERROR', 500);
		this.name = 'FileStorageError';
	}
}

export class FileProcessingError extends FileUploadError {
	constructor(
		message: string,
		public fileName?: string,
		public originalError?: Error,
	) {
		super(message, 'PROCESSING_ERROR', 500);
		this.name = 'FileProcessingError';
	}
}

export class FileNotFoundError extends FileUploadError {
	constructor(key: string) {
		super(`File with key "${key}" not found`, 'NOT_FOUND', 404);
		this.name = 'FileNotFoundError';
	}
}

export class FileAccessError extends FileUploadError {
	constructor(key: string, operation: string) {
		super(`Access denied for ${operation} operation on file "${key}"`, 'ACCESS_DENIED', 403);
		this.name = 'FileAccessError';
	}
}

/**
 * Error handler utility for file operations
 */
export class FileErrorHandler {
	static handle(error: unknown, context?: string): FileUploadError {
		if (error instanceof FileUploadError) {
			return error;
		}

		if (error instanceof Error) {
			const contextMessage = context ? `${context}: ` : '';
			return new FileStorageError(`${contextMessage}${error.message}`, error);
		}

		const contextMessage = context ? `${context}: ` : '';
		return new FileStorageError(`${contextMessage}Unknown error occurred`);
	}

	static isRetryable(error: FileUploadError): boolean {
		// Only retry storage errors, not validation errors
		return error instanceof FileStorageError || error instanceof FileProcessingError;
	}

	static getClientSafeMessage(error: FileUploadError): string {
		// Return user-friendly messages, hide internal details
		switch (error.name) {
			case 'FileValidationError':
			case 'FileSizeError':
			case 'FileTypeError':
				return error.message;
			case 'FileNotFoundError':
				return 'File not found';
			case 'FileAccessError':
				return 'Access denied';
			case 'FileProcessingError':
				return 'Failed to process file. Please try again.';
			case 'FileStorageError':
			default:
				return 'Upload failed. Please try again.';
		}
	}
}

/**
 * Retry utility for file operations
 */
export class FileRetryHandler {
	static async retry<T>(
		operation: () => Promise<T>,
		maxRetries: number = RETRY_CONFIG.MAX_FILE_RETRIES,
		delay: number = RETRY_CONFIG.RETRY_DELAY_MS,
	): Promise<T> {
		let lastError: Error;

		for (let attempt = 1; attempt <= maxRetries; attempt++) {
			try {
				return await operation();
			} catch (error) {
				lastError = error instanceof Error ? error : new Error('Unknown error');

				// Don't retry validation errors
				if (error instanceof FileValidationError) {
					throw error;
				}

				// Don't retry on last attempt
				if (attempt === maxRetries) {
					break;
				}

				// Wait before retrying with exponential backoff
				await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, attempt - 1)));
			}
		}

		throw lastError!;
	}
}
