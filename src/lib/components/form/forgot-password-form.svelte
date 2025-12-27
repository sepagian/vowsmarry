<script lang="ts">
	import { superForm } from "sveltekit-superforms";
	import { valibot } from "sveltekit-superforms/adapters";

	import { Button } from "$lib/components/ui/button/index";
	import { FormControl, FormField, FormFieldErrors, FormLabel } from "$lib/components/ui/form/index";
	import { Input } from "$lib/components/ui/input/index";

	import { forgotPasswordSchema } from "$lib/validation/auth";

	import { createAuthFormHandler } from "$lib/hooks/use-auth-form.svelte";

	let { data } = $props();

	const form = superForm(data.forgotPasswordForm, {
		validators: valibot(forgotPasswordSchema),
		...createAuthFormHandler({
			successMessage: "Welcome back! Redirecting to your dashboard...",
		}),
	});

	const { form: formData, enhance } = form;
</script>

<div class="flex flex-col gap-8">
	<div class="flex flex-col items-center gap-2 text-center">
		<h1 class="text-2xl font-bold">
			Forgot your password? Don't worry, it happens
		</h1>
		<p class="text-muted-foreground text-balance text-sm">
			Sit back, we'll send you a link to reset it in just a moment.
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
		<Button type="submit" variant="outline" class="w-full cursor-pointer">
			Reset password
		</Button>
	</form>
</div>
