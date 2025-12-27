<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import * as Field from '$lib/components/ui/field';
	import { Button } from '$lib/components/ui/button/index';

	let languages = [
		{ code: 'en', label: 'English' },
		{ code: 'de', label: 'Deutsch' },
		{ code: 'fr', label: 'Français' },
		{ code: 'es', label: 'Español' },
		{ code: 'id', label: 'Bahasa Indonesia' },
	];

	let currencies = [
		{ code: 'idr', label: 'Rupiah' },
		{ code: 'usd', label: 'Dollar' },
		{ code: 'eur', label: 'Euro' },
	];
</script>

<div class="flex flex-col">
	<h1 class="font-extrabold text-xl">Localization</h1>
	<span class="text-muted-foreground text-sm"
		>Set how you'd like details to appear across your workspace.</span
	>
</div>

<Field.Set>
	<Field.Group class="grid gap-6">
		<Field.Field class="flex sm:flex-row gap-4 items-center">
			<div class="flex flex-col">
				<Field.Label for="workspace-name">Language</Field.Label>
				<Field.Description
					>Choose the language you’re most comfortable planning in.</Field.Description
				>
			</div>
			<Select.Root type="single">
				<Select.Trigger>Select your preferred language</Select.Trigger>
				<Select.Content>
					{#each languages as language (language.code)}
						<Select.Item value={language.code}>{language.label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</Field.Field>

		<Field.Field class="flex sm:flex-row gap-4 items-center">
			<div class="flex flex-col">
				<Field.Label for="workspace-name">Currency</Field.Label>
				<Field.Description
					>Pick your preferred currency for expenses and vendor items.</Field.Description
				>
			</div>
			<Select.Root type="single">
				<Select.Trigger>Select your preferred currency</Select.Trigger>
				<Select.Content>
					{#each currencies as currency (currency.code)}
						<Select.Item value={currency.code}>{currency.label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</Field.Field>
	</Field.Group>
</Field.Set>
