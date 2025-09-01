<script lang="ts">
	import { enhance } from '$app/forms';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { FormInput } from '$lib/components/forms';
	import { Button } from '$lib/components/ui/button';
	import { LoaderCircle } from 'lucide-svelte';
	import { toast } from '$lib/stores/toast';
	import 'uno.css';

	let { form } = $props();
	let isSubmitting = $state(false);

	// Show error toast if there's a form error
	$effect(() => {
		if (form?.error) {
			// Handle different types of authentication errors with specific messages
			if (form.error.includes('invalid_password') || form.error.includes('Invalid password')) {
				toast.error('Invalid Password', 'The password you entered is incorrect. Please check your password and try again.');
			} else if (form.error.includes('invalid_email') || form.error.includes('Invalid email')) {
				toast.error('Invalid Email', 'The email address you entered was not found. Please check your email and try again.');
			} else if (form.error.includes('user_not_found') || form.error.includes('User not found')) {
				toast.error('Account Not Found', 'No account found with this email address. Please check your email or sign up for a new account.');
			} else if (form.error.includes('invalid_credentials') || form.error.includes('Invalid credentials')) {
				toast.error('Invalid Credentials', 'The email or password you entered is incorrect. Please check your credentials and try again.');
			} else if (form.error.includes('email_not_confirmed') || form.error.includes('Email not verified')) {
				toast.warning('Email Not Verified', 'Please check your email and click the verification link before signing in.');
			} else if (form.error.includes('rate_limit') || form.error.includes('Too many attempts')) {
				toast.warning('Too Many Attempts', 'Too many login attempts. Please wait a moment before trying again.');
			} else {
				// Fallback to generic error handling
				toast.handleFormError(form.error);
			}
		}
	});
</script>

<div class="min-h-screen flex items-center justify-center bg-base-200 p-4">
	<Card class="w-full max-w-md bg-base-100">
		<CardHeader>
			<CardTitle>Sign In</CardTitle>
			<CardDescription>Enter your credentials to access your wedding dashboard</CardDescription>
		</CardHeader>
		<CardContent>
			<form
				method="POST"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						await update();
						isSubmitting = false;
					};
				}}
				class="space-y-4"
			>
				<FormInput
					label="Email"
					name="email"
					type="email"
					placeholder="Enter your email"
					value={form?.email ?? ''}
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
				<a href="/forgot-password" class="ml-auto inline-block text-sm underline">
					Forgot your password?
				</a>

				<Button
					type="submit"
					class="w-full bg-primary text-primary-content"
					disabled={isSubmitting}
				>
					{#if isSubmitting}
						<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
						Signing in...
					{:else}
						Sign In
					{/if}
				</Button>

				<div class="text-center text-sm text-gray-600">
					Don't have an account?
					<a href="/register" class="text-blue-600 hover:underline">Sign up</a>
				</div>
			</form>
		</CardContent>
	</Card>
</div>
