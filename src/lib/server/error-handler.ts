import { fail, type NumericRange } from '@sveltejs/kit';
import type { ActionFailure } from '@sveltejs/kit';

/**
 * Centralized error handling for database operations
 */
export function handleDatabaseError(error: unknown, operation: string) {
	console.error(`${operation} error:`, error);

	// Add more sophisticated error handling based on error type
	if (error instanceof Error) {
		// In production, you might want to log to a monitoring service here
		// e.g., Sentry, LogRocket, etc.

		// Check for specific database errors
		if (error.message.includes('UNIQUE constraint')) {
			return {
				error: 'This record already exists. Please try a different value.',
			};
		}

		if (error.message.includes('FOREIGN KEY constraint')) {
			return {
				error: 'Cannot complete operation due to related records.',
			};
		}
	}

	// Generic error message
	return {
		error: `Failed to ${operation}. Please try again.`,
	};
}

/**
 * Unified error handler for SvelteKit actions
 * 
 * Provides consistent error handling across all form actions with:
 * - Automatic error logging
 * - Type-safe error responses
 * - Form state preservation
 * - User-friendly error messages
 * 
 * @param error - The error that occurred
 * @param operation - Description of the operation (e.g., "create task")
 * @param options - Additional options for error handling
 * @returns ActionFailure with error details
 * 
 * @example
 * ```typescript
 * try {
 *   await db.insertInto('tasks').values(data).execute();
 * } catch (error) {
 *   return handleActionError(error, 'create task', { form });
 * }
 * ```
 */
export function handleActionError(
	error: unknown,
	operation: string,
	options?: {
		form?: unknown;
		logError?: boolean;
		status?: NumericRange<400, 599>;
	}
): ActionFailure<{ error: string; form?: unknown }> {
	const { form, logError = true, status = 500 } = options || {};
	
	if (logError) {
		console.error(`[${operation}] Error:`, error);
	}
	
	let errorMessage = `Failed to ${operation}. Please try again.`;
	
	// Extract meaningful error messages
	if (error instanceof Error) {
		// Check for specific database errors
		if (error.message.includes('UNIQUE constraint')) {
			errorMessage = 'This record already exists. Please try a different value.';
		} else if (error.message.includes('FOREIGN KEY constraint')) {
			errorMessage = 'Cannot complete operation due to related records.';
		} else if (error.message.includes('NOT NULL constraint')) {
			errorMessage = 'Required field is missing. Please check your input.';
		}
	}
	
	const result: { error: string; form?: unknown } = {
		error: errorMessage,
	};
	
	if (form !== undefined) {
		result.form = form;
	}
	
	return fail(status, result);
}
