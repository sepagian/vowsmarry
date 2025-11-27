import { onMount } from 'svelte';
import { toast } from 'svelte-sonner';
import { authToasts } from '$lib/utils/auth-toasts';
import { SvelteURLSearchParams } from 'svelte/reactivity';

export function useUrlMessages(data: { message?: string; error?: string }) {
	onMount(() => {
		const params = new SvelteURLSearchParams(window.location.search);
		
		if (data.message) {
			handleSuccessMessage(data.message, params.get('messageType'));
		}
		
		if (data.error) {
			handleErrorMessage(data.error, params.get('errorType'));
		}
	});
}

function handleSuccessMessage(message: string, type: string | null) {
	const handlers: Record<string, () => void> = {
		logout_success: authToasts.success.logout,
		registration_success: authToasts.success.register,
		email_verification_success: authToasts.success.emailVerification,
		signup_verification_success: authToasts.success.emailVerification,
		password_reset_success: authToasts.success.passwordResetSuccess,
		password_reset_verification_success: () => toast.info(message),
	};
	
	const handler = type ? handlers[type] : null;
	if (handler) {
		handler();
	} else {
		toast.success(message);
	}
}

function handleErrorMessage(error: string, type: string | null) {
	if (type === 'server_error') {
		authToasts.error.serverError();
	} else {
		toast.error(error);
	}
}
