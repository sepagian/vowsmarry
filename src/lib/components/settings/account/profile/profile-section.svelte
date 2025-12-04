<script lang="ts">
	import { Separator } from '$lib/components/ui/separator/index';
	import { Input } from '$lib/components/ui/input/';
	import { Button } from '$lib/components/ui/button/index';
	import * as Field from '$lib/components/ui/field';
	import * as Select from '$lib/components/ui/select';
	import * as InputGroup from '$lib/components/ui/input-group';
	import { userRole } from '$lib/validation/planner';
</script>

<div class="flex flex-col">
	<h1 class="font-extrabold text-xl">Profile</h1>
	<span class="text-muted-foreground text-sm"
		>Update your name, photo, and basic information so everything stays familiar across your
		workspace.</span
	>
</div>

<Field.Set>
	<Field.Group class="grid gap-6">
		<Field.Field class="flex sm:flex-row gap-4 items-center">
			<div class="flex flex-col">
				<Field.Label for="name">Full name</Field.Label>
				<Field.Description>This appears across your workspace.</Field.Description>
			</div>
			<Input
				id="name"
				placeholder="John Doe"
			/>
		</Field.Field>
		<Field.Field class="flex sm:flex-row gap-4 items-center">
			<div class="flex flex-col">
				<Field.Label for="email">Email address</Field.Label>
				<Field.Description>Your primary contact for updates and sign-in.</Field.Description>
			</div>
			<Input
				type="email"
				id="email"
				placeholder="johndoe@email.com"
			/>
		</Field.Field>
		<Field.Field class="flex sm:flex-row gap-4 items-center">
			<div class="flex flex-col">
				<Field.Label for="phone">Phone number</Field.Label>
				<Field.Description>Used for quick verification or important notices.</Field.Description>
			</div>
			<InputGroup.Root>
				<InputGroup.Addon>
					<InputGroup.Text>+62</InputGroup.Text>
				</InputGroup.Addon>
				<InputGroup.Input
					type="tel"
					id="phone"
					placeholder="8123 456 7890"
				/>
			</InputGroup.Root>
		</Field.Field>
		<Field.Field class="flex sm:flex-row gap-2 items-center">
			<div class="flex flex-col">
				<Field.Label for="role">Role</Field.Label>
				<Field.Description>Tell others what you do here.</Field.Description>
			</div>
			<Select.Root type="single">
				<Select.Trigger class="w-[180px]">Select your Role</Select.Trigger>
				<Select.Content>
					{#each userRole as role (role.value)}
						<Select.Item value={role.value}>{role.label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</Field.Field>
	</Field.Group>
	<div class="flex justify-end">
		<Button>Save Changes</Button>
	</div>
</Field.Set>

<Separator />
