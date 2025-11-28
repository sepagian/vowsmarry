import { CrudToasts } from '$lib/utils/toasts';
import { InvalidationService } from '$lib/utils/invalidation-helpers';
import { createFormData, createFormDataWithId } from '$lib/utils/form-helpers';

/**
 * Store interface for CRUD operations
 */
interface CrudStore<T> {
	update(fn: (items: T[]) => T[]): void;
}

/**
 * Options for CRUD operations
 */
interface CrudOptions {
	/**
	 * Entity name for toast messages (e.g., 'task', 'expense')
	 */
	entity: string;
	
	/**
	 * Invalidation keys to refresh after operations
	 */
	invalidationKeys?: string[];
	
	/**
	 * Whether to use optimistic updates (default: true)
	 */
	optimistic?: boolean;
	
	/**
	 * Custom invalidation pattern function
	 */
	invalidationPattern?: () => Promise<void>;
}

/**
 * Result of a CRUD operation
 */
interface CrudResult<T = unknown> {
	success?: boolean;
	type?: string; // For SvelteKit form action responses
	data?: T;
	error?: string;
}

/**
 * Create reusable CRUD action handlers with optimistic updates
 * 
 * Provides type-safe CRUD operations with:
 * - Optimistic updates for better UX
 * - Automatic rollback on errors
 * - Consistent toast notifications
 * - Automatic data invalidation
 * 
 * @param store - Svelte store with update method
 * @param options - Configuration options
 * @returns Object with CRUD action methods
 * 
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { tasksStore } from '$lib/stores/tasks';
 *   import { createCrudActions } from '$lib/hooks/use-crud-actions.svelte';
 *   
 *   const { updateItem, deleteItem } = createCrudActions(tasksStore, {
 *     entity: 'task',
 *     invalidationKeys: ['task:list', 'dashboard:data'],
 *   });
 *   
 *   async function handleStatusChange(taskId: string, newStatus: string) {
 *     await updateItem(taskId, { taskStatus: newStatus }, 'updateTaskStatus');
 *   }
 * </script>
 * ```
 */
