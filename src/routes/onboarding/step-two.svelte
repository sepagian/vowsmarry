<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as FieldSet from '$lib/components/ui/field-set';
	import WeddingForm from '$lib/components/form/wedding-form.svelte';
	import { toast } from 'svelte-sonner';

	let { handleBack, handleNext, wizardFormState } = $props();

	let formComponent: any = $state();

	function handleSubmit() {
		// Trigger form validation by submitting the form
		const form = document.getElementById('wedding-form') as HTMLFormElement;
		if (form) {
			form.requestSubmit();
		}
	}

	function handleSuccess() {
		toast.success('Wedding details saved successfully');
		handleNext();
	}
</script>

<div class="w-full h-fit pt-4">
	<FieldSet.Root class="justify-between rounded-xl overflow-hidden">
		<div class="flex flex-col">
			<FieldSet.Title class="p-6 font-bold flex flex-col gap-1">
				<h1 class="font-semibold text-lg">Let's get to know your wedding a little</h1>
				<span class="text-sm text-balance text-muted-foreground">
					These details help shape your planning space so it already feels like yours from the very
					beginning.
				</span>
			</FieldSet.Title>
			<FieldSet.Content class="p-6 text-balance text-center text-foreground">
				<WeddingForm
					bind:this={formComponent}
					data={wizardFormState}
					onSuccess={handleSuccess}
				/>
			</FieldSet.Content>
		</div>

		<FieldSet.Footer class="flex px-4 py-6 justify-between">
			<Button
				onclick={handleBack}
				size="sm"
				class="bg-gray-200 text-gray-800 hover:bg-gray-300">Back</Button
			>

			<Button
				type="button"
				onclick={handleSubmit}
				size="sm"
				class="bg-orange-200 text-orange-800 hover:bg-orange-300">Next</Button
			>
		</FieldSet.Footer>
	</FieldSet.Root>
</div>
