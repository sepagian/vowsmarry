<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';

	import { Button } from '$lib/components/ui/button';
	import { Content as FieldSetContent, Footer as FieldSetFooter, Root as FieldSetRoot, Title as FieldSetTitle } from '$lib/components/ui/field-set';

	import Success from './success.svelte';

	let { handleBack, handleNext } = $props();

	async function goToDashboard() {
		await invalidateAll();
		await goto('/dashboard');
		handleNext();
	}
</script>

<div class="w-full h-xl pt-4">
	<FieldSetRoot class="justify-between rounded-xl overflow-hidden">
		<FieldSetTitle class="p-6 font-bold flex flex-col gap-1"></FieldSetTitle>
		<FieldSetContent class="p-6 text-balance text-center text-foreground">
			<Success />
		</FieldSetContent>
		<FieldSetFooter class="flex px-4 py-6 justify-between">
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
		</FieldSetFooter>
	</FieldSetRoot>
</div>
