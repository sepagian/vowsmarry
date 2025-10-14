import { toast } from 'svelte-sonner';
import type { PromiseToastMessages } from '$lib/types.js';
import { ValidationToasts, type ServerValidationError } from './validation-toasts.js';

/**
 * Form Toast Utilities
 * 
 * Provides comprehensive toast messaging for form operations including:
 * - Form submission with promise-based loading states
 * - Validation error aggregation and display
 * - Network error handling with retry actions
 * - File upload progress feedback
 * - Form state management notifications
 */

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
 * File upload progress configuration
 */
export interface FileUploadConfig {
    fileName: string;
    fileSize?: number;
    fileType?: string;
    maxSize?: number;
}

/**
 * Form submission configuration
 */
export interface FormSubmissionConfig {
    formName?: string;
    successMessage?: string;
    errorMessage?: string;
    loadingMessage?: string;
    redirectAfterSuccess?: string;
}

/**
 * Network error configuration
 */
export interface NetworkErrorConfig {
    isRetryable?: boolean;
    retryAction?: () => void | Promise<void>;
    maxRetries?: number;
    currentRetry?: number;
}

/**
 * Form Toast Class
 * 
 * Handles all form-related toast notifications with promise support,
 * validation integration, and comprehensive error handling
 */
export class FormToasts {
    /**
     * Display success toast for form submission
     */
    static success(
        message = 'Form submitted successfully!',
        options?: {
            description?: string;
            redirectAction?: () => void;
            undoAction?: () => void | Promise<void>;
            duration?: number;
        }
    ): void {
        const toastOptions: SonnerToastOptions = {
            duration: options?.duration || 4000,
            description: options?.description
        };

        // Add redirect or undo action
        if (options?.redirectAction) {
            toastOptions.action = {
                label: 'Continue',
                onClick: (event: MouseEvent) => {
                    event.preventDefault();
                    options.redirectAction?.();
                }
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
                    } catch (error) {
                        toast.error('Failed to undo changes');
                    }
                }
            };
        }

        toast.success(message, toastOptions);
    }

    /**
     * Display validation errors using the validation toast utilities
     */
    static validationError(
        errors: string[] | { field: string; message: string; displayName?: string }[],
        options?: {
            scrollToFirstError?: () => void;
            maxDisplayErrors?: number;
            duration?: number;
        }
    ): void {
        // Handle simple string array errors
        if (typeof errors[0] === 'string') {
            const stringErrors = errors as string[];
            
            if (stringErrors.length === 1) {
                toast.error(stringErrors[0], {
                    duration: options?.duration || 5000,
                    action: options?.scrollToFirstError ? {
                        label: 'Review',
                        onClick: (event: MouseEvent) => {
                            event.preventDefault();
                            options.scrollToFirstError?.();
                        }
                    } : undefined
                });
            } else {
                const message = `Please fix ${stringErrors.length} validation errors`;
                const description = stringErrors
                    .slice(0, options?.maxDisplayErrors || 3)
                    .map(error => `• ${error}`)
                    .join('\n');
                
                toast.error(message, {
                    duration: options?.duration || 8000,
                    description,
                    action: options?.scrollToFirstError ? {
                        label: 'Review errors',
                        onClick: (event: MouseEvent) => {
                            event.preventDefault();
                            options.scrollToFirstError?.();
                        }
                    } : undefined
                });
            }
        } else {
            // Handle structured field errors using ValidationToasts
            const fieldErrors = errors as { field: string; message: string; displayName?: string }[];
            const validationErrors = fieldErrors.map(error => ({
                fieldName: error.field,
                displayName: error.displayName || this.formatFieldName(error.field),
                errorMessage: error.message
            }));

            ValidationToasts.multipleErrors(validationErrors, {
                scrollToFirstError: options?.scrollToFirstError,
                maxDisplayErrors: options?.maxDisplayErrors,
                duration: options?.duration
            });
        }
    }

    /**
     * Display form submission error with retry capability
     */
    static submitError(
        error: string,
        options?: NetworkErrorConfig & {
            formName?: string;
            duration?: number;
        }
    ): void {
        const formName = options?.formName ? ` ${options.formName}` : '';
        const message = `Failed to submit${formName} form: ${error}`;

        const toastOptions: SonnerToastOptions = {
            duration: options?.duration || 6000
        };

        // Add retry action for network errors
        if (options?.isRetryable && options?.retryAction) {
            const currentRetry = options.currentRetry || 0;
            const maxRetries = options.maxRetries || 3;
            
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
                            this.submitError(
                                retryError instanceof Error ? retryError.message : 'Retry failed',
                                {
                                    ...options,
                                    currentRetry: currentRetry + 1
                                }
                            );
                        }
                    }
                };
            } else {
                toastOptions.description = 'Maximum retry attempts reached. Please try again later.';
            }
        }

        toast.error(message, toastOptions);
    }

    /**
     * Display promise-based toast for form submission
     */
    static promise<T>(
        promise: Promise<T>,
        config?: FormSubmissionConfig & {
            messages?: Partial<PromiseToastMessages<T>>;
            onSuccess?: (data: T) => void;
            onError?: (error: any) => void;
        }
    ): Promise<T> {
        const formName = config?.formName ? ` ${config.formName}` : '';
        
        const defaultMessages: PromiseToastMessages<T> = {
            loading: config?.loadingMessage || `Submitting${formName} form...`,
            success: config?.successMessage || `${config?.formName || 'Form'} submitted successfully!`,
            error: config?.errorMessage || `Failed to submit${formName} form`
        };

        const finalMessages = { ...defaultMessages, ...config?.messages };

        // Handle the promise with additional success/error callbacks
        const enhancedPromise = promise
            .then((data: T) => {
                if (config?.onSuccess) {
                    config.onSuccess(data);
                }
                return data;
            })
            .catch((error: any) => {
                if (config?.onError) {
                    config.onError(error);
                }
                throw error;
            });

        toast.promise(enhancedPromise, finalMessages);
        return enhancedPromise;
    }

    /**
     * Display file upload progress with promise support
     */
    static fileUpload<T>(
        uploadPromise: Promise<T>,
        fileConfig: FileUploadConfig,
        options?: {
            onProgress?: (progress: number) => void;
            onSuccess?: (data: T) => void;
            onError?: (error: any) => void;
            showFileSize?: boolean;
        }
    ): Promise<T> {
        const { fileName, fileSize, fileType, maxSize } = fileConfig;
        
        // Validate file size if maxSize is provided
        if (maxSize && fileSize && fileSize > maxSize) {
            const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
            const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(1);
            
            toast.error(`File too large: ${fileSizeMB}MB`, {
                description: `Maximum allowed size is ${maxSizeMB}MB`,
                duration: 6000
            });
            
            return Promise.reject(new Error('File size exceeds maximum allowed size'));
        }

        // Format file info for display
        const fileInfo = this.formatFileInfo(fileName, fileSize, fileType);
        const sizeInfo = options?.showFileSize && fileSize 
            ? ` (${this.formatFileSize(fileSize)})` 
            : '';

        const messages: PromiseToastMessages<T> = {
            loading: `Uploading ${fileInfo}${sizeInfo}...`,
            success: (data: T) => {
                if (options?.onSuccess) {
                    options.onSuccess(data);
                }
                return `${fileInfo} uploaded successfully`;
            },
            error: `Failed to upload ${fileInfo}`
        };

        const enhancedPromise = uploadPromise.catch((error: any) => {
            if (options?.onError) {
                options.onError(error);
            }
            throw error;
        });

        toast.promise(enhancedPromise, messages);
        return enhancedPromise;
    }

    /**
     * Display multiple file upload progress
     */
    static multipleFileUpload<T>(
        uploadPromises: Promise<T>[],
        fileNames: string[],
        options?: {
            onProgress?: (completed: number, total: number) => void;
            onAllComplete?: (results: T[]) => void;
            onError?: (error: any, fileName: string) => void;
        }
    ): Promise<T[]> {
        const totalFiles = uploadPromises.length;
        const fileList = fileNames.length <= 3 
            ? fileNames.join(', ')
            : `${fileNames.slice(0, 2).join(', ')} and ${totalFiles - 2} more files`;

        const batchPromise = Promise.allSettled(uploadPromises).then(results => {
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
                // Some files failed
                const failedList = failed.length <= 3 
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
            error: `Some files failed to upload`
        };

        toast.promise(batchPromise, messages);
        return batchPromise;
    }

    /**
     * Display network error with connection status
     */
    static networkError(
        error: string,
        options?: NetworkErrorConfig & {
            checkConnection?: () => Promise<boolean>;
            duration?: number;
        }
    ): void {
        const message = `Network error: ${error}`;
        
        const toastOptions: SonnerToastOptions = {
            duration: options?.duration || 8000,
            description: 'Please check your internet connection and try again'
        };

        // Add retry action with connection check
        if (options?.retryAction) {
            toastOptions.action = {
                label: 'Retry',
                onClick: async (event: MouseEvent) => {
                    event.preventDefault();
                    
                    // Check connection if function provided
                    if (options.checkConnection) {
                        try {
                            const isConnected = await options.checkConnection();
                            if (!isConnected) {
                                toast.error('No internet connection detected', {
                                    description: 'Please check your connection and try again'
                                });
                                return;
                            }
                        } catch (connectionError) {
                            toast.error('Unable to verify connection');
                            return;
                        }
                    }

                    // Proceed with retry
                    try {
                        if (options.retryAction) {
                            await options.retryAction();
                        }
                    } catch (retryError) {
                        this.networkError(
                            retryError instanceof Error ? retryError.message : 'Retry failed',
                            {
                                ...options,
                                currentRetry: (options.currentRetry || 0) + 1
                            }
                        );
                    }
                }
            };
        }

        toast.error(message, toastOptions);
    }

    /**
     * Display server validation errors
     */
    static serverValidationError(
        errors: ServerValidationError[],
        options?: {
            retryAction?: () => void | Promise<void>;
            scrollToFirstError?: () => void;
            duration?: number;
        }
    ): void {
        ValidationToasts.serverErrors(errors, options);
    }

    /**
     * Display error toast when user submits an empty form
     */
    static emptyFormError(
        options?: {
            formName?: string;
            requiredFields?: string[];
            scrollToFirstField?: () => void;
            duration?: number;
        }
    ): void {
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
            duration: options?.duration || 6000,
            description
        };

        // Add scroll-to-first-field action
        if (options?.scrollToFirstField) {
            toastOptions.action = {
                label: 'Go to form',
                onClick: (event: MouseEvent) => {
                    event.preventDefault();
                    options.scrollToFirstField?.();
                }
            };
        }

        toast.error(message, toastOptions);
    }

    /**
     * Format field name for display
     */
    private static formatFieldName(fieldName: string): string {
        return fieldName
            .replace(/([A-Z])/g, ' $1')
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase())
            .trim();
    }

    /**
     * Format file information for display
     */
    private static formatFileInfo(fileName: string, fileSize?: number, fileType?: string): string {
        const name = fileName.length > 30 
            ? `${fileName.substring(0, 27)}...`
            : fileName;
        
        return name;
    }

    /**
     * Format file size for display
     */
    private static formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 B';
        
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
    }
}

