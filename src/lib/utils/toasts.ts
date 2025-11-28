import { toast } from 'svelte-sonner';
import type { CrudOperation, PromiseToastMessages, EntityConfig } from '$lib/types.js';
import { TOAST_CONFIG, BYTES, RETRY_CONFIG } from '$lib/constants/config.js';

/**
 * Unified Toast Utilities
 * 
 * Consolidated toast service providing consistent messaging across the application.
 * Combines CRUD operations, form handling, and authentication toasts.
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface SonnerToastOptions {
	duration?: number;
	description?: string;
	action?: {
		label: string;
		onClick: (event: MouseEvent) => void;
	};
}

export interface FileUploadConfig {
	fileName: string;
	fileSize?: number;
	fileType?: string;
	maxSize?: number;
}

export interface FormSubmissionConfig {
	formName?: string;
	successMessage?: string;
	errorMessage?: string;
	loadingMessage?: string;
	redirectAfterSuccess?: string;
}

export interface NetworkErrorConfig {
	isRetryable?: boolean;
	retryAction?: () => void | Promise<void>;
	maxRetries?: number;
	currentRetry?: number;
}

export interface ServerValidationError {
	field: string;
	message: string;
	code?: string;
}

export type BetterAuthErrorCode = 
	| 'INVALID_CREDENTIALS'
	| 'EMAIL_NOT_VERIFIED'
	| 'RATE_LIMIT_EXCEEDED'
	| 'USER_NOT_FOUND'
	| 'EMAIL_ALREADY_EXISTS'
	| 'WEAK_PASSWORD'
	| 'INVALID_EMAIL'
	| 'PASSWORD_RESET_FAILED'
	| 'INVALID_TOKEN'
	| 'NETWORK_ERROR'
	| 'SERVER_ERROR';

// ============================================================================
// ENTITY CONFIGURATIONS
// ============================================================================

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

// ============================================================================
// AUTH MESSAGES
// ============================================================================

export const AUTH_MESSAGES = {
	success: {
		login: "Welcome back! You've been logged in successfully.",
		register: 'Account created successfully! Please check your email to verify your account.',
		logout: "You've been logged out successfully. See you soon!",
		passwordResetRequest: 'Password reset email sent! Check your inbox for further instructions.',
		passwordResetSuccess: 'Password updated successfully! You can now log in with your new password.',
		emailVerification: 'Email verified successfully! You can now access all features.',
		profileUpdate: 'Profile updated successfully!',
	},
	error: {
		invalidCredentials: 'Invalid email or password. Please check your credentials and try again.',
		emailNotConfirmed: 'Please verify your email address before signing in. Check your inbox for the verification link.',
		tooManyRequests: 'Too many attempts. Please wait a moment before trying again.',
		userNotFound: 'No account found with this email address.',
		emailAlreadyExists: 'An account with this email already exists. Try logging in instead.',
		weakPassword: 'Password is too weak. Please choose a stronger password.',
		invalidEmail: 'Please enter a valid email address.',
		passwordResetFailed: 'Failed to send password reset email. Please try again.',
		invalidResetToken: 'Invalid or expired reset link. Please request a new password reset.',
		passwordUpdateFailed: 'Failed to update password. Please try again.',
		networkError: 'Network error. Please check your connection and try again.',
		serverError: 'Something went wrong on our end. Please try again later.',
		validationError: 'Please fix the errors in the form before submitting.',
		unexpectedError: 'An unexpected error occurred. Please try again.',
		sessionExpired: 'Your session has expired. Please log in again.',
		unauthorized: 'You need to be logged in to access this feature.',
	},
	warning: {
		sessionExpiring: 'Your session will expire soon. Please save your work.',
		emailNotVerified: 'Please verify your email to access all features.',
	},
} as const;

// ============================================================================
// CORE TOAST METHODS
// ============================================================================

export const toasts = {
	message: (message: string): void => {
		toast(message);
	},
	success: (message: string): void => {
		toast.success(message);
	},
	error: (message: string): void => {
		toast.error(message);
	},
	warning: (message: string): void => {
		toast.warning(message);
	},
	info: (message: string): void => {
		toast.info(message);
	},
	promise: <T>(promise: Promise<T>, messages: PromiseToastMessages<T>): void => {
		toast.promise(promise, messages);
	},
	dismiss: (toastId?: string): void => {
		toast.dismiss(toastId);
	},
	dismissAll: (): void => {
		toast.dismiss();
	},
};

// ============================================================================
// CRUD NAMESPACE
// ============================================================================

export const crud = {
	success: (
		operation: CrudOperation,
		entity?: string,
		options?: {
			itemName?: string;
			undoAction?: () => void | Promise<void>;
			duration?: number;
		},
	): void => {
		const config = entity ? entityConfigs[entity] : null;
		const message = config?.operations[operation] || getDefaultMessage(operation, 'success');

		const toastOptions: SonnerToastOptions = {
			duration: options?.duration || TOAST_CONFIG.SUCCESS_DURATION,
		};

		if (options?.itemName) {
			toastOptions.description = `"${options.itemName}"`;
		}

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
					} catch {
						toast.error('Failed to undo action');
					}
				},
			};
		}

		toast.success(message, toastOptions);
	},

	error: (
		operation: CrudOperation,
		error: string,
		entity?: string,
		options?: {
			retryAction?: () => void | Promise<void>;
			isNetworkError?: boolean;
			duration?: number;
		},
	): void => {
		const config = entity ? entityConfigs[entity] : null;
		const baseMessage = config
			? `Failed to ${operation} ${config.displayName.toLowerCase()}`
			: getDefaultMessage(operation, 'error');

		const message = `${baseMessage}: ${error}`;

		const toastOptions: SonnerToastOptions = {
			duration: options?.duration || TOAST_CONFIG.ERROR_DURATION,
			description: options?.isNetworkError
				? 'Please check your connection and try again'
				: undefined,
		};

		if (options?.retryAction && (options?.isNetworkError || operation !== 'delete')) {
			toastOptions.action = {
				label: 'Retry',
				onClick: async (event: MouseEvent) => {
					event.preventDefault();
					try {
						if (options.retryAction) {
							await options.retryAction();
						}
					} catch {
						crud.error(operation, 'Retry failed', entity, {
							isNetworkError: options.isNetworkError,
						});
					}
				},
			};
		}

		toast.error(message, toastOptions);
	},

	promise: <T>(
		promise: Promise<T>,
		operation: CrudOperation,
		entity?: string,
		options?: {
			messages?: Partial<PromiseToastMessages<T>>;
			itemName?: string;
		},
	): Promise<T> => {
		const config = entity ? entityConfigs[entity] : null;

		const successMsg =
			config?.operations[operation] || getDefaultMessage(operation, 'success');
		const successMessage = options?.itemName ? `${successMsg}: "${options.itemName}"` : successMsg;

		const defaultMessages: PromiseToastMessages<T> = {
			loading: getLoadingMessage(operation, config),
			success: successMessage,
			error: config
				? `Failed to ${operation} ${config.displayName.toLowerCase()}`
				: getDefaultMessage(operation, 'error'),
		};

		const finalMessages = { ...defaultMessages, ...options?.messages };
		toast.promise(promise, finalMessages);
		return promise;
	},

	batch: <T>(
		promises: Promise<T>[],
		operation: CrudOperation,
		entity?: string,
		options?: {
			itemCount?: number;
			successMessage?: string;
			errorMessage?: string;
		},
	): Promise<T[]> => {
		const config = entity ? entityConfigs[entity] : null;
		const itemCount = options?.itemCount || promises.length;
		const entityName = config?.displayName.toLowerCase() || 'item';
		const pluralEntityName = itemCount === 1 ? entityName : pluralize(entityName);

		const batchPromise = Promise.all(promises);

		const messages: PromiseToastMessages<T[]> = {
			loading: `${capitalizeFirst(getOperationVerb(operation))} ${itemCount} ${pluralEntityName}...`,
			success:
				options?.successMessage ||
				`Successfully ${getOperationPastTense(operation)} ${itemCount} ${pluralEntityName}`,
			error:
				options?.errorMessage ||
				`Failed to ${operation} some ${pluralEntityName}. Please try again.`,
		};

		toast.promise(batchPromise, messages);
		return batchPromise;
	},
};

// ============================================================================
// FORM NAMESPACE
// ============================================================================

export const form = {
	success: (
		message = 'Form submitted successfully!',
		options?: {
			description?: string;
			redirectAction?: () => void;
			undoAction?: () => void | Promise<void>;
			duration?: number;
		},
	): void => {
		const toastOptions: SonnerToastOptions = {
			duration: options?.duration || TOAST_CONFIG.DEFAULT_DURATION,
			description: options?.description,
		};

		if (options?.redirectAction) {
			toastOptions.action = {
				label: 'Continue',
				onClick: (event: MouseEvent) => {
					event.preventDefault();
					options.redirectAction?.();
				},
			};
		} else if (options?.undoAction) {
			toastOptions.action = {
				label: 'Undo',
				onClick: async (event: MouseEvent) => {
					event.preventDefault();
					try {
						if (options.undoAction) {
							await options.undoAction();
							toast.success('Changes undone successfully');
						}
					} catch {
						toast.error('Failed to undo changes');
					}
				},
			};
		}

		toast.success(message, toastOptions);
	},

	validationError: (
		errors: string[] | { field: string; message: string; displayName?: string }[],
		options?: {
			scrollToFirstError?: () => void;
			maxDisplayErrors?: number;
			duration?: number;
		},
	): void => {
		if (typeof errors[0] === 'string') {
			const stringErrors = errors as string[];

			if (stringErrors.length === 1) {
				toast.error(stringErrors[0], {
					duration: options?.duration || TOAST_CONFIG.WARNING_DURATION,
					action: options?.scrollToFirstError
						? {
								label: 'Review',
								onClick: (event: MouseEvent) => {
									event.preventDefault();
									options.scrollToFirstError?.();
								},
							}
						: undefined,
				});
			} else {
				const message = `Please fix ${stringErrors.length} validation errors`;
				const description = stringErrors
					.slice(0, options?.maxDisplayErrors || 3)
					.map((error) => `• ${error}`)
					.join('\n');

				toast.error(message, {
					duration: options?.duration || 8000,
					description,
					action: options?.scrollToFirstError
						? {
								label: 'Review errors',
								onClick: (event: MouseEvent) => {
									event.preventDefault();
									options.scrollToFirstError?.();
								},
							}
						: undefined,
				});
			}
		} else {
			const fieldErrors = errors as { field: string; message: string; displayName?: string }[];
			const validationErrors = fieldErrors.map((error) => ({
				fieldName: error.field,
				displayName: error.displayName || formatFieldName(error.field),
				errorMessage: error.message,
			}));

			const maxDisplay = options?.maxDisplayErrors || 3;
			const displayErrors = validationErrors.slice(0, maxDisplay);
			const remainingCount = validationErrors.length - maxDisplay;

			const message = `Please fix ${validationErrors.length} validation error${validationErrors.length > 1 ? 's' : ''}`;
			let description = displayErrors
				.map((error) => `${error.displayName}: ${error.errorMessage}`)
				.join('\n');

			if (remainingCount > 0) {
				description += `\n...and ${remainingCount} more error${remainingCount > 1 ? 's' : ''}`;
			}

			toast.error(message, {
				duration: options?.duration || 8000,
				description,
				action: options?.scrollToFirstError
					? {
							label: 'Review errors',
							onClick: (event: MouseEvent) => {
								event.preventDefault();
								options.scrollToFirstError?.();
							},
						}
					: undefined,
			});
		}
	},

	submitError: (
		error: string,
		options?: NetworkErrorConfig & {
			formName?: string;
			duration?: number;
		},
	): void => {
		const formName = options?.formName ? ` ${options.formName}` : '';
		const message = `Failed to submit${formName} form: ${error}`;

		const toastOptions: SonnerToastOptions = {
			duration: options?.duration || TOAST_CONFIG.ERROR_DURATION,
		};

		if (options?.isRetryable && options?.retryAction) {
			const currentRetry = options.currentRetry || 0;
			const maxRetries = options.maxRetries || RETRY_CONFIG.MAX_FORM_RETRIES;

			if (currentRetry < maxRetries) {
				toastOptions.description = `Attempt ${currentRetry + 1} of ${maxRetries + 1}`;
				toastOptions.action = {
					label: 'Retry',
					onClick: async (event: MouseEvent) => {
						event.preventDefault();
						try {
							if (options.retryAction) {
								await options.retryAction();
							}
						} catch (retryError) {
							form.submitError(retryError instanceof Error ? retryError.message : 'Retry failed', {
								...options,
								currentRetry: currentRetry + 1,
							});
						}
					},
				};
			} else {
				toastOptions.description = 'Maximum retry attempts reached. Please try again later.';
			}
		}

		toast.error(message, toastOptions);
	},

	emptyFormError: (options?: {
		formName?: string;
		requiredFields?: string[];
		scrollToFirstField?: () => void;
		duration?: number;
	}): void => {
		const formName = options?.formName ? ` ${options.formName}` : '';
		const message = `Cannot submit empty${formName} form`;

		let description: string;
		if (options?.requiredFields && options.requiredFields.length > 0) {
			const fieldCount = options.requiredFields.length;
			if (fieldCount <= 3) {
				description = `Please fill in: ${options.requiredFields.join(', ')}`;
			} else {
				description = `Please fill in ${fieldCount} required fields: ${options.requiredFields.slice(0, 2).join(', ')} and ${fieldCount - 2} more`;
			}
		} else {
			description = 'Please fill in the required fields before submitting';
		}

		const toastOptions: SonnerToastOptions = {
			duration: options?.duration || TOAST_CONFIG.ERROR_DURATION,
			description,
		};

		if (options?.scrollToFirstField) {
			toastOptions.action = {
				label: 'Go to form',
				onClick: (event: MouseEvent) => {
					event.preventDefault();
					options.scrollToFirstField?.();
				},
			};
		}

		toast.error(message, toastOptions);
	},

	promise: <T>(
		promise: Promise<T>,
		config?: FormSubmissionConfig & {
			messages?: Partial<PromiseToastMessages<T>>;
			onSuccess?: (data: T) => void;
			onError?: (error: unknown) => void;
		},
	): Promise<T> => {
		const formName = config?.formName ? ` ${config.formName}` : '';

		const defaultMessages: PromiseToastMessages<T> = {
			loading: config?.loadingMessage || `Submitting${formName} form...`,
			success: config?.successMessage || `${config?.formName || 'Form'} submitted successfully!`,
			error: config?.errorMessage || `Failed to submit${formName} form`,
		};

		const finalMessages = { ...defaultMessages, ...config?.messages };

		const enhancedPromise = promise
			.then((data: T) => {
				if (config?.onSuccess) {
					config.onSuccess(data);
				}
				return data;
			})
			.catch((error: unknown) => {
				if (config?.onError) {
					config.onError(error);
				}
				throw error;
			});

		toast.promise(enhancedPromise, finalMessages);
		return enhancedPromise;
	},

	fileUpload: <T>(
		uploadPromise: Promise<T>,
		fileConfig: FileUploadConfig,
		options?: {
			onSuccess?: (data: T) => void;
			onError?: (error: unknown) => void;
			showFileSize?: boolean;
		},
	): Promise<T> => {
		const { fileName, fileSize, fileType, maxSize } = fileConfig;

		if (maxSize && fileSize && fileSize > maxSize) {
			const maxSizeMB = (maxSize / BYTES.MB).toFixed(1);
			const fileSizeMB = (fileSize / BYTES.MB).toFixed(1);

			toast.error(`File too large: ${fileSizeMB}MB`, {
				description: `Maximum allowed size is ${maxSizeMB}MB`,
				duration: TOAST_CONFIG.ERROR_DURATION,
			});

			return Promise.reject(new Error('File size exceeds maximum allowed size'));
		}

		const fileInfo = formatFileInfo(fileName, fileType);
		const sizeInfo = options?.showFileSize && fileSize ? ` (${formatFileSize(fileSize)})` : '';

		const messages: PromiseToastMessages<T> = {
			loading: `Uploading ${fileInfo}${sizeInfo}...`,
			success: (data: T) => {
				if (options?.onSuccess) {
					options.onSuccess(data);
				}
				return `${fileInfo} uploaded successfully`;
			},
			error: `Failed to upload ${fileInfo}`,
		};

		const enhancedPromise = uploadPromise.catch((error: unknown) => {
			if (options?.onError) {
				options.onError(error);
			}
			throw error;
		});

		toast.promise(enhancedPromise, messages);
		return enhancedPromise;
	},

	multipleFileUpload: <T>(
		uploadPromises: Promise<T>[],
		fileNames: string[],
		options?: {
			onProgress?: (completed: number, total: number) => void;
			onAllComplete?: (results: T[]) => void;
			onError?: (error: unknown, fileName: string) => void;
		},
	): Promise<T[]> => {
		const totalFiles = uploadPromises.length;
		const fileList =
			fileNames.length <= 3
				? fileNames.join(', ')
				: `${fileNames.slice(0, 2).join(', ')} and ${totalFiles - 2} more files`;

		const batchPromise = Promise.allSettled(uploadPromises).then((results) => {
			const successful: T[] = [];
			const failed: string[] = [];

			results.forEach((result, index) => {
				if (result.status === 'fulfilled') {
					successful.push(result.value);
				} else {
					failed.push(fileNames[index] || `File ${index + 1}`);
					if (options?.onError) {
						options.onError(result.reason, fileNames[index] || `File ${index + 1}`);
					}
				}
			});

			if (options?.onProgress) {
				options.onProgress(successful.length, totalFiles);
			}

			if (failed.length > 0) {
				const failedList =
					failed.length <= 3
						? failed.join(', ')
						: `${failed.slice(0, 2).join(', ')} and ${failed.length - 2} more`;

				throw new Error(`Failed to upload: ${failedList}`);
			}

			if (options?.onAllComplete) {
				options.onAllComplete(successful);
			}

			return successful;
		});

		const messages: PromiseToastMessages<T[]> = {
			loading: `Uploading ${totalFiles} files...`,
			success: `Successfully uploaded ${fileList}`,
			error: `Some files failed to upload`,
		};

		toast.promise(batchPromise, messages);
		return batchPromise;
	},

	networkError: (
		error: string,
		options?: NetworkErrorConfig & {
			checkConnection?: () => Promise<boolean>;
			duration?: number;
		},
	): void => {
		const message = `Network error: ${error}`;

		const toastOptions: SonnerToastOptions = {
			duration: options?.duration || 8000,
			description: 'Please check your internet connection and try again',
		};

		if (options?.retryAction) {
			toastOptions.action = {
				label: 'Retry',
				onClick: async (event: MouseEvent) => {
					event.preventDefault();

					if (options.checkConnection) {
						try {
							const isConnected = await options.checkConnection();
							if (!isConnected) {
								toast.error('No internet connection detected', {
									description: 'Please check your connection and try again',
								});
								return;
							}
						} catch {
							toast.error('Unable to verify connection');
							return;
						}
					}

					try {
						if (options.retryAction) {
							await options.retryAction();
						}
					} catch (retryError) {
						form.networkError(retryError instanceof Error ? retryError.message : 'Retry failed', {
							...options,
							currentRetry: (options.currentRetry || 0) + 1,
						});
					}
				},
			};
		}

		toast.error(message, toastOptions);
	},
};

// ============================================================================
// AUTH NAMESPACE
// ============================================================================

export const auth = {
	success: {
		login: () => toast.success(AUTH_MESSAGES.success.login),
		register: () => toast.success(AUTH_MESSAGES.success.register),
		logout: () => toast.success(AUTH_MESSAGES.success.logout),
		passwordResetRequest: () => toast.info(AUTH_MESSAGES.success.passwordResetRequest),
		passwordResetSuccess: () => toast.success(AUTH_MESSAGES.success.passwordResetSuccess),
		emailVerification: () => toast.success(AUTH_MESSAGES.success.emailVerification),
		profileUpdate: () => toast.success(AUTH_MESSAGES.success.profileUpdate),
	},
	error: {
		invalidCredentials: () => toast.error(AUTH_MESSAGES.error.invalidCredentials),
		emailNotConfirmed: () => toast.error(AUTH_MESSAGES.error.emailNotConfirmed),
		tooManyRequests: () => toast.error(AUTH_MESSAGES.error.tooManyRequests),
		userNotFound: () => toast.error(AUTH_MESSAGES.error.userNotFound),
		emailAlreadyExists: () => toast.error(AUTH_MESSAGES.error.emailAlreadyExists),
		weakPassword: () => toast.error(AUTH_MESSAGES.error.weakPassword),
		invalidEmail: () => toast.error(AUTH_MESSAGES.error.invalidEmail),
		passwordResetFailed: () => toast.error(AUTH_MESSAGES.error.passwordResetFailed),
		invalidResetToken: () => toast.error(AUTH_MESSAGES.error.invalidResetToken),
		passwordUpdateFailed: () => toast.error(AUTH_MESSAGES.error.passwordUpdateFailed),
		networkError: () => toast.error(AUTH_MESSAGES.error.networkError),
		serverError: () => toast.error(AUTH_MESSAGES.error.serverError),
		validationError: () => toast.error(AUTH_MESSAGES.error.validationError),
		unexpectedError: () => toast.error(AUTH_MESSAGES.error.unexpectedError),
		sessionExpired: () => toast.warning(AUTH_MESSAGES.error.sessionExpired),
		unauthorized: () => toast.error(AUTH_MESSAGES.error.unauthorized),
	},
	warning: {
		sessionExpiring: () => toast.warning(AUTH_MESSAGES.warning.sessionExpiring),
		emailNotVerified: () => toast.warning(AUTH_MESSAGES.warning.emailNotVerified),
	},
};

const ERROR_CODE_TO_TOAST_MAP: Record<string, () => void> = {
	INVALID_CREDENTIALS: auth.error.invalidCredentials,
	EMAIL_NOT_VERIFIED: auth.error.emailNotConfirmed,
	RATE_LIMIT_EXCEEDED: auth.error.tooManyRequests,
	USER_NOT_FOUND: auth.error.userNotFound,
	EMAIL_ALREADY_EXISTS: auth.error.emailAlreadyExists,
	WEAK_PASSWORD: auth.error.weakPassword,
	INVALID_EMAIL: auth.error.invalidEmail,
	PASSWORD_RESET_FAILED: auth.error.passwordResetFailed,
	INVALID_TOKEN: auth.error.invalidResetToken,
	NETWORK_ERROR: auth.error.networkError,
	SERVER_ERROR: auth.error.serverError,
};

export function handleAuthError(error: { 
	message: string; 
	status?: number; 
	code?: BetterAuthErrorCode | string;
}): void {
	if (!error.code) {
		auth.error.unexpectedError();
		return;
	}

	const toastHandler = ERROR_CODE_TO_TOAST_MAP[error.code];
	if (toastHandler) {
		toastHandler();
	} else {
		auth.error.unexpectedError();
	}
}

export function handleFormValidationError(): void {
	auth.error.validationError();
}

export function handleFormSuccess(
	type: keyof typeof auth.success, 
	customMessage?: string
): void {
	if (customMessage) {
		toast.success(customMessage);
	} else {
		auth.success[type]();
	}
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getDefaultMessage(operation: CrudOperation, type: 'success' | 'error'): string {
	const operationMap = {
		create: { success: 'Item created successfully', error: 'Failed to create item' },
		update: { success: 'Item updated successfully', error: 'Failed to update item' },
		delete: { success: 'Item deleted successfully', error: 'Failed to delete item' },
		fetch: { success: 'Data loaded successfully', error: 'Failed to load data' },
	};

	return operationMap[operation][type];
}

function getLoadingMessage(operation: CrudOperation, config?: EntityConfig | null): string {
	const verb = getOperationVerb(operation);
	const entityName = config?.displayName.toLowerCase() || 'item';
	return `${capitalizeFirst(verb)} ${entityName}...`;
}

function getOperationVerb(operation: CrudOperation): string {
	const verbMap = {
		create: 'creating',
		update: 'updating',
		delete: 'deleting',
		fetch: 'loading',
	};
	return verbMap[operation];
}

function getOperationPastTense(operation: CrudOperation): string {
	const verbMap = {
		create: 'created',
		update: 'updated',
		delete: 'deleted',
		fetch: 'loaded',
	};
	return verbMap[operation];
}

function capitalizeFirst(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

function pluralize(word: string): string {
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

function formatFieldName(fieldName: string): string {
	return fieldName
		.replace(/([A-Z])/g, ' $1')
		.replace(/_/g, ' ')
		.replace(/\b\w/g, (l) => l.toUpperCase())
		.trim();
}

function formatFileInfo(fileName: string, fileType?: string): string {
	const name = fileName.length > 30 ? `${fileName.substring(0, 27)}...` : fileName;
	const typeInfo = fileType ? ` (${fileType})` : '';
	return `${name}${typeInfo}`;
}

function formatFileSize(bytes: number): string {
	if (bytes === 0) return '0 B';

	const k = 1024;
	const sizes = ['B', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// ============================================================================
// CONVENIENCE EXPORTS (Backward Compatibility)
// ============================================================================

// CRUD convenience functions
export const showCreateSuccess = (
	entity: string,
	itemName?: string,
	undoAction?: () => void | Promise<void>,
): void => crud.success('create', entity, { itemName, undoAction });

export const showUpdateSuccess = (entity: string, itemName?: string): void =>
	crud.success('update', entity, { itemName });

export const showDeleteSuccess = (
	entity: string,
	itemName?: string,
	undoAction?: () => void | Promise<void>,
): void => crud.success('delete', entity, { itemName, undoAction });

export const showOperationError = (
	operation: CrudOperation,
	entity: string,
	error: string,
	retryAction?: () => void | Promise<void>,
	isNetworkError = false,
): void => crud.error(operation, error, entity, { retryAction, isNetworkError });

export const executeWithToast = <T>(
	promise: Promise<T>,
	operation: CrudOperation,
	entity: string,
	options?: {
		itemName?: string;
		customMessages?: Partial<PromiseToastMessages<T>>;
	},
): Promise<T> => crud.promise(promise, operation, entity, { messages: options?.customMessages, itemName: options?.itemName });

export const executeBatchWithToast = <T>(
	promises: Promise<T>[],
	operation: CrudOperation,
	entity: string,
	options?: {
		successMessage?: string;
		errorMessage?: string;
	},
): Promise<T[]> => crud.batch(promises, operation, entity, options);

// Form convenience functions
export const submitFormWithToast = <T>(
	submitPromise: Promise<T>,
	config?: FormSubmissionConfig & {
		onSuccess?: (data: T) => void;
		onValidationError?: (errors: unknown) => void;
		onNetworkError?: (error: unknown) => void;
	},
): Promise<T> => form.promise(submitPromise, config);

export const uploadFileWithToast = <T>(
	uploadPromise: Promise<T>,
	fileName: string,
	options?: {
		fileSize?: number;
		fileType?: string;
		maxSize?: number;
		onSuccess?: (data: T) => void;
		onError?: (error: unknown) => void;
		showFileSize?: boolean;
	},
): Promise<T> => form.fileUpload(uploadPromise, { fileName, ...options }, options);

export const uploadMultipleFilesWithToast = <T>(
	uploadPromises: Promise<T>[],
	fileNames: string[],
	options?: {
		onProgress?: (completed: number, total: number) => void;
		onAllComplete?: (results: T[]) => void;
		onError?: (error: unknown, fileName: string) => void;
	},
): Promise<T[]> => form.multipleFileUpload(uploadPromises, fileNames, options);

export const showFormValidationErrors = (
	errors: { field: string; message: string; displayName?: string }[],
	options?: {
		scrollToFirstError?: () => void;
		maxDisplayErrors?: number;
	},
): void => form.validationError(errors, options);

export const showFormSuccess = (
	message?: string,
	options?: {
		description?: string;
		redirectAction?: () => void;
		undoAction?: () => void | Promise<void>;
	},
): void => form.success(message, options);

export const handleNetworkError = (
	error: string,
	retryAction?: () => void | Promise<void>,
	options?: {
		checkConnection?: () => Promise<boolean>;
		maxRetries?: number;
		currentRetry?: number;
	},
): void => form.networkError(error, { retryAction, ...options, isRetryable: !!retryAction });

export const showEmptyFormError = (options?: {
	formName?: string;
	requiredFields?: string[];
	scrollToFirstField?: () => void;
}): void => form.emptyFormError(options);

export const validateFormNotEmpty = (
	formData: Record<string, unknown>,
	requiredFields: string[],
	options?: {
		formName?: string;
		scrollToFirstField?: () => void;
		fieldDisplayNames?: Record<string, string>;
	},
): boolean => {
	const emptyFields: string[] = [];

	for (const field of requiredFields) {
		const value = formData[field];
		if (
			value === undefined ||
			value === null ||
			value === '' ||
			(Array.isArray(value) && value.length === 0) ||
			(typeof value === 'object' && Object.keys(value).length === 0)
		) {
			const displayName = options?.fieldDisplayNames?.[field] || formatFieldName(field);
			emptyFields.push(displayName);
		}
	}

	if (emptyFields.length > 0) {
		form.emptyFormError({
			formName: options?.formName,
			requiredFields: emptyFields,
			scrollToFirstField: options?.scrollToFirstField,
		});
		return false;
	}

	return true;
};

// Legacy class exports for backward compatibility
export class CrudToasts {
	static success = crud.success;
	static error = crud.error;
	static promise = crud.promise;
	static batchPromise = crud.batch;
}

export class FormToasts {
	static success = form.success;
	static validationError = form.validationError;
	static submitError = form.submitError;
	static emptyFormError = form.emptyFormError;
	static promise = form.promise;
	static fileUpload = form.fileUpload;
	static multipleFileUpload = form.multipleFileUpload;
	static networkError = form.networkError;
}

export const authToasts = auth;

// Default export for unified service
export default {
	...toasts,
	crud,
	form,
	auth,
};
