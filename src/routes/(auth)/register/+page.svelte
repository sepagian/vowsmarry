<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';

	let { form } = $props();
</script>

<div class=" flex items-center justify-center p-4">
	<Card class="bg-base-100">
		<CardHeader>
			<CardTitle>Create Account</CardTitle>
			<CardDescription>Sign up to start planning your perfect wedding</CardDescription>
		</CardHeader>
		<CardContent>
			<form method="POST" use:enhance>
				<div class="space-y-4">
					<div class="grid grid-cols-2 gap-4">
						<div class="space-y-2">
							<Label for="firstName">First Name</Label>
							<Input
								id="firstName"
								name="firstName"
								type="text"
								placeholder="John"
								required
								value={form?.firstName ?? ''}
							/>
						</div>
						<div class="space-y-2">
							<Label for="lastName">Last Name</Label>
							<Input
								id="lastName"
								name="lastName"
								type="text"
								placeholder="Doe"
								required
								value={form?.lastName ?? ''}
							/>
						</div>
					</div>
					<div class="space-y-2">
						<Label for="email">Email</Label>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="john@example.com"
							required
							value={form?.email ?? ''}
						/>
					</div>
					<div class="space-y-2">
						<Label for="password">Password</Label>
						<Input
							id="password"
							name="password"
							type="password"
							placeholder="Create a strong password"
							required
						/>
					</div>
					<div class="space-y-2">
						<Label for="confirmPassword">Confirm Password</Label>
						<Input
							id="confirmPassword"
							name="confirmPassword"
							type="password"
							placeholder="Confirm your password"
							required
						/>
					</div>
					{#if form?.error}
						<div class="text-sm text-red-600 bg-red-50 p-3 rounded-md">
							{form.error}
						</div>
					{/if}
					{#if form?.success}
						<div class="text-sm text-green-600 bg-green-50 p-3 rounded-md">
							{form.success}
						</div>
					{/if}
					<Button type="submit" class="w-full text-primary-content">Create Account</Button>
				</div>
			</form>
			<div class="mt-4 text-center text-sm">
				Already have an account?
				<a href="/login" class="text-blue-600 hover:underline">Sign in</a>
			</div>
		</CardContent>
	</Card>
</div>
