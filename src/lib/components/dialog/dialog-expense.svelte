<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as Select from '$lib/components/ui/select/index';
	import * as Form from '$lib/components/ui/form/index';
	import { Input } from '$lib/components/ui/input/index';
	import { superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { CrudToasts } from '$lib/utils/crud-toasts';
	import FormToasts from '$lib/utils/form-toasts';
	import { expenseFormSchema, categorySchema, paymentStatusSchema } from '$lib/validation/index';

	let { data } = $props();

	const form = superForm(data.expenseForm, {
		validators: zod4(expenseFormSchema as any),
		onUpdate: ({ form: f }) => {
			if (f.valid) {
				// Use CRUD toast for successful expense creation
				const expenseDescription = f.data.description || 'Expense';
				CrudToasts.success('create', 'expense', { itemName: expenseDescription });
			} else {
				FormToasts.emptyFormError();
			}
		},
		onError: ({ result }) => {
			// Use CRUD toast for server errors
			CrudToasts.error('create', 'An error occurred while saving the expense', 'expense');
		},
	});
	const { form: formData, enhance } = form;

	const selectedCategory = $derived(
		$formData.category
			? categorySchema[$formData.category as keyof typeof categorySchema]
			: 'Choose category',
	);

	const selectedStatus = $derived(
		$formData.status
			? paymentStatusSchema[$formData.status as keyof typeof paymentStatusSchema]
			: 'Select task status',
	);
</script>

<Dialog.Content class="sm:max-w-[425px] bg-neutral-100">
	<Dialog.Header>
		<Dialog.Title>Add an Expense</Dialog.Title>
		<Dialog.Description>
			<p>Keep track of where the budget goes — from flowers to fireworks.</p>
		</Dialog.Description>
	</Dialog.Header>
	<form
		method="POST"
		use:enhance
		class="flex flex-col gap-4 py-4"
	>
		<Form.Field
			{form}
			name="description"
		>
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Description</Form.Label>
					<Input
						{...props}
						type="text"
						bind:value={$formData.description}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500" />
		</Form.Field>
		<Form.Field
			{form}
			name="amount"
		>
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Amount</Form.Label>
					<Input
						{...props}
						type="number"
						inputmode="decimal"
						bind:value={$formData.amount}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500" />
		</Form.Field>
		<div class="flex w-full gap-4">
			<Form.Field
				{form}
				name="category"
				class="flex flex-col w-full"
			>
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Category</Form.Label>
						<Select.Root
							type="single"
							bind:value={$formData.category}
							name={props.name}
						>
							<Select.Trigger
								{...props}
								class="flex w-full"
							>
								{selectedCategory}
							</Select.Trigger>
							<Select.Content>
								{#each Object.entries(categorySchema) as [value, label] (label)}
									<Select.Item {value}>
										{label}
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field
				{form}
				name="status"
				class="flex flex-col w-full"
			>
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Payment Status</Form.Label>
						<Select.Root
							type="single"
							bind:value={$formData.status}
							name={props.name}
						>
							<Select.Trigger
								{...props}
								class="flex w-full"
							>
								{selectedStatus}
							</Select.Trigger>
							<Select.Content>
								{#each Object.entries(paymentStatusSchema) as [value, label] (label)}
									<Select.Item {value}>
										{label}
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>
		<Form.Field
			{form}
			name="date"
		>
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Date</Form.Label>
					<Input
						{...props}
						type="date"
						bind:value={$formData.date}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500" />
		</Form.Field>
		<Dialog.Footer>
			<Form.Button type="submit">Add New Expense</Form.Button>
		</Dialog.Footer>
	</form>
</Dialog.Content>
