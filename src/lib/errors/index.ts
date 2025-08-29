import { z } from 'zod';

// Base error class for all application errors
export abstract class AppError extends Error {
	abstract readonly code: string;
	abstract readonly statusCode: number;
	abstract readonly isOperational: boolean;

	constructor(message: string, public readonly context?: Record<string, any>) {
		super(message);
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}

	toJSON() {
		return {
			name: this.name,
			code: this.code,
			message: this.message,
			statusCode: this.statusCode,
			context: this.context,
			stack: this.stack
		};
	}
}

// Validation errors
export class ValidationError extends AppError {
	readonly code = 'VALIDATION_ERROR';
	readonly statusCode = 400;
	readonly isOperational = true;

	constructor(
		message: string,
		public readonly errors: Record<string, string> = {},
		context?: Record<string, any>
	) {
		super(message, context);
	}

	static fromZodError(error: z.ZodError, context?: Record<string, any>): ValidationError {
		const errors: Record<string, string> = {};
		
		error.issues.forEach((err) => {
			const path = err.path.join('.');
			errors[path] = err.message;
		});

		return new ValidationError(
			'Validation failed',
			errors,
			context
		);
	}

	toJSON() {
		return {
			...super.toJSON(),
			errors: this.errors
		};
	}
}

// Authentication errors
export class AuthenticationError extends AppError {
	readonly code = 'AUTHENTICATION_ERROR';
	readonly statusCode = 401;
	readonly isOperational = true;

	constructor(message: string = 'Authentication required', context?: Record<string, any>) {
		super(message, context);
	}
}

export class AuthorizationError extends AppError {
	readonly code = 'AUTHORIZATION_ERROR';
	readonly statusCode = 403;
	readonly isOperational = true;

	constructor(message: string = 'Access denied', context?: Record<string, any>) {
		super(message, context);
	}
}

export class InvalidCredentialsError extends AppError {
	readonly code = 'INVALID_CREDENTIALS';
	readonly statusCode = 401;
	readonly isOperational = true;

	constructor(message: string = 'Invalid email or password', context?: Record<string, any>) {
		super(message, context);
	}
}

export class EmailNotVerifiedError extends AppError {
	readonly code = 'EMAIL_NOT_VERIFIED';
	readonly statusCode = 401;
	readonly isOperational = true;

	constructor(message: string = 'Please verify your email address', context?: Record<string, any>) {
		super(message, context);
	}
}

export class SessionExpiredError extends AppError {
	readonly code = 'SESSION_EXPIRED';
	readonly statusCode = 401;
	readonly isOperational = true;

	constructor(message: string = 'Your session has expired', context?: Record<string, any>) {
		super(message, context);
	}
}

// Resource errors
export class NotFoundError extends AppError {
	readonly code = 'NOT_FOUND';
	readonly statusCode = 404;
	readonly isOperational = true;

	constructor(resource: string = 'Resource', context?: Record<string, any>) {
		super(`${resource} not found`, context);
	}
}

export class ConflictError extends AppError {
	readonly code = 'CONFLICT';
	readonly statusCode = 409;
	readonly isOperational = true;

	constructor(message: string, context?: Record<string, any>) {
		super(message, context);
	}
}

export class DuplicateResourceError extends AppError {
	readonly code = 'DUPLICATE_RESOURCE';
	readonly statusCode = 409;
	readonly isOperational = true;

	constructor(resource: string, field?: string, context?: Record<string, any>) {
		const message = field 
			? `${resource} with this ${field} already exists`
			: `${resource} already exists`;
		super(message, context);
	}
}

// Business logic errors
export class BusinessLogicError extends AppError {
	readonly code = 'BUSINESS_LOGIC_ERROR';
	readonly statusCode = 422;
	readonly isOperational = true;

	constructor(message: string, context?: Record<string, any>) {
		super(message, context);
	}
}

export class InsufficientPermissionsError extends AppError {
	readonly code = 'INSUFFICIENT_PERMISSIONS';
	readonly statusCode = 403;
	readonly isOperational = true;

	constructor(action: string, resource: string, context?: Record<string, any>) {
		super(`Insufficient permissions to ${action} ${resource}`, context);
	}
}

export class ResourceLimitExceededError extends AppError {
	readonly code = 'RESOURCE_LIMIT_EXCEEDED';
	readonly statusCode = 429;
	readonly isOperational = true;

	constructor(resource: string, limit: number, context?: Record<string, any>) {
		super(`${resource} limit of ${limit} exceeded`, context);
	}
}

// File upload errors
export class FileUploadError extends AppError {
	readonly code = 'FILE_UPLOAD_ERROR';
	readonly statusCode = 400;
	readonly isOperational = true;

	constructor(message: string, context?: Record<string, any>) {
		super(message, context);
	}
}

export class FileSizeExceededError extends AppError {
	readonly code = 'FILE_SIZE_EXCEEDED';
	readonly statusCode = 413;
	readonly isOperational = true;

	constructor(maxSize: string, context?: Record<string, any>) {
		super(`File size exceeds maximum allowed size of ${maxSize}`, context);
	}
}

export class UnsupportedFileTypeError extends AppError {
	readonly code = 'UNSUPPORTED_FILE_TYPE';
	readonly statusCode = 415;
	readonly isOperational = true;

	constructor(fileType: string, allowedTypes: string[], context?: Record<string, any>) {
		super(`File type ${fileType} is not supported. Allowed types: ${allowedTypes.join(', ')}`, context);
	}
}

// Database errors
export class DatabaseError extends AppError {
	readonly code = 'DATABASE_ERROR';
	readonly statusCode = 500;
	readonly isOperational = false;

