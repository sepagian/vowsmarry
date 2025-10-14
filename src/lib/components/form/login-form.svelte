<script lang="ts">
	import * as Password from '$lib/components/ui/password/index';
	import * as Form from '$lib/components/ui/form/index';
	import { Input } from '$lib/components/ui/input/index';
	import { Button } from '$lib/components/ui/button/index';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { loginSchema } from '$lib/validation/auth';
	import { authToasts, handleSupabaseAuthError, handleFormValidationError } from '$lib/utils/auth-toasts';
	import { onMount } from 'svelte';

	let { data } = $props();

	// Show success or error message from URL parameters if present
	onMount(() => {
		if (data.message) {
			// Handle different message types with appropriate toast styling
			const messageType = new URLSearchParams(window.location.search).get('messageType');
			
			switch (messageType) {
				case 'logout_success':
					authToasts.success.logout();
					break;
				case 'registration_success':
					authToasts.success.register();
					break;
				case 'email_verification_success':
				case 'signup_verification_success':
					authToasts.success.emailVerification();
					break;
				case 'password_reset_success':
					authToasts.success.passwordResetSuccess();
					break;
				case 'password_reset_verification_success':
					toast.info(data.message);
					break;
				default:
					toast.success(data.message);
			}
		}
		if (data.error) {
			const errorType = new URLSearchParams(window.location.search).get('errorType');
			
			switch (errorType) {
				case 'server_error':
					authToasts.error.serverError();
					break;
				default:
					toast.error(data.error);
			}
		}
	});

	// Track loading state for toast management
	let isSubmitting = false;
	let loadingToastId: string | number | undefined;

	const form = superForm(data.loginForm, {
		validators: zodClient(loginSchema as any),
		onSubmit: () => {
			// Show loading toast and track its ID
			isSubmitting = true;
			loadingToastId = toast.loading('Signing you in...');
		},
		onResult: ({ result }) => {
			// Always dismiss the loading toast first
			if (loadingToastId) {
				toast.dismiss(loadingToastId);
				loadingToastId = undefined;
			}
			isSubmitting = false;

			if (result.type === 'success') {
				// Show success toast briefly before redirect
				toast.success('Welcome back! Redirecting to your dashboard...', {
					duration: 2000
				});
			} else if (result.type === 'failure') {
				// Handle server validation errors with specific error messages
				const error = result.data?.error;
				const errorType = result.data?.errorType;
				
				if (error) {
					// Use specific error handling based on error type
					if (errorType === 'invalid_credentials') {
						authToasts.error.invalidCredentials();
					} else if (errorType === 'email_not_confirmed') {
						authToasts.error.emailNotConfirmed();
					} else if (errorType === 'rate_limit') {
						authToasts.error.tooManyRequests();
					} else {
						// Handle other Supabase errors
						handleSupabaseAuthError({ message: error, status: result.status });
					}
				} else {
					handleFormValidationError();
				}
			}
		},
		onError: () => {
			// Always dismiss the loading toast first
			if (loadingToastId) {
				toast.dismiss(loadingToastId);
				loadingToastId = undefined;
			}
			isSubmitting = false;
			
			// Handle unexpected errors
			authToasts.error.unexpectedError();
		},
	});

	const { form: formData, enhance } = form;
</script>

<div class="flex flex-col gap-8">
	<div class="flex flex-col items-center gap-2 text-center">
		<h1 class="text-2xl font-bold">
			Welcome back! Let’s get you back to planning something beautiful
		</h1>
		<p class="text-muted-foreground text-balance text-sm">
			Log in to continue where you left off — your journey together awaits.
		</p>
	</div>
	<form
		method="POST"
		class="flex flex-col gap-2"
		use:enhance
	>
		<Form.Field
			{form}
			name="email"
		>
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Email</Form.Label>
					<Input
						{...props}
						type="email"
						placeholder="Enter your email address"
						bind:value={$formData.email}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500" />
		</Form.Field>
		<Form.Field
			{form}
			name="password"
		>
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Password</Form.Label>
					<Password.Root>
						<Password.Input
							{...props}
							bind:value={$formData.password}
							placeholder="Enter your password"
						>
							<Password.ToggleVisibility />
						</Password.Input>
					</Password.Root>
				{/snippet}
			</Form.Control>
			<div class="flex flex-1 justify-between">
				<Form.FieldErrors class="text-xs text-red-500" />
				<a
					href="/forgot-password"
					class="ml-auto text-xs hover:underline"
				>
					Forgot your password?
				</a>
			</div>
		</Form.Field>
		<Button
			type="submit"
			variant="outline"
			class="w-full cursor-pointer">Login</Button
		>
	</form>
	<div class="text-center text-sm">
		Don't have an account?
		<a
			href="/register"
			class="underline"
		>
			Sign up
		</a>
	</div>
</div>
