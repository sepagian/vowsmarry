import { invalidate } from '$app/navigation';

/**
 * Cache for pending invalidation requests to prevent duplicate calls
 */
const pendingInvalidations = new Map<string, Promise<void>>();

/**
 * Batch multiple invalidation keys into a single operation
 * 
 * Prevents race conditions and duplicate requests by:
 * - Deduplicating concurrent invalidation requests
 * - Batching multiple keys into a single Promise.all
 * - Cleaning up completed requests from cache
 * 
 * @param keys - Dependency keys to invalidate
 * @returns Promise that resolves when all invalidations complete
 * 
 * @example
 * ```typescript
 * // Instead of:
 * await invalidate('task:list');
 * await invalidate('dashboard:data');
 * await invalidate('calendar:data');
 * 
 * // Use:
 * await batchInvalidate('task:list', 'dashboard:data', 'calendar:data');
 * ```
 */
export async function batchInvalidate(...keys: string[]): Promise<void> {
	if (keys.length === 0) return;
	
	// Create a cache key from sorted keys to ensure consistent deduplication
	const cacheKey = keys.sort().join(',');
	
	// Return existing promise if this exact batch is already in progress
	if (pendingInvalidations.has(cacheKey)) {
		return pendingInvalidations.get(cacheKey)!;
	}
	
	// Create new batch invalidation promise
	const promise = Promise.all(keys.map(key => invalidate(key))).then(() => {});
	pendingInvalidations.set(cacheKey, promise);
	
	try {
		await promise;
	} finally {
		// Clean up completed request from cache
		pendingInvalidations.delete(cacheKey);
	}
}

/**
 * Invalidate a single key with deduplication
 * 
 * Prevents duplicate invalidation requests for the same key
 * 
 * @param key - Dependency key to invalidate
 * @returns Promise that resolves when invalidation completes
 */
export async function invalidateOnce(key: string): Promise<void> {
	return batchInvalidate(key);
}

/**
 * Clear all pending invalidation requests
 * Useful for cleanup or testing
 */
export function clearInvalidationCache(): void {
	pendingInvalidations.clear();
}

/**
 * Centralized invalidation service for the application
 * 
 * Provides consistent data invalidation patterns across all features.
 * Uses batch invalidation to prevent race conditions and duplicate requests.
 * 
 * @example
 * ```typescript
 * // After creating/updating/deleting a task
 * await InvalidationService.invalidateTask();
 * 
 * // After updating multiple entities
 * await InvalidationService.invalidateAll();
 * ```
 */
export const InvalidationService = {
	/**
	 * Invalidate all task-related data
	 * Refreshes: task list, dashboard, and calendar
	 */
	invalidateTask: () => batchInvalidate('task:list', 'dashboard:data', 'calendar:data'),
	
	/**
	 * Invalidate all expense-related data
	 * Refreshes: expense list, dashboard, and calendar
	 */
	invalidateExpense: () => batchInvalidate('expense:list', 'dashboard:data', 'calendar:data'),
	
	/**
	 * Invalidate all vendor-related data
	 * Refreshes: vendor list and dashboard
	 */
	invalidateVendor: () => batchInvalidate('vendor:list', 'dashboard:data'),
	
	/**
	 * Invalidate all document-related data
	 * Refreshes: document list and dashboard
	 */
	invalidateDocument: () => batchInvalidate('document:list', 'dashboard:data'),
	
	/**
	 * Invalidate all schedule-related data
	 * Refreshes: schedule list, calendar, and dashboard
	 */
	invalidateSchedule: () => batchInvalidate('schedule:list', 'calendar:data', 'dashboard:data'),
	
	/**
	 * Invalidate all rundown-related data
	 * Refreshes: rundown list and calendar
	 */
	invalidateRundown: () => batchInvalidate('rundown:list', 'calendar:data'),
	
	/**
	 * Invalidate dashboard overview data only
	 */
	invalidateDashboard: () => batchInvalidate('dashboard:data'),
	
	/**
	 * Invalidate calendar data only
	 */
	invalidateCalendar: () => batchInvalidate('calendar:data'),
	
	/**
	 * Invalidate everything (use sparingly)
	 * Refreshes all data across the application
	 */
	invalidateAll: () => batchInvalidate(
		'task:list',
		'expense:list',
		'vendor:list',
		'document:list',
		'schedule:list',
		'rundown:list',
		'dashboard:data',
		'calendar:data'
	),
} as const;

/**
 * @deprecated Use InvalidationService instead
 * Kept for backward compatibility
 */
export const InvalidationPatterns = {
	tasks: InvalidationService.invalidateTask,
	expenses: InvalidationService.invalidateExpense,
	vendors: InvalidationService.invalidateVendor,
	documents: InvalidationService.invalidateDocument,
	schedules: InvalidationService.invalidateSchedule,
	rundowns: InvalidationService.invalidateRundown,
	dashboard: InvalidationService.invalidateDashboard,
	calendar: InvalidationService.invalidateCalendar,
	all: InvalidationService.invalidateAll,
} as const;
