<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as Form from '$lib/components/ui/form/index';
	import { cn } from '$lib/utils/utils';
	import { Button, buttonVariants } from '$lib/components/ui/button/index';
	import { Input } from '$lib/components/ui/input/index';
	import CurrencyInput from '@canutin/svelte-currency-input';
	import { superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { CrudToasts } from '$lib/utils/crud-toasts';
	import FormToasts from '$lib/utils/form-toasts';
	import { weddingFormSchema } from '$lib/validation/index';
	import { invalidate } from '$app/navigation';

	let { data, open = $bindable() } = $props();

	function wait(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	const form = superForm(data.weddingForm, {
		validators: zod4(weddingFormSchema as any),
		onUpdate: async ({ form: f }) => {
			if (f.valid) {
				const action = data.wedding ? 'update' : 'create';
				CrudToasts.success(action, 'wedding');
				// Reload page data to get updated wedding info
				await invalidate('dashboard:data');
			} else {
				FormToasts.emptyFormError();
			}
		},
		onError: () => {
			// Use CRUD toast for server errors
			const action = data.wedding ? 'update' : 'create';
			CrudToasts.error(action, 'An error occurred while saving the wedding details', 'wedding');
		},
	});
	const { form: formData, enhance } = form;

	// Load existing wedding data into form when editing
	$effect(() => {
		if (data.wedding && open) {
			$formData.partnerName = data.wedding.partnerName || '';
			$formData.weddingDate = data.wedding.weddingDate || '';
			$formData.venue = data.wedding.venue || '';
			$formData.budget = data.wedding.budget ? parseFloat(data.wedding.budget) : '';
		}
	});
</script>

<Dialog.Content class="sm:max-w-lg">
	<form
		use:enhance
		method="POST"
		action={data.wedding ? '?/updateWeddingData' : '?/createWeddingData'}
		class="flex flex-col gap-4"
		onsubmit={() => {
			wait(500).then(() => (open = false));
		}}
	>
		<Dialog.Header>
			{#if data.wedding}
				<Dialog.Title>Edit Your Wedding Details</Dialog.Title>
				<Dialog.Description>
					<p>
						Update your names, wedding date, and other important information to keep everything up
						to date.
					</p>
				</Dialog.Description>
			{:else}
				<Dialog.Title>Add Your Wedding Details</Dialog.Title>
				<Dialog.Description>
					<p>
						Add your names, wedding date, and other important information to start managing tasks,
						finances, and more
					</p>
				</Dialog.Description>
			{/if}
		</Dialog.Header>

		<Form.Field
			{form}
			name="partnerName"
		>
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Partner Name</Form.Label>
					<Input
						{...props}
						type="text"
						bind:value={$formData.partnerName}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500" />
		</Form.Field>
		<Form.Field
			{form}
			name="weddingDate"
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
			<Form.FieldErrors class="text-xs text-red-500" />
		</Form.Field>
		<Form.Field
			{form}
			name="venue"
		>
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Venue</Form.Label>
					<Input
						{...props}
						type="text"
						bind:value={$formData.venue}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500" />
		</Form.Field>
		<Form.Field
			{form}
			name="budget"
		>
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Budget Allocated</Form.Label>
					<CurrencyInput
						{...props}
						name="budget"
						bind:value={$formData.budget}
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
			<Form.FieldErrors class="text-xs text-red-500" />
		</Form.Field>
		<Dialog.Footer>
			<Button
				class={buttonVariants({ variant: 'secondary' })}
				onclick={() => (open = false)}>Cancel</Button
			>
			<Form.Button class={buttonVariants({ variant: 'default' })}>Save changes</Form.Button>
		</Dialog.Footer>
	</form></Dialog.Content
>
