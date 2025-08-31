<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import * as Card from '$lib/components/ui/card/index';
	import { Input } from '$lib/components/ui/input/index';
	import { Label } from '$lib/components/ui/label/index';
	const id = $props.id();
</script>

<Card.Root class="mx-auto w-full max-w-sm bg-base-100">
	<Card.Header>
		<Card.Title class="text-2xl">Forgot password</Card.Title>
		<Card.Description>Enter your registered email</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="grid gap-4">
			<div class="grid gap-2">
				<Label for="email-{id}">Email</Label>
				<Input id="email-{id}" type="email" placeholder="m@example.com" required />
			</div>
			<Button type="submit" class="w-full">Reset password</Button>
		</div>

		<div class="mt-4 text-center text-sm">
			<a href="/login" class="underline"> Sign in </a>
		</div>
	</Card.Content>
</Card.Root>
