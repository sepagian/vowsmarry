<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import * as Card from '$lib/components/ui/card/index';
	import { FormPasswordInput } from '$lib/components/forms';
	const id = $props.id();
</script>

<Card.Root class="mx-auto w-full max-w-sm bg-base-100">
	<Card.Header>
		<Card.Title class="text-2xl">Reset Password</Card.Title>
		<Card.Description>Enter your new password</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="grid gap-4">
			<div class="grid gap-2">
				<FormPasswordInput
					label="Password"
					name="password"
					placeholder="Enter your new password"
					required
				/>
				<FormPasswordInput
					label="Confirm Password"
					name="confirmPassword"
					placeholder="Confirm your new password"
					required
				/>
			</div>
			<Button type="submit" class="w-full">Reset Password</Button>
		</div>
		<div class="mt-4 text-center text-sm">
			<a href="/login" class="underline">Login </a>
		</div>
	</Card.Content>
</Card.Root>
