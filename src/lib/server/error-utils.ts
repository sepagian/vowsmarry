/**
 * Creates a standardized application error object
 * Follows the App.Error interface defined in app.d.ts
 *
 * @param status - HTTP status code
 * @param message - User-facing error message
 * @param code - Optional error code for client-side handling
 * @returns Formatted error object with timestamp
 *
 * @example
 * ```typescript
 * throw error(401, createAppError(401, 'Unauthorized', 'AUTH_REQUIRED'));
 * ```
 */
export function createAppError(status: number, message: string, code?: string): App.Error {
	return {
		message,
		code,
		status,
		timestamp: new Date().toISOString(),
	};
}

/**
 * Common error codes for consistent error handling
 */
export const ErrorCodes = {
	AUTH_REQUIRED: 'AUTH_REQUIRED',
	INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
	SESSION_EXPIRED: 'SESSION_EXPIRED',
	FORBIDDEN: 'FORBIDDEN',
	NOT_FOUND: 'NOT_FOUND',
	VALIDATION_ERROR: 'VALIDATION_ERROR',
	DATABASE_ERROR: 'DATABASE_ERROR',
	INTERNAL_ERROR: 'INTERNAL_ERROR',
	WEDDING_NOT_FOUND: 'WEDDING_NOT_FOUND',
	WEDDING_SETUP_REQUIRED: 'WEDDING_SETUP_REQUIRED',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
