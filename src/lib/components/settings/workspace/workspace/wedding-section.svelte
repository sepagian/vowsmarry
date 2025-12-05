<script lang="ts">
	import { page } from '$app/stores';
	import * as Form from '$lib/components/ui/form/index';
	import { Input } from '$lib/components/ui/input/';
	import { Separator } from '$lib/components/ui/separator/';
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { weddingDetailsSchema } from '$lib/validation/workspace';
	import { invalidateAll } from '$app/navigation';

	const { weddingDetailsForm, organization } = $page.data;

	// Debug: Log form data
	console.log('Wedding Details Form Data:', weddingDetailsForm);
	console.log('Organization:', organization);

	const form = superForm(weddingDetailsForm, {
		validators: valibot(weddingDetailsSchema),
		onResult: async ({ result }) => {
			if (result.type === 'success' && result.data?.success) {
				toast.success(result.data.message || 'Wedding details updated successfully');
				await invalidateAll();
			} else if (result.type === 'failure') {
				toast.error(result.data?.message || 'Failed to update wedding details');
			}
		},
		onError: () => {
			toast.error('An error occurred while updating wedding details');
		},
	});

	const { form: formData, errors, enhance } = form;

	// Debug: Log reactive form data
	$effect(() => {
		console.log('Current wedding form values:', $formData);
	});
</script>

<form
	method="POST"
	action="?/updateWeddingDetails"
	use:enhance
	class="flex flex-col gap-4"
>
	<div class="flex flex-col">
		<h1 class="font-extrabold text-xl">Wedding Details</h1>
		<span class="text-muted-foreground text-sm"
			>These details help shape your timeline, invitations, and shared moments.</span
		>
	</div>

	<div class="grid gap-6">
		<Form.Field
			{form}
			name="weddingDate"
		>
			<Form.Control>
				{#snippet children({ props })}
					<div class="flex flex-col sm:flex-row gap-2 align-center">
						<div class="flex flex-col flex-1 gap-1">
							<Form.Label>Wedding Date</Form.Label>
							<Form.Description>When will your day unfold?</Form.Description>
						</div>
						<div class="flex-1">
							<Input
								{...props}
								type="date"
								bind:value={$formData.weddingDate}
							/>
						</div>
					</div>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500" />
		</Form.Field>

		<Form.Field
			{form}
			name="weddingVenue"
		>
			<Form.Control>
				{#snippet children({ props })}
					<div class="flex flex-col sm:flex-row gap-2 align-center">
						<div class="flex flex-col flex-1 gap-1">
							<Form.Label>Wedding Location</Form.Label>
							<Form.Description>Where will your wedding take place?</Form.Description>
						</div>
						<div class="flex-1">
							<Input
								{...props}
								type="text"
								bind:value={$formData.weddingVenue}
								placeholder="Venue or City"
							/>
						</div>
					</div>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500" />
		</Form.Field>
	</div>

	<Separator />
</form>
