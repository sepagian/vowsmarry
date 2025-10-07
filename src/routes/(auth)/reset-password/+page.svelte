<script lang="ts">
	import * as Form from '$lib/components/ui/form/index';
	import * as Password from '$lib/components/ui/password/index';
	import { Button } from '$lib/components/ui/button/index';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { passwordResetSchema } from '$lib/validation/auth';
	import type { ZxcvbnResult } from '@zxcvbn-ts/core';

	let { data } = $props();
	let strength = $state<ZxcvbnResult>();

	const form = superForm(data.resetPasswordForm, {
		validators: zodClient(passwordResetSchema as any),
		onUpdate: ({ form: f }) => {
			if (f.valid) {
				// Check if there's a success message from server
				if (f.message) {
					toast.success(f.message);
				} else {
					toast.success('Your password has been updated successfully');
				}
			} else {
				toast.error('Please fix the errors in the form.');
			}
		},
		onError: ({ result }) => {
			// Handle server validation errors
			if (result.type === 'error') {
				toast.error('An error occurred when updating your password. Please try again');
			}
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
</div>
