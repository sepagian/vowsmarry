import { toast as sonnerToast } from 'svelte-sonner';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
	type?: ToastType;
	title: string;
	message?: string;
	duration?: number;
	dismissible?: boolean;
	action?: {
		label: string;
		handler: () => void;
	};
}

// Create a wrapper around svelte-sonner to maintain API compatibility
function createToastStore() {
	// Convenience methods for different toast types
	function success(title: string, message?: string, options?: Omit<ToastOptions, 'type' | 'title' | 'message'>): string | number {
		const description = message || '';
		const toastOptions: any = {};
		
		if (options?.duration !== undefined) {
			toastOptions.duration = options.duration === 0 ? Infinity : options.duration;
		}
		
		if (options?.action) {
			toastOptions.action = {
				label: options.action.label,
				onClick: options.action.handler
			};
		}
		
		return sonnerToast.success(title, { description, ...toastOptions });
	}

	function error(title: string, message?: string, options?: Omit<ToastOptions, 'type' | 'title' | 'message'>): string | number {
		const description = message || '';
		const toastOptions: any = {};
		
		// Error toasts don't auto-dismiss by default (like the original implementation)
		if (options?.duration !== undefined) {
			toastOptions.duration = options.duration === 0 ? Infinity : options.duration;
		} else {
			toastOptions.duration = Infinity;
		}
		
		if (options?.action) {
			toastOptions.action = {
				label: options.action.label,
				onClick: options.action.handler
			};
		}
		
		return sonnerToast.error(title, { description, ...toastOptions });
	}

	function warning(title: string, message?: string, options?: Omit<ToastOptions, 'type' | 'title' | 'message'>): string | number {
		const description = message || '';
		const toastOptions: any = {};
		
		if (options?.duration !== undefined) {
			toastOptions.duration = options.duration === 0 ? Infinity : options.duration;
		} else {
			toastOptions.duration = 8000; // Warning toasts stay longer (like original)
		}
		
		if (options?.action) {
			toastOptions.action = {
				label: options.action.label,
				onClick: options.action.handler
			};
		}
		
		return sonnerToast.warning(title, { description, ...toastOptions });
	}

	function info(title: string, message?: string, options?: Omit<ToastOptions, 'type' | 'title' | 'message'>): string | number {
		const description = message || '';
		const toastOptions: any = {};
		
		if (options?.duration !== undefined) {
			toastOptions.duration = options.duration === 0 ? Infinity : options.duration;
		}
		
		if (options?.action) {
			toastOptions.action = {
				label: options.action.label,
				onClick: options.action.handler
			};
		}
		
		return sonnerToast.info(title, { description, ...toastOptions });
	}

	// Generic addToast method for compatibility
	function addToast(options: ToastOptions): string | number {
		const { type = 'info', title, message, ...restOptions } = options;
		
		switch (type) {
			case 'success':
				return success(title, message, restOptions);
			case 'error':
				return error(title, message, restOptions);
			case 'warning':
				return warning(title, message, restOptions);
			case 'info':
			default:
				return info(title, message, restOptions);
		}
	}

	// Compatibility methods
	function removeToast(id: string | number) {
		sonnerToast.dismiss(id);
	}

	function clearAll() {
		sonnerToast.dismiss();
	}

	// Handle form errors (from validation or server errors)
	function handleFormError(errorData: any, fallbackMessage: string = 'An error occurred') {
		if (errorData?.errors && typeof errorData.errors === 'object') {
			// Handle validation errors - show first error
			const firstError = Object.values(errorData.errors)[0] as string;
			return error('Validation Error', firstError);
		} else if (errorData?.message) {
			// Handle general error with message
			return error('Error', errorData.message);
		} else if (typeof errorData === 'string') {
			// Handle string error
			return error('Error', errorData);
		} else {
			// Fallback error
			return error('Error', fallbackMessage);
		}
	}

	// Handle success responses
	function handleSuccess(message: string, details?: string) {
		return success(message, details);
	}

	// Handle API responses
	function handleApiResponse(response: any, successMessage?: string) {
		if (response?.error) {
			return handleFormError(response.error);
		} else if (successMessage) {
			return success(successMessage);
		}
	}

	// Compatibility method for updateToast (sonner handles this internally)
	function updateToast(id: string | number, updates: any) {
		// Sonner doesn't support updating existing toasts, so we'll dismiss and create new
		sonnerToast.dismiss(id);
		if (updates.type && updates.title) {
			return addToast({
				type: updates.type,
				title: updates.title,
				message: updates.message,
				duration: updates.duration,
				action: updates.action
			});
		}
	}

	// Subscribe method for store compatibility (not used with sonner)
	function subscribe() {
		// Sonner doesn't expose a store, so this is mainly for compatibility
		return () => {}; // Return unsubscribe function
	}

	return {
		subscribe,
		addToast,
		removeToast,
		clearAll,
		updateToast,
		success,
		error,
		warning,
		info,
		handleFormError,
		handleSuccess,
		handleApiResponse
	};
}