export function createCrudActions<T extends { id?: string }>(
	store: CrudStore<T>,
	options: CrudOptions
) {
	const {
		entity,
		optimistic = true,
		invalidationPattern,
	} = options;
	
	/**
	 * Perform data invalidation after successful operations
	 */
	async function performInvalidation(): Promise<void> {
		if (invalidationPattern) {
			await invalidationPattern();
		}
	}
	
	/**
	 * Update an item with optimistic updates
	 * 
	 * @param id - Item ID
	 * @param updates - Partial updates to apply
	 * @param action - Server action name (e.g., 'updateTaskStatus')
	 * @param showToast - Whether to show success/error toasts (default: true)
	 * @returns Promise with operation result
	 */
	async function updateItem(
		id: string,
		updates: Partial<T>,
		action: string,
		showToast = true
	): Promise<CrudResult<T>> {
		let original: T | undefined;
		
		// Optimistic update
		if (optimistic) {
			store.update((items) => {
				const index = items.findIndex((item) => item.id === id);
				if (index !== -1) {
					original = items[index];
					items[index] = { ...items[index], ...updates };
				}
				return [...items];
			});
		}
		
		try {
			const formData = createFormDataWithId(id, updates as Record<string, unknown>);
			
			const response = await fetch(`?/${action}`, {
				method: 'POST',
				body: formData,
			});
			
			const result = await response.json() as CrudResult<T>;
			
			if (result.success || result.type === 'success') {
				if (showToast) {
					CrudToasts.success('update', entity);
				}
				await performInvalidation();
				return { success: true, data: result.data };
			} else {
				// Revert optimistic update on error
				if (optimistic && original) {
					store.update((items) => {
						const index = items.findIndex((item) => item.id === id);
						if (index !== -1) {
							items[index] = original!;
						}
						return [...items];
					});
				}
				
				const errorMsg = result.error || 'Update failed';
				if (showToast) {
					CrudToasts.error('update', errorMsg, entity);
				}
				return { success: false, error: errorMsg };
			}
		} catch {
			// Revert optimistic update on network error
			if (optimistic && original) {
				store.update((items) => {
					const index = items.findIndex((item) => item.id === id);
					if (index !== -1) {
						items[index] = original!;
					}
					return [...items];
				});
			}
			
			const errorMsg = 'Network error occurred';
			if (showToast) {
				CrudToasts.error('update', errorMsg, entity);
			}
			return { success: false, error: errorMsg };
		}
	}
	
	/**
	 * Delete an item
	 * 
	 * @param id - Item ID
	 * @param action - Server action name (e.g., 'deleteTask')
	 * @param showToast - Whether to show success/error toasts (default: true)
	 * @returns Promise with operation result
	 */
	async function deleteItem(
		id: string,
		action: string,
		showToast = true
	): Promise<CrudResult> {
		try {
			const formData = createFormDataWithId(id);
			
			const response = await fetch(`?/${action}`, {
				method: 'POST',
				body: formData,
			});
			
			const result = await response.json() as CrudResult;
			
			if (result.success || result.type === 'success') {
				if (showToast) {
					CrudToasts.success('delete', entity);
				}
				await performInvalidation();
				return { success: true };
			} else {
				const errorMsg = result.error || 'Delete failed';
				if (showToast) {
					CrudToasts.error('delete', errorMsg, entity);
				}
				return { success: false, error: errorMsg };
			}
		} catch {
			const errorMsg = 'Network error occurred';
			if (showToast) {
				CrudToasts.error('delete', errorMsg, entity);
			}
			return { success: false, error: errorMsg };
		}
	}
	
	/**
	 * Create a new item
	 * 
	 * @param data - Item data
	 * @param action - Server action name (e.g., 'createTask')
	 * @param showToast - Whether to show success/error toasts (default: true)
	 * @returns Promise with operation result
	 */
	async function createItem(
		data: Partial<T>,
		action: string,
		showToast = true
	): Promise<CrudResult<T>> {
		try {
			const formData = createFormData(data as Record<string, unknown>);
			
			const response = await fetch(`?/${action}`, {
				method: 'POST',
				body: formData,
			});
			
			const result = await response.json() as CrudResult<T>;
			
			if (result.success || result.type === 'success') {
				if (showToast) {
					CrudToasts.success('create', entity);
				}
				await performInvalidation();
				return { success: true, data: result.data };
			} else {
				const errorMsg = result.error || 'Create failed';
				if (showToast) {
					CrudToasts.error('create', errorMsg, entity);
				}
				return { success: false, error: errorMsg };
			}
		} catch {
			const errorMsg = 'Network error occurred';
			if (showToast) {
				CrudToasts.error('create', errorMsg, entity);
			}
			return { success: false, error: errorMsg };
		}
	}
	
	return {
		updateItem,
		deleteItem,
		createItem,
	};
}

/**
 * Predefined CRUD actions for common entities
 */
export const CrudActions = {
	tasks: <T extends { id?: string }>(store: CrudStore<T>) => createCrudActions(store, {
		entity: 'task',
		invalidationPattern: InvalidationService.invalidateTask,
	}),
	
	expenses: <T extends { id?: string }>(store: CrudStore<T>) => createCrudActions(store, {
		entity: 'expense',
		invalidationPattern: InvalidationService.invalidateExpense,
	}),
	
	vendors: <T extends { id?: string }>(store: CrudStore<T>) => createCrudActions(store, {
		entity: 'vendor',
		invalidationPattern: InvalidationService.invalidateVendor,
	}),
	
	documents: <T extends { id?: string }>(store: CrudStore<T>) => createCrudActions(store, {
		entity: 'document',
		invalidationPattern: InvalidationService.invalidateDocument,
	}),
	
	schedules: <T extends { id?: string }>(store: CrudStore<T>) => createCrudActions(store, {
		entity: 'schedule',
		invalidationPattern: InvalidationService.invalidateSchedule,
	}),
	
	rundowns: <T extends { id?: string }>(store: CrudStore<T>) => createCrudActions(store, {
		entity: 'rundown',
		invalidationPattern: InvalidationService.invalidateRundown,
	}),
} as const;
