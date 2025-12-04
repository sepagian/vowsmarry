<script lang="ts">
	import { Separator } from '$lib/components/ui/separator/index';
	import { Button } from '$lib/components/ui/button/index';
	import * as Field from '$lib/components/ui/field';
	import * as Password from '$lib/components/ui/password/index';
	import type { ZxcvbnResult } from '@zxcvbn-ts/core';

	let strength = $state<ZxcvbnResult>();
</script>

<div class="flex flex-col">
	<h1 class="font-extrabold text-xl">Password</h1>
	<span class="text-muted-foreground text-sm"
		>Create a stronger password or refresh an old one. It only takes a moment.</span
	>
</div>
<Field.Set>
	<Field.Group class="grid gap-6">
		<Field.Field class="flex sm:flex-row gap-4 items-center">
			<div class="flex flex-col">
				<Field.Label for="current">Current password</Field.Label>
				<Field.Description>We ask for this to confirm it’s really you.</Field.Description>
			</div>
			<Password.Root>
				<Password.Input placeholder="Enter your current password">
					<Password.ToggleVisibility />
				</Password.Input>
			</Password.Root>
		</Field.Field>
		<Field.Field class="flex sm:flex-row gap-4 items-center">
			<div class="flex flex-col">
				<Field.Label for="new">New password</Field.Label>
				<Field.Description>Make it unique and hard to guess.</Field.Description>
			</div>
			<Password.Root>
				<Password.Input placeholder="Enter your new password">
					<Password.ToggleVisibility />
				</Password.Input>
				<Password.Strength
					bind:strength
					class="border-1 h-2"
				/>
			</Password.Root>
		</Field.Field>
		<Field.Field class="flex sm:flex-row gap-4 items-center">
			<div class="flex flex-col">
				<Field.Label for="confirm">Confirm new password</Field.Label>
				<Field.Description>Type it again so we know it’s correct.</Field.Description>
			</div>
			<Password.Root>
				<Password.Input placeholder="Confirm your new password">
					<Password.ToggleVisibility />
				</Password.Input>
			</Password.Root>
		</Field.Field>
	</Field.Group>
	<div class="flex justify-end">
		<Button>Update Password</Button>
	</div>
</Field.Set>

<Separator />