	constructor(message: string, context?: Record<string, any>) {
		super(message, context);
	}
}

export class DatabaseConnectionError extends AppError {
	readonly code = 'DATABASE_CONNECTION_ERROR';
	readonly statusCode = 503;
	readonly isOperational = false;

	constructor(message: string = 'Database connection failed', context?: Record<string, any>) {
		super(message, context);
	}
}

// External service errors
export class ExternalServiceError extends AppError {
	readonly code = 'EXTERNAL_SERVICE_ERROR';
	readonly statusCode = 502;
	readonly isOperational = true;

	constructor(service: string, message?: string, context?: Record<string, any>) {
		super(message || `External service ${service} is unavailable`, context);
	}
}

export class EmailServiceError extends AppError {
	readonly code = 'EMAIL_SERVICE_ERROR';
	readonly statusCode = 502;
	readonly isOperational = true;

	constructor(message: string = 'Email service is unavailable', context?: Record<string, any>) {
		super(message, context);
	}
}

export class StorageServiceError extends AppError {
	readonly code = 'STORAGE_SERVICE_ERROR';
	readonly statusCode = 502;
	readonly isOperational = true;

	constructor(message: string = 'Storage service is unavailable', context?: Record<string, any>) {
		super(message, context);
	}
}

// Rate limiting errors
export class RateLimitError extends AppError {
	readonly code = 'RATE_LIMIT_EXCEEDED';
	readonly statusCode = 429;
	readonly isOperational = true;

	constructor(
		message: string = 'Too many requests',
		public readonly retryAfter?: number,
		context?: Record<string, any>
	) {
		super(message, context);
	}

	toJSON() {
		return {
			...super.toJSON(),
			retryAfter: this.retryAfter
		};
	}
}

// Generic server error
export class InternalServerError extends AppError {
	readonly code = 'INTERNAL_SERVER_ERROR';
	readonly statusCode = 500;
	readonly isOperational = false;

	constructor(message: string = 'Internal server error', context?: Record<string, any>) {
		super(message, context);
	}
}

// Error handler utility functions
export class ErrorHandler {
	static isAppError(error: unknown): error is AppError {
		return error instanceof AppError;
	}

	static isOperationalError(error: unknown): boolean {
		if (this.isAppError(error)) {
			return error.isOperational;
		}
		return false;
	}

	static getStatusCode(error: unknown): number {
		if (this.isAppError(error)) {
			return error.statusCode;
		}
		return 500;
	}

	static getErrorCode(error: unknown): string {
		if (this.isAppError(error)) {
			return error.code;
		}
		return 'UNKNOWN_ERROR';
	}

	static formatError(error: unknown): {
		code: string;
		message: string;
		statusCode: number;
		errors?: Record<string, string>;
		context?: Record<string, any>;
	} {
		if (this.isAppError(error)) {
			const formatted = {
				code: error.code,
				message: error.message,
				statusCode: error.statusCode,
				context: error.context
			};

			if (error instanceof ValidationError) {
				return { ...formatted, errors: error.errors };
			}

			return formatted;
		}

		// Handle Zod errors
		if (error instanceof z.ZodError) {
			const validationError = ValidationError.fromZodError(error);
			return this.formatError(validationError);
		}

		// Handle unknown errors
		return {
			code: 'UNKNOWN_ERROR',
			message: error instanceof Error ? error.message : 'An unknown error occurred',
			statusCode: 500
		};
	}

	static logError(error: unknown, context?: Record<string, any>): void {
		const errorInfo = this.formatError(error);
		
		// In development, log full error details
		if (process.env.NODE_ENV === 'development') {
			console.error('Error occurred:', {
				...errorInfo,
				context,
				stack: error instanceof Error ? error.stack : undefined
			});
		} else {
			// In production, log only operational errors with limited details
			if (this.isOperationalError(error)) {
				console.error('Operational error:', {
					code: errorInfo.code,
					message: errorInfo.message,
					statusCode: errorInfo.statusCode,
					context
				});
			} else {
				console.error('System error:', {
					code: errorInfo.code,
					statusCode: errorInfo.statusCode,
					context
				});
			}
		}
	}
}

// Error response helper for SvelteKit
export function createErrorResponse(error: unknown, context?: Record<string, any>) {
	ErrorHandler.logError(error, context);
	const errorInfo = ErrorHandler.formatError(error);
	
	return new Response(
		JSON.stringify({
			error: {
				code: errorInfo.code,
				message: errorInfo.message,
				...(errorInfo.errors && { errors: errorInfo.errors })
			}
		}),
		{
			status: errorInfo.statusCode,
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
}

// Form action error helper
export function createFormError(error: unknown, context?: Record<string, any>) {
	ErrorHandler.logError(error, context);
	const errorInfo = ErrorHandler.formatError(error);
	
	return {
		error: {
			code: errorInfo.code,
			message: errorInfo.message,
			...(errorInfo.errors && { errors: errorInfo.errors })
		}
	};
}

// Export all error types for easy importing
export const errors = {
	ValidationError,
	AuthenticationError,
	AuthorizationError,
	InvalidCredentialsError,
	EmailNotVerifiedError,
	SessionExpiredError,
	NotFoundError,
	ConflictError,
	DuplicateResourceError,
	BusinessLogicError,
	InsufficientPermissionsError,
	ResourceLimitExceededError,
	FileUploadError,
	FileSizeExceededError,
	UnsupportedFileTypeError,
	DatabaseError,
	DatabaseConnectionError,
	ExternalServiceError,
	EmailServiceError,
	StorageServiceError,
	RateLimitError,
	InternalServerError
};

export type ErrorType = keyof typeof errors;