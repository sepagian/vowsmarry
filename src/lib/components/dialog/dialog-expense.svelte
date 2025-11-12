<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as Select from '$lib/components/ui/select/index';
	import * as Form from '$lib/components/ui/form/index';
	import { Input } from '$lib/components/ui/input/index';
	import { superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { CrudToasts } from '$lib/utils/crud-toasts';
	import FormToasts from '$lib/utils/form-toasts';
	import { expenseFormSchema, categoryEnum, paymentStatusEnum } from '$lib/validation/index';
	import { invalidate } from '$app/navigation';

	let { data, open = $bindable() } = $props();

	function wait(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	const form = superForm(data.expenseForm, {
		validators: zod4(expenseFormSchema as any),
		onUpdate: async ({ form: f }) => {
			if (f.valid) {
				// Use CRUD toast for successful expense creation
				const expenseDescription = f.data.description || 'Expense';
				CrudToasts.success('create', 'expense', { itemName: expenseDescription });
				// Invalidate to refetch all expense data including stats
				await invalidate('expense:list');
				await invalidate('dashboard:data');
				// Close dialog after successful creation
				await wait(500);
				open = false;
			} else {
				FormToasts.emptyFormError();
			}
		},
		onError: () => {
			CrudToasts.error('create', 'An error occurred while saving the expense', 'expense');
		},
	});
	const { form: formData, enhance } = form;

	const selectedCategory = $derived(
		$formData.category
			? categoryEnum[$formData.category as keyof typeof categoryEnum]
			: 'Choose category',
	);

	const selectedStatus = $derived(
		$formData.paymentStatus
			? paymentStatusEnum[$formData.paymentStatus as keyof typeof paymentStatusEnum]
			: 'Select payment status',
	);
</script>

<Dialog.Content class="sm:max-w-[425px]">
	<Dialog.Header>
		<Dialog.Title>Add an Expense</Dialog.Title>
		<Dialog.Description>
			<p>Keep track of where the budget goes — from flowers to fireworks.</p>
		</Dialog.Description>
	</Dialog.Header>
	<form
		method="POST"
		use:enhance
		action="?/createExpenseItem"
		class="flex flex-col gap-4"
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
						pattern="[0-9]*"
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
								{#each Object.entries(categoryEnum) as [value, label] (label)}
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
				name="paymentStatus"
				class="flex flex-col w-full"
			>
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Payment Status</Form.Label>
						<Select.Root
							type="single"
							bind:value={$formData.paymentStatus}
							name={props.name}
						>
							<Select.Trigger
								{...props}
								class="flex w-full"
							>
								{selectedStatus}
							</Select.Trigger>
							<Select.Content>
								{#each Object.entries(paymentStatusEnum) as [value, label] (label)}
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
			<Form.Button>Add New Expense</Form.Button>
		</Dialog.Footer>
	</form>
</Dialog.Content>
