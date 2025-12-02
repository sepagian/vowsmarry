<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as FieldSet from '$lib/components/ui/field-set';
	import Success from './success.svelte';
	import { invalidateAll, goto } from '$app/navigation';

	let { handleBack, handleNext } = $props();

	async function goToDashboard() {
		await invalidateAll();
		await goto('/dashboard');
		handleNext();
	}
</script>

<div class="w-full h-xl pt-4">
	<FieldSet.Root class="justify-between rounded-xl overflow-hidden">
		<FieldSet.Title class="p-6 font-bold flex flex-col gap-1"></FieldSet.Title>
		<FieldSet.Content class="p-6 text-balance text-center text-foreground">
			<Success />
		</FieldSet.Content>
		<FieldSet.Footer class="flex px-4 py-6 justify-between">
			<Button
				onclick={handleBack}
				size="sm"
				class="bg-gray-200 text-gray-800">Back</Button
			>
			<Button
				onclick={goToDashboard}
				size="sm"
				class="bg-orange-200 text-orange-800 hover:bg-orange-300">Go to Dashboard</Button
			>
		</FieldSet.Footer>
	</FieldSet.Root>
</div>
