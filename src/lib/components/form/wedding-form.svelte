<script lang="ts">
	import * as Form from '$lib/components/ui/form/index';
	import { cn } from '$lib/utils/utils';
	import { Input } from '$lib/components/ui/input/index';
	import CurrencyInput from '@canutin/svelte-currency-input';
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { FormToasts } from '$lib/utils/toasts';
	import { weddingSchema } from '$lib/validation/planner';

	let { data, onSuccess = $bindable() } = $props();

	const form = superForm(data.weddingForm, {
		validators: valibot(weddingSchema),
		dataType: 'json',
		onUpdate: async ({ form: f }) => {
			if (f.valid) {
				// Call success callback if provided
				if (onSuccess) {
					onSuccess();
				}
			} else {
				FormToasts.emptyFormError();
			}
		},
		onError: () => {
			FormToasts.emptyFormError();
		},
	});
	const { form: formData, enhance } = form;
</script>

<form
	id="wedding-form"
	use:enhance
	method="POST"
	action="?/createWeddingData"
	class="flex flex-col gap-4"
>
	<div class="flex flex-col sm:flex-row w-full gap-2">
		<Form.Field
			{form}
			name="groomName"
			class="w-full"
		>
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Groom Name</Form.Label>
					<Input
						{...props}
						type="text"
						bind:value={$formData.groomName}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500 text-left" />
		</Form.Field>
		<Form.Field
			{form}
			name="brideName"
			class="w-full"
		>
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Bride Name</Form.Label>
					<Input
						{...props}
						type="text"
						bind:value={$formData.brideName}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500 text-left" />
		</Form.Field>
	</div>
	<div class="flex flex-row w-full gap-2">
		<Form.Field
			{form}
			name="weddingDate"
			class="w-full"
		>
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Wedding Date</Form.Label>
					<Input
						{...props}
						type="date"
						bind:value={$formData.weddingDate}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500 text-left" />
		</Form.Field>
		<Form.Field
			{form}
			name="weddingVenue"
			class="w-full"
		>
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Location</Form.Label>
					<Input
						{...props}
						type="text"
						bind:value={$formData.weddingVenue}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500 text-left" />
		</Form.Field>
	</div>

	<Form.Field
		{form}
		name="weddingBudget"
	>
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Budget Allocated</Form.Label>
				<CurrencyInput
					{...props}
					name="weddingBudget"
					bind:value={$formData.weddingBudget}
					locale="id-ID"
					currency="IDR"
					inputClasses={{
						formatted: cn(
							'border-input bg-background selection:bg-primary dark:bg-input/30 selection:text-primary-foreground ring-offset-background placeholder:text-muted-foreground flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
							'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
							'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
						),
						formattedPositive: 'text-base',
					}}
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors class="text-xs text-red-500 text-left" />
	</Form.Field>
</form>