/**
 * Convenience functions for common form scenarios
 */

/**
 * Handle form submission with promise-based toast
 */
export function submitFormWithToast<T>(
    submitPromise: Promise<T>,
    config?: FormSubmissionConfig & {
        onSuccess?: (data: T) => void;
        onValidationError?: (errors: any) => void;
        onNetworkError?: (error: any) => void;
    }
): Promise<T> {
    return FormToasts.promise(submitPromise, {
        ...config,
        onError: (error: any) => {
            // Handle different types of errors
            if (error.validation || error.errors) {
                // Validation errors
                const errors = error.validation || error.errors;
                if (config?.onValidationError) {
                    config.onValidationError(errors);
                } else {
                    FormToasts.validationError(errors);
                }
            } else if (error.network || error.code === 'NETWORK_ERROR') {
                // Network errors
                if (config?.onNetworkError) {
                    config.onNetworkError(error);
                } else {
                    FormToasts.networkError(error.message || 'Connection failed');
                }
            } else {
                // Generic form submission error
                FormToasts.submitError(error.message || 'Unknown error occurred');
            }
        }
    });
}

/**
 * Handle file upload with progress toast
 */
export function uploadFileWithToast<T>(
    uploadPromise: Promise<T>,
    fileName: string,
    options?: {
        fileSize?: number;
        fileType?: string;
        maxSize?: number;
        onSuccess?: (data: T) => void;
        onError?: (error: any) => void;
        showFileSize?: boolean;
    }
): Promise<T> {
    return FormToasts.fileUpload(uploadPromise, {
        fileName,
        fileSize: options?.fileSize,
        fileType: options?.fileType,
        maxSize: options?.maxSize
    }, {
        onSuccess: options?.onSuccess,
        onError: options?.onError,
        showFileSize: options?.showFileSize
    });
}

