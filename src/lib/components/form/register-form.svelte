<script lang="ts">
	import type { ZxcvbnResult } from "@zxcvbn-ts/core";
	import { superForm } from "sveltekit-superforms";
	import { valibot } from "sveltekit-superforms/adapters";

	import { Button } from "$lib/components/ui/button/index";
	import * as Form from "$lib/components/ui/form/index";
	import { Input } from "$lib/components/ui/input/index";
	import * as Password from "$lib/components/ui/password/index";

	import { validateRegisterSchema } from "$lib/validation/auth";

	import { createAuthFormHandler } from "$lib/hooks/use-auth-form.svelte";

	let { data } = $props();

	const form = superForm(data.registrationForm, {
		validators: valibot(validateRegisterSchema),
		...createAuthFormHandler({
			successMessage: "Welcome back! Redirecting to your dashboard...",
		}),
	});

	const { form: formData, enhance } = form;

	let strength = $state<ZxcvbnResult>();
</script>

<div class="flex flex-col gap-8">
	<div class="flex flex-col items-center gap-2 text-center">
		<h1 class="text-2xl font-bold">Let’s begin your story ✨</h1>
		<p class="text-muted-foreground text-balance text-sm">
			Create your account and start planning your wedding with ease and joy.
		</p>
	</div>
	<form method="POST" class="flex flex-col gap-2" use:enhance>
		<div class="grid sm:grid-cols-2 gap-2">
			<Form.Field {form} name="firstName">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>First Name</Form.Label>
						<Input
							{...props}
							type="text"
							placeholder="Enter your first name"
							bind:value={$formData.firstName}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors class="text-xs text-red-500"/>
			</Form.Field>
			<Form.Field {form} name="lastName">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Last Name</Form.Label>
						<Input
							{...props}
							type="text"
							placeholder="Enter your last name"
							bind:value={$formData.lastName}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors class="text-xs text-red-500"/>
			</Form.Field>
		</div>
		<Form.Field {form} name="email">
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
			<Form.FieldErrors class="text-xs text-red-500"/>
		</Form.Field>
		<Form.Field {form} name="password">
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
						<Password.Strength bind:strength class="border-1 h-2" />
					</Password.Root>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500"/>
		</Form.Field>
		<Form.Field {form} name="confirmPassword">
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
			<Form.FieldErrors class="text-xs text-red-500"/>
		</Form.Field>
		<Button type="submit" variant="outline" class="w-full cursor-pointer">
			Create an account
		</Button>
	</form>
	<div class="text-center text-sm">
		Already have an account?
		<a href="/login" class="underline"> Login </a>
	</div>
</div>
