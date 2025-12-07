<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as Select from '$lib/components/ui/select/index';
	import * as Form from '$lib/components/ui/form/index';
	import { Input } from '$lib/components/ui/input/index';
	import type { Expense } from '$lib/types';
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { expenseSchema, categoryEnum, expenseStatusEnum } from '$lib/validation/planner';
	import { CrudToasts, FormToasts } from '$lib/utils/toasts';
	import { InvalidationService } from '$lib/utils/invalidation-helpers';
	import { createFormDataWithId } from '$lib/utils/form-helpers';
	import { confirmDelete } from '$lib/components/ui/confirm-delete-dialog';

	let { expense, data, onUpdate, onDelete } = $props<{
		expense: Expense;
		data: any;
		onUpdate: (expenseId: string, updatedData: any) => Promise<void>;
		onDelete: (expenseId: string) => Promise<void>;
	}>();

	let editDialogOpen = $state(false);

	const form = superForm(data.expenseForm, {
		validators: valibot(expenseSchema),
		resetForm: false,
		onUpdate: async ({ form: f }) => {
			if (f.valid) {
				editDialogOpen = false;
				CrudToasts.success('update', 'expense');
				await InvalidationService.invalidateExpense();
			} else {
				FormToasts.emptyFormError();
			}
		},
		onError: () => {
			CrudToasts.error('update', 'An error occurred while updating the expense', 'expense');
		},
	});
	const { form: formData, enhance } = form;

	function openEditDialog() {
		$formData.description = expense.expenseDescription;
		$formData.category = expense.category;
		$formData.amount = expense.amount;
		$formData.paymentStatus = expense.paymentStatus;
		$formData.date = expense.dueDate;
		editDialogOpen = true;
	}

	async function handleDelete() {
		const formData = createFormDataWithId(expense.id);

		const response = await fetch('?/deleteExpenseItem', {
			method: 'POST',
			body: formData,
		});

		const result = (await response.json()) as { type: string; error?: string };

		if (result.type === 'success') {
			CrudToasts.success('delete', 'expense');
			await InvalidationService.invalidateExpense();
		} else {
			CrudToasts.error('delete', result.error || 'Failed to delete expense', 'expense');
			throw new Error(result.error || 'Failed to delete expense');
		}
	}

	const selectedCategory = $derived(
		$formData.category
			? categoryEnum[$formData.category as keyof typeof categoryEnum]
			: 'Choose category',
	);

	const selectedStatus = $derived(
		$formData.paymentStatus
			? expenseStatusEnum[$formData.paymentStatus as keyof typeof expenseStatusEnum]
			: 'Select payment status',
	);
</script>

<div class="flex gap-2 justify-center">
	<Button
		variant="outline"
		size="sm"
		class="h-8 w-8 p-0"
		title="Edit expense"
		onclick={openEditDialog}
	>
		<div class="i-lucide:pencil h-4 w-4"></div>
	</Button>
	<Button
		variant="outline"
		size="sm"
		class="h-8 w-8 p-0"
		title="Delete expense"
		onclick={() => {
			confirmDelete({
				title: 'Are you sure?',
				description: `This will permanently delete the expense "${expense.expenseDescription}". This action cannot be undone.`,
				onConfirm: handleDelete
			});
		}}
	>
		<div class="i-lucide:trash2 h-4 w-4 bg-red-500"></div>
	</Button>
</div>

<!-- Edit Dialog -->
<Dialog.Root bind:open={editDialogOpen}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Edit Expense</Dialog.Title>
			<Dialog.Description>
				<p>Update the expense details below.</p>
			</Dialog.Description>
		</Dialog.Header>
		<form
			method="POST"
			use:enhance
			action="?/editExpenseItem"
			class="flex flex-col gap-4"
		>
			<input
				type="hidden"
				name="id"
				value={expense.id}
			/>
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
									{#each Object.entries(expenseStatusEnum) as [value, label] (label)}
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
				<Form.Button>Update Expense</Form.Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