export const toast = createToastStore();

// Toast notification helper functions for common use cases
export const toastHelpers = {
	// Authentication messages
	loginSuccess: () => toast.success('Welcome back!', 'You have been successfully logged in.'),
	loginError: () => toast.error('Login Failed', 'Please check your email and password.'),
	invalidCredentials: () => toast.error('Invalid Credentials', 'The email or password you entered is incorrect. Please check your credentials and try again.'),
	emailNotConfirmed: () => toast.warning('Email Not Verified', 'Please check your email and click the verification link before signing in.'),
	tooManyAttempts: () => toast.warning('Too Many Attempts', 'Too many login attempts. Please wait a moment before trying again.'),
	logoutSuccess: () => toast.success('Logged Out', 'You have been successfully logged out.'),
	registerSuccess: () => toast.success('Account Created', 'Please check your email to verify your account.'),
	emailVerified: () => toast.success('Email Verified', 'Your email has been successfully verified.'),
	passwordReset: () => toast.success('Password Reset', 'Check your email for password reset instructions.'),
	passwordChanged: () => toast.success('Password Changed', 'Your password has been successfully updated.'),

	// CRUD operations
	created: (resource: string) => toast.success('Created', `${resource} has been successfully created.`),
	updated: (resource: string) => toast.success('Updated', `${resource} has been successfully updated.`),
	deleted: (resource: string) => toast.success('Deleted', `${resource} has been successfully deleted.`),
	saved: (resource: string) => toast.success('Saved', `${resource} has been successfully saved.`),

	// File operations
	fileUploaded: (filename?: string) => toast.success('File Uploaded', filename ? `${filename} has been uploaded successfully.` : 'File has been uploaded successfully.'),
	fileDeleted: (filename?: string) => toast.success('File Deleted', filename ? `${filename} has been deleted.` : 'File has been deleted.'),
	fileUploadError: (error?: string) => toast.error('Upload Failed', error || 'Failed to upload file. Please try again.'),

	// Validation errors
	validationError: (message?: string) => toast.error('Validation Error', message || 'Please check your input and try again.'),
	requiredFields: () => toast.error('Required Fields', 'Please fill in all required fields.'),

	// Network errors
	networkError: () => toast.error('Network Error', 'Please check your internet connection and try again.'),
	serverError: () => toast.error('Server Error', 'Something went wrong on our end. Please try again later.'),

	// Permission errors
	accessDenied: () => toast.error('Access Denied', 'You do not have permission to perform this action.'),
	sessionExpired: () => toast.warning('Session Expired', 'Please log in again to continue.'),

	// Loading states
	loading: (message: string) => toast.info('Loading', message, { duration: 0 }),
	loadingComplete: (id: string | number) => toast.removeToast(id),

	// Wedding planning specific messages
	weddingCreated: () => toast.success('Wedding Created', 'Your wedding planning journey has begun!'),
	weddingUpdated: () => toast.success('Wedding Updated', 'Your wedding details have been saved.'),
	documentUploaded: () => toast.success('Document Uploaded', 'Your document has been uploaded and saved.'),
	budgetUpdated: () => toast.success('Budget Updated', 'Your budget has been updated successfully.'),
	taskCompleted: () => toast.success('Task Completed', 'Great job! Task has been marked as complete.'),
	vendorAdded: () => toast.success('Vendor Added', 'Vendor has been added to your list.'),
	invitationSent: () => toast.success('Invitation Sent', 'Your invitation has been sent successfully.'),
	rsvpReceived: () => toast.success('RSVP Received', 'Guest response has been recorded.'),

	// Confirmation messages
	confirmDelete: (resource: string, onConfirm: () => void) => {
		return toast.warning(
			'Confirm Delete',
			`Are you sure you want to delete this ${resource}? This action cannot be undone.`,
			{
				duration: 0,
				action: {
					label: 'Delete',
					handler: onConfirm
				}
			}
		);
	}
};

// Export types for use in components
export type ToastStore = ReturnType<typeof createToastStore>;
export type ToastHelpers = typeof toastHelpers;

// Re-export svelte-sonner types and components for direct access if needed
export { toast as sonnerToast, Toaster } from 'svelte-sonner';