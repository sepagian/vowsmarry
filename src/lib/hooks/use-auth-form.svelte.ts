import { toast } from 'svelte-sonner';
import { authToasts, handleAuthError, handleFormValidationError } from '$lib/utils/auth-toasts';
import type { ActionResult } from '@sveltejs/kit';

export function createAuthFormHandler(options: {
	successMessage?: string;
	successDuration?: number;
	onSuccess?: () => void;
}) {
	return {
		onResult: ({ result }: { result: ActionResult }) => {
			if (result.type === 'success') {
				toast.success(options.successMessage || 'Success!', {
					duration: options.successDuration || 2000,
				});
				options.onSuccess?.();
			} else if (result.type === 'failure') {
				const error = result.data?.error;
				const errorType = result.data?.errorType;

				if (error) {
					handleSpecificError(error, errorType);
				} else {
					handleFormValidationError();
				}
			}
		},
		onError: () => {
			authToasts.error.unexpectedError();
		},
	};
}

function handleSpecificError(error: string, errorType?: string) {
	// Centralized error type mapping
	const errorMap: Record<string, () => void> = {
		invalid_credentials: authToasts.error.invalidCredentials,
		email_not_confirmed: authToasts.error.emailNotConfirmed,
		rate_limit: authToasts.error.tooManyRequests,
	};

	if (errorType && errorMap[errorType]) {
		errorMap[errorType]();
		return;
	}

	// Pattern matching for error messages
	if (error.includes('already registered') || error.includes('already exists')) {
		authToasts.error.emailAlreadyExists();
	} else if (error.includes('password') && (error.includes('weak') || error.includes('strength'))) {
		authToasts.error.weakPassword();
	} else if (error.includes('email') && error.includes('invalid')) {
		authToasts.error.invalidEmail();
	} else {
		handleAuthError({ message: error });
	}
}
