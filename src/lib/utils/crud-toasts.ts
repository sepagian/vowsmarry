import { toast } from 'svelte-sonner';
import type { CrudOperation, EntityConfig, PromiseToastMessages } from '$lib/types.js';

// Simplified toast options that match svelte-sonner's actual API
interface SonnerToastOptions {
	duration?: number;
	description?: string;
	action?: {
		label: string;
		onClick: (event: MouseEvent) => void;
	};
}

/**
 * Entity configurations for standardized CRUD messaging
 * Defines display names and operation-specific messages for each entity type
 */
export const entityConfigs: Record<string, EntityConfig> = {
	wedding: {
		name: 'wedding',
		displayName: 'Wedding',
		operations: {
			create: 'Wedding data created successfully',
			update: 'Wedding data updated successfully',
			delete: 'Wedding data deleted successfully',
			fetch: 'Wedding data loaded successfully',
		},
	},
	task: {
		name: 'task',
		displayName: 'Task',
		operations: {
			create: 'Task created successfully',
			update: 'Task updated successfully',
			delete: 'Task deleted successfully',
			fetch: 'Tasks loaded successfully',
		},
	},
	vendor: {
		name: 'vendor',
		displayName: 'Vendor',
		operations: {
			create: 'Vendor added successfully',
			update: 'Vendor updated successfully',
			delete: 'Vendor removed successfully',
			fetch: 'Vendors loaded successfully',
		},
	},
	document: {
		name: 'document',
		displayName: 'Document',
		operations: {
			create: 'Document uploaded successfully',
			update: 'Document updated successfully',
			delete: 'Document deleted successfully',
			fetch: 'Documents loaded successfully',
		},
	},
	expense: {
		name: 'expense',
		displayName: 'Expense',
		operations: {
			create: 'Expense added successfully',
			update: 'Expense updated successfully',
			delete: 'Expense deleted successfully',
			fetch: 'Expenses loaded successfully',
		},
	},
	rundown: {
		name: 'rundown',
		displayName: 'Rundown Item',
		operations: {
			create: 'Rundown item created successfully',
			update: 'Rundown item updated successfully',
			delete: 'Rundown item deleted successfully',
			fetch: 'Rundown loaded successfully',
		},
	},
};

/**
 * Enhanced CRUD Toast Utilities
 *
 * Provides standardized toast messages for CRUD operations with:
 * - Entity-specific messaging
 * - Promise-based loading states
 * - Retry actions for failed operations
 * - Undo functionality for destructive operations
 */
export class CrudToasts {
	/**
	 * Display success toast for CRUD operations with optional undo action
	 */
	static success(
		operation: CrudOperation,
		entity?: string,
		options?: {
			itemName?: string;
			undoAction?: () => void | Promise<void>;
			duration?: number;
		},
	): void {
		const config = entity ? entityConfigs[entity] : null;
		const message = config?.operations[operation] || this.getDefaultMessage(operation, 'success');

		const toastOptions: SonnerToastOptions = {
			duration: options?.duration || 4000,
		};

		// Add item name to description if provided
		if (options?.itemName) {
			toastOptions.description = `"${options.itemName}"`;
		}

		// Add undo action for destructive operations
		if (operation === 'delete' && options?.undoAction) {
			toastOptions.action = {
				label: 'Undo',
				onClick: async (event: MouseEvent) => {
					event.preventDefault();
					try {
						if (options.undoAction) {
							await options.undoAction();
							toast.success('Action undone successfully');
						}
					} catch (error) {
						toast.error('Failed to undo action');
					}
				},
			};
		}

		toast.success(message, toastOptions);
	}

	/**
	 * Display error toast for CRUD operations with retry action
	 */
	static error(
		operation: CrudOperation,
		error: string,
		entity?: string,
		options?: {
			retryAction?: () => void | Promise<void>;
			isNetworkError?: boolean;
			duration?: number;
		},
	): void {
		const config = entity ? entityConfigs[entity] : null;
		const baseMessage = config
			? `Failed to ${operation} ${config.displayName.toLowerCase()}`
			: this.getDefaultMessage(operation, 'error');

		const message = `${baseMessage}: ${error}`;

		const toastOptions: SonnerToastOptions = {
			duration: options?.duration || 6000,
			description: options?.isNetworkError
				? 'Please check your connection and try again'
				: undefined,
		};

		// Add retry action for network errors or when explicitly provided
		if (options?.retryAction && (options?.isNetworkError || operation !== 'delete')) {
			toastOptions.action = {
				label: 'Retry',
				onClick: async (event: MouseEvent) => {
					event.preventDefault();
					try {
						if (options.retryAction) {
							await options.retryAction();
						}
					} catch (retryError) {
						this.error(operation, 'Retry failed', entity, {
							isNetworkError: options.isNetworkError,
						});
					}
				},
			};
		}

		toast.error(message, toastOptions);
	}

	/**
	 * Display promise-based toast for CRUD operations with automatic loading states
	 */
	static promise<T>(
		promise: Promise<T>,
		operation: CrudOperation,
		entity?: string,
		options?: {
			messages?: Partial<PromiseToastMessages<T>>;
			itemName?: string;
			undoAction?: () => void | Promise<void>;
			retryAction?: () => void | Promise<void>;
		},
	): Promise<T> {
		const config = entity ? entityConfigs[entity] : null;

		const defaultMessages: PromiseToastMessages<T> = {
			loading: this.getLoadingMessage(operation, config),
			success: (data: T) => {
				const successMsg =
					config?.operations[operation] || this.getDefaultMessage(operation, 'success');
				return options?.itemName ? `${successMsg}: "${options.itemName}"` : successMsg;
			},
			error: config
				? `Failed to ${operation} ${config.displayName.toLowerCase()}`
				: this.getDefaultMessage(operation, 'error'),
		};

		const finalMessages = { ...defaultMessages, ...options?.messages };

		// For promise-based toasts, we use the standard svelte-sonner API
		// Note: Actions for promise toasts need to be handled differently
		// since svelte-sonner's promise API doesn't support post-completion actions
		toast.promise(promise, finalMessages);
		return promise;
	}