/**
 * Handle multiple file uploads with batch progress
 */
export function uploadMultipleFilesWithToast<T>(
    uploadPromises: Promise<T>[],
    fileNames: string[],
    options?: {
        onProgress?: (completed: number, total: number) => void;
        onAllComplete?: (results: T[]) => void;
        onError?: (error: any, fileName: string) => void;
    }
): Promise<T[]> {
    return FormToasts.multipleFileUpload(uploadPromises, fileNames, options);
}

/**
 * Show form validation summary
 */
export function showFormValidationErrors(
    errors: { field: string; message: string; displayName?: string }[],
    options?: {
        scrollToFirstError?: () => void;
        maxDisplayErrors?: number;
    }
): void {
    FormToasts.validationError(errors, options);
}

/**
 * Show form success with optional redirect
 */
export function showFormSuccess(
    message?: string,
    options?: {
        description?: string;
        redirectAction?: () => void;
        undoAction?: () => void | Promise<void>;
    }
): void {
    FormToasts.success(message, options);
}

/**
 * Handle network connectivity issues
 */
export function handleNetworkError(
    error: string,
    retryAction?: () => void | Promise<void>,
    options?: {
        checkConnection?: () => Promise<boolean>;
        maxRetries?: number;
        currentRetry?: number;
    }
): void {
    FormToasts.networkError(error, {
        retryAction,
        checkConnection: options?.checkConnection,
        maxRetries: options?.maxRetries,
        currentRetry: options?.currentRetry,
        isRetryable: !!retryAction
    });
}

