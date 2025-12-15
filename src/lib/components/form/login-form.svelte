<script lang="ts">
	import { superForm } from "sveltekit-superforms";
	import { valibot } from "sveltekit-superforms/adapters";

	import { Button } from "$lib/components/ui/button/index";
	import { FormControl, FormField, FormFieldErrors, FormLabel } from "$lib/components/ui/form/index";
	import { Input } from "$lib/components/ui/input/index";
	import { Input as PasswordInput, Root as PasswordRoot, ToggleVisibility } from "$lib/components/ui/password/index";

	import { loginSchema } from "$lib/validation/auth";

	import { createAuthFormHandler, useUrlMessages } from "$lib/hooks/";

	let { data } = $props();

	useUrlMessages(data);

	const form = superForm(data.loginForm, {
		validators: valibot(loginSchema),
		...createAuthFormHandler({
			successMessage: "Welcome back! Redirecting to your dashboard...",
		}),
	});

	const { form: formData, enhance } = form;
</script>

<div class="flex flex-col gap-8">
	<div class="flex flex-col items-center gap-2 text-center">
		<h1 class="text-2xl font-bold">
			Welcome back! Let's get you back to planning something beautiful
		</h1>
		<p class="text-muted-foreground text-balance text-sm">
			Log in to continue where you left off — your journey together awaits.
		</p>
	</div>
	<form method="POST" class="flex flex-col gap-2" use:enhance>
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
					</PasswordRoot>
				{/snippet}
			</FormControl>
			<div class="flex flex-1 justify-between">
				<FormFieldErrors class="text-xs text-red-500"/>
				<a href="/forgot-password" class="ml-auto text-xs hover:underline">
					Forgot your password?
				</a>
			</div>
		</FormField>
		<Button type="submit" variant="outline" class="w-full cursor-pointer">
			Login
		</Button>
	</form>
	<div class="text-center text-sm">
		Don't have an account?
		<a href="/register" class="underline"> Sign up </a>
	</div>
</div>
