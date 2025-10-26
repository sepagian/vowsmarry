<script lang="ts">
	import * as Form from '$lib/components/ui/form/index';
	import { Input } from '$lib/components/ui/input/index';
	import { Button } from '$lib/components/ui/button/index';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { passwordResetRequestSchema } from '$lib/validation/auth';
	import {
		authToasts,
		handleSupabaseAuthError,
		handleFormValidationError,
		handleFormSuccess,
	} from '$lib/utils/auth-toasts';

	let { data } = $props();

	const form = superForm(data.forgotPasswordForm, {
		validators: zodClient(passwordResetRequestSchema as any),
		onResult: ({ result }) => {
			if (result.type === 'success') {
				// Success handled by redirect, but show toast for immediate feedback
				handleFormSuccess('passwordResetRequest');
			} else if (result.type === 'failure') {
				// Handle server validation errors with specific error messages
				const error = result.data?.error;
				const errorType = result.data?.errorType;

				if (error) {
					// Use specific error handling based on error type
					if (errorType === 'rate_limit') {
						authToasts.error.tooManyRequests();
					} else if (errorType === 'invalid_email') {
						authToasts.error.invalidEmail();
					} else {
						// Handle other Supabase errors
						handleSupabaseAuthError({ message: error, status: result.status });
					}
				} else {
					handleFormValidationError();
				}
			}
		},
		onError: ({ result }) => {
			// Handle unexpected errors
			authToasts.error.unexpectedError();
		},
	});

	const { form: formData, enhance } = form;
</script>

<div class="flex flex-col gap-8">
	<div class="flex flex-col items-center gap-2 text-center">
		<h1 class="text-2xl font-bold">Forgot your password? Don't worry, it happens</h1>
		<p class="text-muted-foreground text-balance text-sm">
			Sit back, we’ll send you a link to reset it in just a moment.
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
		<Button
			type="submit"
			variant="outline"
			class="w-full cursor-pointer">Reset password</Button
		>
	</form>
</div>
