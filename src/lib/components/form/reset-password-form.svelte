<script lang="ts">
	import * as Form from '$lib/components/ui/form/index';
	import * as Password from '$lib/components/ui/password/index';
	import { Button } from '$lib/components/ui/button/index';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { resetPasswordSchema } from '$lib/validation/auth';
	import {
		authToasts,
		handleSupabaseAuthError,
		handleFormValidationError,
	} from '$lib/utils/auth-toasts';
	import type { ZxcvbnResult } from '@zxcvbn-ts/core';

	let { data } = $props();
	let strength = $state<ZxcvbnResult>();

	// Track loading state for toast management
	let isSubmitting = false;
	let loadingToastId: string | number | undefined;

	const form = superForm(data.resetPasswordForm, {
		validators: valibot(resetPasswordSchema),
		onSubmit: () => {
			// Show loading toast and track its ID
			isSubmitting = true;
			loadingToastId = toast.loading('Updating your password...');
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
				toast.success('Password updated successfully! You can now log in with your new password.', {
					duration: 4000,
				});
			} else if (result.type === 'failure') {
				// Handle server validation errors with specific error messages
				const error = result.data?.message || result.data?.error;

				if (error) {
					// Use specific error handling for password reset errors
					if (error.includes('token') || error.includes('expired') || error.includes('invalid')) {
						authToasts.error.invalidResetToken();
					} else if (error.includes('too many')) {
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
		<h1 class="text-2xl font-bold">Let’s set you up with a fresh start</h1>
		<p class="text-muted-foreground text-balance text-sm">
			Enter your new password below — and keep it somewhere safe this time 😉
		</p>
	</div>
	<form
		method="POST"
		class="flex flex-col gap-2"
		use:enhance
	>
		<!-- Hidden token field -->
		<input
			type="hidden"
			name="token"
			bind:value={$formData.token}
		/>

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
						<Password.Strength
							bind:strength
							class="border-1 h-2"
						/>
					</Password.Root>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500" />
		</Form.Field>
		<Form.Field
			{form}
			name="confirmPassword"
		>
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Confirm Password</Form.Label>
					<Password.Root>
						<Password.Input
							{...props}
							bind:value={$formData.confirmPassword}
							placeholder="Re-enter your password"
						>
							<Password.ToggleVisibility />
						</Password.Input>
					</Password.Root>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500" />
		</Form.Field>
		<Button
			type="submit"
			variant="outline"
			class="w-full cursor-pointer">Update password</Button
		>
	</form>

	<div class="text-center">
		<a
			href="/login"
			class="text-sm text-muted-foreground hover:text-primary underline"
		>
			Back to Login
		</a>
	</div>
</div>
