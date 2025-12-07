<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { InferInput } from 'valibot';
	import { validateChangePasswordSchema } from '$lib/validation/auth';
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { Separator } from '$lib/components/ui/separator/index';
	import * as Form from '$lib/components/ui/form/index';
	import * as Password from '$lib/components/ui/password/index';
	import type { ZxcvbnResult } from '@zxcvbn-ts/core';
	import { invalidateAll } from '$app/navigation';
	import { auth } from '$lib/utils/toasts';

	type PasswordData = InferInput<typeof validateChangePasswordSchema>;

	interface Props {
		passwordForm: SuperValidated<PasswordData>;
	}

	let { passwordForm }: Props = $props();

	const form = superForm(passwordForm, {
		validators: valibot(validateChangePasswordSchema),
		resetForm: true,
		onResult: async ({ result }) => {
			if (result.type === 'success' && result.data?.success) {
				auth.success.passwordChangeSuccess();
				await invalidateAll();
			} else if (result.type === 'failure') {
				const errorType = result.data?.errorType;
				if (errorType === 'incorrect_password') {
					auth.error.incorrectPassword();
				} else if (errorType === 'password_mismatch') {
					auth.error.passwordMismatch();
				} else if (errorType === 'weak_password') {
					auth.error.weakPassword();
				} else {
					auth.error.passwordUpdateFailed();
				}
			}
		},
		onError: () => {
			auth.error.unexpectedError();
		},
	});

	const { form: formData, errors, enhance } = form;

	let strength = $state<ZxcvbnResult>();
</script>

<form
	method="POST"
	action="?/changePassword"
	use:enhance
	class="flex flex-col gap-4"
>
	<div class="flex flex-col">
		<h1 class="font-extrabold text-xl">Password</h1>
		<span class="text-muted-foreground text-sm"
			>Create a stronger password or refresh an old one. It only takes a moment.</span
		>
	</div>

	<div class="grid gap-4">
		<Form.Field
			{form}
			name="oldPassword"
		>
			<Form.Control>
				{#snippet children({ props })}
					<div class="flex flex-col sm:flex-row gap-2 align-center">
						<div class="flex flex-col flex-1 gap-1">
							<Form.Label>Current password</Form.Label>
							<Form.Description>We ask for this to confirm it's really you.</Form.Description>
						</div>
						<div class="flex-1">
							<Password.Root>
								<Password.Input
									{...props}
									bind:value={$formData.oldPassword}
									placeholder="Enter your current password"
								>
									<Password.ToggleVisibility />
								</Password.Input>
							</Password.Root>
						</div>
					</div>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500" />
		</Form.Field>

		<Form.Field
			{form}
			name="newPassword"
		>
			<Form.Control>
				{#snippet children({ props })}
					<div class="flex flex-col sm:flex-row gap-2 align-center">
						<div class="flex flex-col flex-1 gap-1">
							<Form.Label>New password</Form.Label>
							<Form.Description>Make it unique and hard to guess.</Form.Description>
						</div>
						<div class="flex-1">
							<Password.Root>
								<Password.Input
									{...props}
									bind:value={$formData.newPassword}
									placeholder="Enter your new password"
								>
									<Password.ToggleVisibility />
								</Password.Input>
								<Password.Strength
									bind:strength
									class="border-1 h-2"
								/>
							</Password.Root>
						</div>
					</div>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500" />
		</Form.Field>

		<Form.Field
			{form}
			name="confirmNewPassword"
		>
			<Form.Control>
				{#snippet children({ props })}
					<div class="flex flex-col sm:flex-row gap-2 align-center">
						<div class="flex flex-col flex-1 gap-1">
							<Form.Label>Confirm new password</Form.Label>
							<Form.Description>Type it again so we know it's correct.</Form.Description>
						</div>
						<div class="flex-1">
							<Password.Root>
								<Password.Input
									{...props}
									bind:value={$formData.confirmNewPassword}
									placeholder="Confirm your new password"
								>
									<Password.ToggleVisibility />
								</Password.Input>
							</Password.Root>
						</div>
					</div>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500" />
		</Form.Field>
	</div>

	<Separator />
</form>
