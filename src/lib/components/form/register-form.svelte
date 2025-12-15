<script lang="ts">
	import type { ZxcvbnResult } from "@zxcvbn-ts/core";
	import { superForm } from "sveltekit-superforms";
	import { valibot } from "sveltekit-superforms/adapters";

	import { Button } from "$lib/components/ui/button/index";
	import { FormControl, FormField, FormFieldErrors, FormLabel } from "$lib/components/ui/form/index";
	import { Input } from "$lib/components/ui/input/index";
	import { Input as PasswordInput, Root as PasswordRoot, Strength as PasswordStrength, ToggleVisibility } from "$lib/components/ui/password/index";

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
		<h1 class="text-2xl font-bold">Let's begin your story ✨</h1>
		<p class="text-muted-foreground text-balance text-sm">
			Create your account and start planning your wedding with ease and joy.
		</p>
	</div>
	<form method="POST" class="flex flex-col gap-2" use:enhance>
		<div class="grid sm:grid-cols-2 gap-2">
			<FormField {form} name="firstName">
				<FormControl>
					{#snippet children({ props })}
						<FormLabel>First Name</FormLabel>
						<Input
							{...props}
							type="text"
							placeholder="Enter your first name"
							bind:value={$formData.firstName}
						/>
					{/snippet}
				</FormControl>
				<FormFieldErrors class="text-xs text-red-500"/>
			</FormField>
			<FormField {form} name="lastName">
				<FormControl>
					{#snippet children({ props })}
						<FormLabel>Last Name</FormLabel>
						<Input
							{...props}
							type="text"
							placeholder="Enter your last name"
							bind:value={$formData.lastName}
						/>
					{/snippet}
				</FormControl>
				<FormFieldErrors class="text-xs text-red-500"/>
			</FormField>
		</div>
		<FormField {form} name="email">
			<FormControl>
				{#snippet children({ props })}
					<FormLabel>Email</FormLabel>
					<Input
						{...props}
						type="email"
						placeholder="Enter your email address"
						bind:value={$formData.email}
					/>
				{/snippet}
			</FormControl>
			<FormFieldErrors class="text-xs text-red-500"/>
		</FormField>
		<FormField {form} name="password">
			<FormControl>
				{#snippet children({ props })}
					<FormLabel>Password</FormLabel>
					<PasswordRoot>
						<PasswordInput
							{...props}
							bind:value={$formData.password}
							placeholder="Enter your password"
						>
							<ToggleVisibility />
						</PasswordInput>
						<PasswordStrength bind:strength class="border-1 h-2" />
					</PasswordRoot>
				{/snippet}
			</FormControl>
			<FormFieldErrors class="text-xs text-red-500"/>
		</FormField>
		<FormField {form} name="confirmPassword">
			<FormControl>
				{#snippet children({ props })}
					<FormLabel>Confirm Password</FormLabel>
					<PasswordRoot>
						<PasswordInput
							{...props}
							bind:value={$formData.confirmPassword}
							placeholder="Re-enter your password"
						>
							<ToggleVisibility />
						</PasswordInput>
					</PasswordRoot>
				{/snippet}
			</FormControl>
			<FormFieldErrors class="text-xs text-red-500"/>
		</FormField>
		<Button type="submit" variant="outline" class="w-full cursor-pointer">
			Create an account
		</Button>
	</form>
	<div class="text-center text-sm">
		Already have an account?
		<a href="/login" class="underline"> Login </a>
	</div>
</div>