/**
 * Show error toast when user tries to submit an empty form
 */
export function showEmptyFormError(
    options?: {
        formName?: string;
        requiredFields?: string[];
        scrollToFirstField?: () => void;
    }
): void {
    FormToasts.emptyFormError(options);
}

/**
 * Validate form and show appropriate error if empty
 */
export function validateFormNotEmpty(
    formData: Record<string, any>,
    requiredFields: string[],
    options?: {
        formName?: string;
        scrollToFirstField?: () => void;
        fieldDisplayNames?: Record<string, string>;
    }
): boolean {
    const emptyFields: string[] = [];
    
    // Check each required field
    for (const field of requiredFields) {
        const value = formData[field];
        if (value === undefined || value === null || value === '' || 
            (Array.isArray(value) && value.length === 0) ||
            (typeof value === 'object' && Object.keys(value).length === 0)) {
            const displayName = options?.fieldDisplayNames?.[field] || 
                             field.replace(/([A-Z])/g, ' $1')
                                  .replace(/_/g, ' ')
                                  .replace(/\b\w/g, l => l.toUpperCase())
                                  .trim();
            emptyFields.push(displayName);
        }
    }
    
    // If there are empty fields, show error toast
    if (emptyFields.length > 0) {
        FormToasts.emptyFormError({
            formName: options?.formName,
            requiredFields: emptyFields,
            scrollToFirstField: options?.scrollToFirstField
        });
        return false;
    }
    
    return true;
}

// Export the main class as default
export default FormToasts;

/**
 * Usage Examples:
 * 
 * // Basic empty form error
 * showEmptyFormError();
 * 
 * // Empty form error with form name
 * showEmptyFormError({ formName: 'contact' });
 * 
 * // Empty form error with specific required fields
 * showEmptyFormError({
 *   formName: 'registration',
 *   requiredFields: ['Name', 'Email', 'Password'],
 *   scrollToFirstField: () => document.getElementById('name')?.focus()
 * });
 * 
 * // Validate form before submission
 * const formData = { name: '', email: 'user@example.com', password: '' };
 * const requiredFields = ['name', 'email', 'password'];
 * 
 * if (!validateFormNotEmpty(formData, requiredFields, {
 *   formName: 'registration',
 *   fieldDisplayNames: { name: 'Full Name', email: 'Email Address' }
 * })) {
 *   return; // Don't submit if form is empty
 * }
 * 
 * // Using with toast service
 * import { toastService } from '$lib/utils/toast-service.js';
 * 
 * toastService.form.emptyFormError({
 *   formName: 'contact',
 *   requiredFields: ['Name', 'Email', 'Message']
 * });
 */