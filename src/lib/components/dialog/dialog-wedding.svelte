<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as Form from '$lib/components/ui/form/index';
	import { cn } from '$lib/utils/utils';
	import { Button, buttonVariants } from '$lib/components/ui/button/index';
	import { Input } from '$lib/components/ui/input/index';
	import CurrencyInput from '@canutin/svelte-currency-input';
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { CrudToasts } from '$lib/utils/crud-toasts';
	import FormToasts from '$lib/utils/form-toasts';
	import { weddingSchema } from '$lib/validation/planner';
	import { invalidate } from '$app/navigation';

	let { data, open = $bindable() } = $props();

	function wait(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	const form = superForm(data.weddingForm, {
		validators: valibot(weddingSchema),
		onUpdate: async ({ form: f }) => {
			if (f.valid) {
				const action = data.wedding ? 'update' : 'create';
				CrudToasts.success(action, 'wedding');
				await invalidate('dashboard:data');
				await wait(500);
				open = false;
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
			$formData.groomName = data.wedding.groomName || '';
			$formData.brideName = data.wedding.brideName || '';
			$formData.weddingDate = data.wedding.weddingDate || '';
			$formData.weddingVenue = data.wedding.weddingVenue || '';
			$formData.weddingBudget = data.wedding.weddingBudget
				? parseFloat(data.wedding.weddingBudget)
				: '';
		}
	});
</script>

<Dialog.Content class="sm:max-w-lg">
	<form
		use:enhance
		method="POST"
		action={data.wedding ? '?/updateWeddingData' : '?/createWeddingData'}
		class="flex flex-col gap-4"
		onsubmit={(e) => {
			if (!$formData.valid) {
				e.preventDefault();
			}
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
			name="groomName"
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
			<Form.FieldErrors class="text-xs text-red-500" />
		</Form.Field>
		<Form.Field
			{form}
			name="brideName"
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
			name="weddingVenue"
		>
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Venue</Form.Label>
					<Input
						{...props}
						type="text"
						bind:value={$formData.weddingVenue}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500" />
		</Form.Field>
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
			<Form.FieldErrors class="text-xs text-red-500" />
		</Form.Field>
		<Dialog.Footer>
			<Button
				class={buttonVariants({ variant: 'secondary' })}
				onclick={() => (open = false)}>Cancel</Button
			>
			<Form.Button class={buttonVariants({ variant: 'default' })}>Save Changes</Form.Button>
		</Dialog.Footer>
	</form></Dialog.Content
>
