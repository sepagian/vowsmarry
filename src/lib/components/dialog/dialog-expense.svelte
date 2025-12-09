<script lang="ts">
	import { superForm } from "sveltekit-superforms";
	import { valibot } from "sveltekit-superforms/adapters";
	import * as Dialog from "$lib/components/ui/dialog/index";
	import * as Form from "$lib/components/ui/form/index";
	import { Input } from "$lib/components/ui/input/index";
	import * as Select from "$lib/components/ui/select/index";
	import { InvalidationService } from "$lib/utils/invalidation-helpers";
	import { CrudToasts, FormToasts } from "$lib/utils/toasts";
	import {
		categoryEnum,
		expenseSchema,
		expenseStatusEnum,
	} from "$lib/validation/planner";

	let { data, open = $bindable() } = $props();

	const form = superForm(data.expenseForm, {
		validators: valibot(expenseSchema),
		resetForm: true,
		onResult: async ({ result }) => {
			if (result.type === "success") {
				const expenseDescription = $formData.expenseDescription || "Expense";
				CrudToasts.success("create", "expense", {
					itemName: expenseDescription,
				});
				await InvalidationService.invalidateExpense();
				open = false;
			} else if (result.type === "failure") {
				FormToasts.emptyFormError();
			} else if (result.type === "error") {
				CrudToasts.error(
					"create",
					"An error occurred while saving the expense",
					"expense"
				);
			}
		},
	});
	const { form: formData, enhance } = form;

	const selectedCategory = $derived(
		$formData.expenseCategory
			? categoryEnum.find((c) => c.value === $formData.expenseCategory)?.label
			: "Choose category"
	);

	const selectedStatus = $derived(
		$formData.expensePaymentStatus
			? expenseStatusEnum.find(
					(s) => s.value === $formData.expensePaymentStatus
				)?.label
			: "Select payment status"
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
		onsubmit={(e) => {
			if (!$formData.valid) {
				e.preventDefault();
			}
		}}
	>
		<Form.Field {form} name="expenseDescription">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Description</Form.Label>
					<Input
						{...props}
						type="text"
						bind:value={$formData.expenseDescription}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500"/>
		</Form.Field>
		<Form.Field {form} name="expenseAmount">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Amount</Form.Label>
					<Input
						{...props}
						type="number"
						pattern="[0-9]*"
						bind:value={$formData.expenseAmount}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500"/>
		</Form.Field>
		<div class="flex w-full gap-4">
			<Form.Field {form} name="expenseCategory" class="flex flex-col w-full">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Category</Form.Label>
						<Select.Root
							type="single"
							bind:value={$formData.expenseCategory}
							name={props.name}
						>
							<Select.Trigger {...props} class="flex w-full">
								{selectedCategory}
							</Select.Trigger>
							<Select.Content>
								{#each categoryEnum as option (option.value)}
									<Select.Item value={option.value}>
										{option.label}
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors/>
			</Form.Field>
			<Form.Field
				{form}
				name="expensePaymentStatus"
				class="flex flex-col w-full"
			>
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Payment Status</Form.Label>
						<Select.Root
							type="single"
							bind:value={$formData.expensePaymentStatus}
							name={props.name}
						>
							<Select.Trigger {...props} class="flex w-full">
								{selectedStatus}
							</Select.Trigger>
							<Select.Content>
								{#each expenseStatusEnum as option (option.value)}
									<Select.Item value={option.value}>
										{option.label}
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors/>
			</Form.Field>
		</div>
		<Form.Field {form} name="expenseDueDate">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Date</Form.Label>
					<Input {...props} type="date" bind:value={$formData.expenseDueDate} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500"/>
		</Form.Field>
		<Dialog.Footer>
			<Form.Button>Add New Expense</Form.Button>
		</Dialog.Footer>
	</form>
</Dialog.Content>
