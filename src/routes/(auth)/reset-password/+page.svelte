<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import * as Card from '$lib/components/ui/card/index';
	import { Input } from '$lib/components/ui/input/index';
	import { Label } from '$lib/components/ui/label/index';
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
				<div class="grid gap-2">
					<Label for="password-{id}">Password</Label>
					<Input id="password-{id}" type="password" required />
				</div>
				<div class="grid gap-2">
					<Label for="confirm-password-{id}">Confirm Password</Label>
					<Input id="confirm-password-{id}" type="password" required />
				</div>
			</div>
			<Button type="submit" class="w-full">Reset Password</Button>
		</div>
		<div class="mt-4 text-center text-sm">
			<a href="/login" class="underline">Login </a>
		</div>
	</Card.Content>
</Card.Root>
