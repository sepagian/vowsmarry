import { toast } from 'svelte-sonner';
import { authToasts } from './auth-toasts.js';
import { FormToasts } from './form-toasts.js';
import type {
	ToastService,
	CrudOperation,
	PromiseToastMessages,
	CrudToastMethods,
	FormToastMethods,
} from '$lib/types.js';

/**
 * Unified Toast Service
 *
 * Provides a centralized API for all toast notifications across the application.
 * Wraps svelte-sonner with additional functionality for CRUD operations, forms,
 * and authentication while maintaining backward compatibility.
 */
class UnifiedToastService implements ToastService {
	// Delegate to existing auth-toasts for backward compatibility
	public readonly auth = authToasts;

	// CRUD operations with promise support
	public readonly crud: CrudToastMethods = {
		success: (operation: CrudOperation, entity?: string) => {
			const message = this.getCrudMessage(operation, entity, 'success');
			toast.success(message);
		},

		error: (operation: CrudOperation, error: string, entity?: string) => {
			const baseMessage = this.getCrudMessage(operation, entity, 'error');
			const message = `${baseMessage}: ${error}`;
			toast.error(message);
		},

		promise: <T>(
			promise: Promise<T>,
			operation: CrudOperation,
			entity?: string,
			messages?: PromiseToastMessages<T>,
		) => {
			const defaultMessages: PromiseToastMessages<T> = {
				loading: this.getCrudMessage(operation, entity, 'loading'),
				success: this.getCrudMessage(operation, entity, 'success'),
				error: this.getCrudMessage(operation, entity, 'error'),
			};

			const finalMessages = { ...defaultMessages, ...messages };
			toast.promise(promise, finalMessages);
		},
	};

	// Form operations with promise support - delegate to FormToasts
	public readonly form: FormToastMethods = {
		success: (message = 'Form submitted successfully!') => {
			FormToasts.success(message);
		},

		validationError: (
			errors: string[] | { field: string; message: string; displayName?: string }[],
		) => {
			FormToasts.validationError(errors);
		},

		submitError: (error: string) => {
			FormToasts.submitError(error);
		},

		emptyFormError: (options?: {
			formName?: string;
			requiredFields?: string[];
			scrollToFirstField?: () => void;
		}) => {
			FormToasts.emptyFormError(options);
		},

		promise: <T>(promise: Promise<T>, messages?: PromiseToastMessages<T>) => {
			FormToasts.promise(promise, { messages });
		},
	};

	// Core svelte-sonner methods
	public message(message: string): void {
		toast(message);
	}

	public success(message: string): void {
		toast.success(message);
	}

	public error(message: string): void {
		toast.error(message);
	}

	public warning(message: string): void {
		toast.warning(message);
	}

	public info(message: string): void {
		toast.info(message);
	}

	public promise<T>(promise: Promise<T>, messages: PromiseToastMessages<T>): void {
		toast.promise(promise, messages);
	}

	// Utility methods
	public dismiss(toastId?: string): void {
		toast.dismiss(toastId);
	}

	public dismissAll(): void {
		toast.dismiss();
	}

	/**
	 * Generates standardized CRUD messages based on operation and entity
	 */
	private getCrudMessage(
		operation: CrudOperation,
		entity?: string,
		type: 'loading' | 'success' | 'error' = 'success',
	): string {
		const entityName = entity ? ` ${entity}` : '';

		switch (operation) {
			case 'create':
				switch (type) {
					case 'loading':
						return `Creating${entityName}...`;
					case 'success':
						return `${entity ? entity.charAt(0).toUpperCase() + entity.slice(1) : 'Item'} created successfully`;
					case 'error':
						return `Failed to create${entityName}`;
				}
			case 'update':
				switch (type) {
					case 'loading':
						return `Updating${entityName}...`;
					case 'success':
						return `${entity ? entity.charAt(0).toUpperCase() + entity.slice(1) : 'Item'} updated successfully`;
					case 'error':
						return `Failed to update${entityName}`;
				}
			case 'delete':
				switch (type) {
					case 'loading':
						return `Deleting${entityName}...`;
					case 'success':
						return `${entity ? entity.charAt(0).toUpperCase() + entity.slice(1) : 'Item'} deleted successfully`;
					case 'error':
						return `Failed to delete${entityName}`;
				}
			case 'fetch':
				switch (type) {
					case 'loading':
						return `Loading${entityName}...`;
					case 'success':
						return `${entity ? entity.charAt(0).toUpperCase() + entity.slice(1) : 'Data'} loaded successfully`;
					case 'error':
						return `Failed to load${entityName}`;
				}
			default:
				switch (type) {
					case 'loading':
						return 'Processing...';
					case 'success':
						return 'Operation completed successfully';
					case 'error':
						return 'Operation failed';
				}
		}
	}
}

// Export singleton instance
export const toastService = new UnifiedToastService();

// Export class for testing purposes
export { UnifiedToastService };