	/**
	 * Batch operation support for multiple CRUD operations
	 */
	static batchPromise<T>(
		promises: Promise<T>[],
		operation: CrudOperation,
		entity?: string,
		options?: {
			itemCount?: number;
			successMessage?: string;
			errorMessage?: string;
		},
	): Promise<T[]> {
		const config = entity ? entityConfigs[entity] : null;
		const itemCount = options?.itemCount || promises.length;
		const entityName = config?.displayName.toLowerCase() || 'item';
		const pluralEntityName = itemCount === 1 ? entityName : this.pluralize(entityName);

		const batchPromise = Promise.all(promises);

		const messages: PromiseToastMessages<T[]> = {
			loading: `${this.capitalizeFirst(this.getOperationVerb(operation))} ${itemCount} ${pluralEntityName}...`,
			success:
				options?.successMessage ||
				`Successfully ${this.getOperationPastTense(operation)} ${itemCount} ${pluralEntityName}`,
			error:
				options?.errorMessage ||
				`Failed to ${operation} some ${pluralEntityName}. Please try again.`,
		};

		toast.promise(batchPromise, messages);
		return batchPromise;
	}

	/**
	 * Get default message for operations without entity config
	 */
	private static getDefaultMessage(operation: CrudOperation, type: 'success' | 'error'): string {
		const operationMap = {
			create: { success: 'Item created successfully', error: 'Failed to create item' },
			update: { success: 'Item updated successfully', error: 'Failed to update item' },
			delete: { success: 'Item deleted successfully', error: 'Failed to delete item' },
			fetch: { success: 'Data loaded successfully', error: 'Failed to load data' },
		};

		return operationMap[operation][type];
	}

	/**
	 * Get loading message for operations
	 */
	private static getLoadingMessage(operation: CrudOperation, config?: EntityConfig | null): string {
		const verb = this.getOperationVerb(operation);
		const entityName = config?.displayName.toLowerCase() || 'item';
		return `${this.capitalizeFirst(verb)} ${entityName}...`;
	}

	/**
	 * Get present tense verb for operation
	 */
	private static getOperationVerb(operation: CrudOperation): string {
		const verbMap = {
			create: 'creating',
			update: 'updating',
			delete: 'deleting',
			fetch: 'loading',
		};
		return verbMap[operation];
	}

	/**
	 * Get past tense verb for operation
	 */
	private static getOperationPastTense(operation: CrudOperation): string {
		const verbMap = {
			create: 'created',
			update: 'updated',
			delete: 'deleted',
			fetch: 'loaded',
		};
		return verbMap[operation];
	}

	/**
	 * Capitalize first letter of string
	 */
	private static capitalizeFirst(str: string): string {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	/**
	 * Simple pluralization for entity names
	 */
	private static pluralize(word: string): string {
		// Simple pluralization rules
		if (word.endsWith('y')) {
			return word.slice(0, -1) + 'ies';
		}
		if (
			word.endsWith('s') ||
			word.endsWith('sh') ||
			word.endsWith('ch') ||
			word.endsWith('x') ||
			word.endsWith('z')
		) {
			return word + 'es';
		}
		return word + 's';
	}
}

/**
 * Convenience functions for common CRUD operations
 */

/**
 * Show success toast for creating an item with optional undo
 */
export function showCreateSuccess(
	entity: string,
	itemName?: string,
	undoAction?: () => void | Promise<void>,
): void {
	CrudToasts.success('create', entity, { itemName, undoAction });
}

/**
 * Show success toast for updating an item
 */
export function showUpdateSuccess(entity: string, itemName?: string): void {
	CrudToasts.success('update', entity, { itemName });
}

/**
 * Show success toast for deleting an item with undo action
 */
export function showDeleteSuccess(
	entity: string,
	itemName?: string,
	undoAction?: () => void | Promise<void>,
): void {
	CrudToasts.success('delete', entity, { itemName, undoAction });
}

/**
 * Show error toast for failed operation with retry
 */
export function showOperationError(
	operation: CrudOperation,
	entity: string,
	error: string,
	retryAction?: () => void | Promise<void>,
	isNetworkError = false,
): void {
	CrudToasts.error(operation, error, entity, { retryAction, isNetworkError });
}

/**
 * Execute CRUD operation with promise-based toast feedback
 */
export function executeWithToast<T>(
	promise: Promise<T>,
	operation: CrudOperation,
	entity: string,
	options?: {
		itemName?: string;
		undoAction?: () => void | Promise<void>;
		retryAction?: () => void | Promise<void>;
		customMessages?: Partial<PromiseToastMessages<T>>;
	},
): Promise<T> {
	return CrudToasts.promise(promise, operation, entity, {
		messages: options?.customMessages,
		itemName: options?.itemName,
		undoAction: options?.undoAction,
		retryAction: options?.retryAction,
	});
}

/**
 * Execute batch CRUD operations with toast feedback
 */
export function executeBatchWithToast<T>(
	promises: Promise<T>[],
	operation: CrudOperation,
	entity: string,
	options?: {
		successMessage?: string;
		errorMessage?: string;
	},
): Promise<T[]> {
	return CrudToasts.batchPromise(promises, operation, entity, {
		itemCount: promises.length,
		successMessage: options?.successMessage,
		errorMessage: options?.errorMessage,
	});
}

// Export the main class as default
export default CrudToasts;

