<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as Form from '$lib/components/ui/form/index';
	import * as Select from '$lib/components/ui/select/index';
	import { Input } from '$lib/components/ui/input/index';
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { CrudToasts } from '$lib/utils/crud-toasts';
	import FormToasts from '$lib/utils/form-toasts';
	import {
		taskSchema,
		categoryEnum,
		taskPriorityEnum,
		taskStatusEnum,
	} from '$lib/validation/planner';
	import { invalidate } from '$app/navigation';

	let { data, open = $bindable() } = $props();

	function wait(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	const form = superForm(data.taskForm, {
		validators: valibot(taskSchema),
		onUpdate: async ({ form: f }) => {
			if (f.valid) {
				// Use CRUD toast for successful task creation
				const taskName = f.data.taskDescription || 'Task';
				CrudToasts.success('create', 'task', { itemName: taskName });
				// Invalidate to refetch all task data including stats
				await invalidate('task:list');
				await invalidate('calendar:data');
				// Close dialog after successful creation
				await wait(500);
				open = false;
			} else {
				FormToasts.emptyFormError();
			}
		},
		onError: () => {
			// Use CRUD toast for server errors
			CrudToasts.error('create', 'An error occurred while saving the task', 'task');
		},
	});
	const { form: formData, enhance } = form;

	const selectedCategory = $derived(
		$formData.taskCategory
			? categoryEnum.find((c) => c.value === $formData.taskCategory)?.label
			: 'Choose category',
	);

	const selectedPriority = $derived(
		$formData.taskPriority
			? taskPriorityEnum.find((p) => p.value === $formData.taskPriority)?.label
			: 'Select priority',
	);

	const selectedStatus = $derived(
		$formData.taskStatus
			? taskStatusEnum.find((s) => s.value === $formData.taskStatus)?.label
			: 'Select task status',
	);
</script>

<Dialog.Content class="sm:max-w-[425px]">
	<form
		use:enhance
		method="POST"
		action="?/createTask"
		class="flex flex-col gap-4"
		onsubmit={(e) => {
			if (!$formData.valid) {
				e.preventDefault();
			}
		}}
	>
		<Dialog.Header>
			<Dialog.Title>Add New Task</Dialog.Title>
			<Dialog.Description>
				<p>Write down what needs to be done for your wedding journey.</p>
			</Dialog.Description>
		</Dialog.Header>
		<Form.Field
			{form}
			name="taskDescription"
		>
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Description</Form.Label>
					<Input
						{...props}
						type="text"
						bind:value={$formData.taskDescription}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500" />
		</Form.Field>
		<Form.Field
			{form}
			name="taskCategory"
		>
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Category</Form.Label>
					<Select.Root
						type="single"
						bind:value={$formData.taskCategory}
						name={props.name}
					>
						<Select.Trigger
							{...props}
							class="w-full"
						>
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
			<Form.FieldErrors />
		</Form.Field>
		<div class="flex w-full gap-4">
			<Form.Field
				{form}
				name="taskPriority"
				class="flex flex-col w-full"
			>
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Priority</Form.Label>
						<Select.Root
							type="single"
							bind:value={$formData.taskPriority}
							name={props.name}
						>
							<Select.Trigger
								{...props}
								class="flex w-full"
							>
								{selectedPriority}
							</Select.Trigger>
							<Select.Content>
								{#each taskPriorityEnum as option (option.value)}
									<Select.Item value={option.value}>
										{option.label}
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
				name="taskStatus"
				class="flex flex-col w-full"
			>
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Status</Form.Label>
						<Select.Root
							type="single"
							bind:value={$formData.taskStatus}
							name={props.name}
						>
							<Select.Trigger
								{...props}
								class="flex w-full"
							>
								{selectedStatus}
							</Select.Trigger>
							<Select.Content>
								{#each taskStatusEnum as option (option.value)}
									<Select.Item value={option.value}>
										{option.label}
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
			name="taskDueDate"
		>
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Date</Form.Label>
					<Input
						{...props}
						type="date"
						bind:value={$formData.taskDueDate}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500" />
		</Form.Field>
		<Dialog.Footer>
			<Form.Button>Add Task</Form.Button>
		</Dialog.Footer>
	</form>
</Dialog.Content>
