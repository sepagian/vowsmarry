<script lang="ts">
	import { enhance } from '$app/forms';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { FormInput } from '$lib/components/forms';
	import { Button } from '$lib/components/ui/button';
	import { LoaderCircle } from 'lucide-svelte';
	import { toast } from '$lib/stores/toast';

	let { form } = $props();
	let isSubmitting = $state(false);

	// Show error toast if there's a form error
	$effect(() => {
		if (form?.error) {
			toast.handleFormError(form.error);
		}
	});
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50">
	<Card class="w-full max-w-md">
		<CardHeader>
			<CardTitle>Sign In</CardTitle>
			<CardDescription>Enter your credentials to access your wedding dashboard</CardDescription>
		</CardHeader>
		<CardContent>
			<form method="POST" use:enhance={() => {
				isSubmitting = true;
				return async ({ result, update }) => {
					if (result.type === 'redirect') {
						// Handle successful login redirect
						window.location.href = result.location;
					} else {
						await update();
					}
					isSubmitting = false;
				};
			}} class="space-y-4">
				<FormInput
					label="Email"
					name="email"
					type="email"
					placeholder="Enter your email"
					value=""
					required
					disabled={isSubmitting}
					autocomplete="email"
				/>

				<FormInput
					label="Password"
					name="password"
					type="password"
					placeholder="Enter your password"
					value=""
					required
					disabled={isSubmitting}
					autocomplete="current-password"
				/>

				<Button type="submit" class="w-full" disabled={isSubmitting}>
					{#if isSubmitting}
						<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
					{/if}
					Sign In
				</Button>
			</form>
			
			<div class="mt-4 text-center text-sm">
				Don't have an account?
				<a href="/register" class="text-blue-600 hover:underline">Sign up</a>
			</div>
		</CardContent>
	</Card>
</div>