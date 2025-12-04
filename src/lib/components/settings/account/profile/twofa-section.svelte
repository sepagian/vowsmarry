<script lang="ts">
	import { Separator } from '$lib/components/ui/separator/index';
	import { Button } from '$lib/components/ui/button/index';
	import * as Field from '$lib/components/ui/field';
</script>

<div class="flex flex-col">
	<h1 class="font-extrabold text-xl">Two-Factor Authentication</h1>
	<span class="text-muted-foreground text-sm text-balance"
		>Add a second step to your login for better peace of mind.</span
	>
</div>

<!-- TODO: ADD 2FA -->

<Field.Set>
	<Field.Group class="grid gap-6">
		<Field.Field class="flex sm:flex-row gap-4 items-center">
			<div class="flex flex-col">
				<Field.Label for="name">Your account doesn’t have extra protection yet.</Field.Label>
			</div>
			<div class="flex justify-end">
				<Button>Enable Two-Factor Authentication</Button>
			</div>
		</Field.Field>
	</Field.Group>
</Field.Set>

<Separator />

<Field.Set>
	<Field.Group class="grid gap-6">
		<Field.Field class="flex sm:flex-row gap-4 items-center">
			<div class="flex flex-col">
				<Field.Label for="name">Two-factor authentication is active on your account.</Field.Label>
			</div>
		</Field.Field>
		<Field.Field class="flex flex-row gap-4 items-center">
			<div class="flex flex-col">
				<Field.Label for="name">Recovery Codes</Field.Label>
				<Field.Description
					>Keep these somewhere safe. They let you sign in if you lose access to your device.</Field.Description
				>
			</div>
			<div class="flex justify-end">
				<Button>Regenerate Codes</Button>
			</div>
		</Field.Field>
		<Field.Field class="flex flex-row gap-4 items-center">
			<div class="flex flex-col">
				<Field.Label for="name">Authenticator App</Field.Label>
				<Field.Description
					>You’re using an authenticator app to generate login codes.</Field.Description
				>
			</div>
			<div class="flex justify-end">
				<Button>Reset 2FA Setup</Button>
			</div>
		</Field.Field>
	</Field.Group>
	<div class="flex justify-end">
		<Button
			variant="outline"
			class="border-destructive text-destructive">Disable Two-Factor Authentication</Button
		>
	</div>
</Field.Set>

<Separator />
