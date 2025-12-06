<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { UserData } from '$lib/validation/planner';
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { Separator } from '$lib/components/ui/separator/index';
	import { Input } from '$lib/components/ui/input/';
	import * as Form from '$lib/components/ui/form/index';
	import { userRole, userSchema } from '$lib/validation/planner';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';

	interface Props {
		profileForm: SuperValidated<UserData>;
		user: {
			id: string;
			name: string;
			email: string;
			emailVerified: boolean;
			image: string | null;
			phone?: string | null;
		};
	}

	let { profileForm, user }: Props = $props();

	const form = superForm(profileForm, {
		validators: valibot(userSchema),
		onResult: async ({ result }) => {
			if (result.type === 'success' && result.data?.success) {
				toast.success(result.data.message || 'Profile updated successfully');
				await invalidateAll();
			} else if (result.type === 'failure') {
				toast.error(result.data?.message || 'Failed to update profile');
			}
		},
		onError: () => {
			toast.error('An error occurred while updating profile');
		},
	});

	const { form: formData, errors, enhance } = form;
</script>

<form
	method="POST"
	action="?/updateProfile"
	use:enhance
	class="flex flex-col gap-4"
>
	<div class="flex flex-col">
		<h1 class="font-extrabold text-xl">Profile</h1>
		<span class="text-muted-foreground text-sm"
			>Update your name, photo, and basic information so everything stays familiar across your
			workspace.</span
		>
	</div>

	<div class="grid gap-6">
		<Form.Field
			{form}
			name="userName"
		>
			<Form.Control>
				{#snippet children({ props })}
					<div class="flex flex-col sm:flex-row gap-2 align-center">
						<div class="flex flex-col flex-1 gap-1">
							<Form.Label>Full name</Form.Label>
							<Form.Description>This appears across your workspace.</Form.Description>
						</div>
						<div class="flex-1">
							<Input
								{...props}
								type="text"
								bind:value={$formData.userName}
								placeholder="John Doe"
							/>
						</div>
					</div>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500" />
		</Form.Field>

		<Form.Field
			{form}
			name="userEmail"
		>
			<Form.Control>
				{#snippet children({ props })}
					<div class="flex flex-col sm:flex-row gap-2 align-center">
						<div class="flex flex-col flex-1 gap-1">
							<Form.Label>Email address</Form.Label>
							<Form.Description>Your primary contact for updates and sign-in.</Form.Description>
						</div>
						<div class="flex-1">
							<Input
								{...props}
								type="email"
								bind:value={$formData.userEmail}
								placeholder="johndoe@email.com"
							/>
						</div>
					</div>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500" />
		</Form.Field>

		{#if user.emailVerified}
			<div class="flex items-center gap-2 text-sm text-green-600">
				<span class="i-lucide:check-circle"></span>
				<span>Email verified</span>
			</div>
		{:else}
			<div class="flex items-center gap-2 text-sm text-amber-600">
				<span class="i-lucide:alert-circle"></span>
				<span>Email not verified</span>
			</div>
		{/if}
	</div>

	<Separator />
</form>
