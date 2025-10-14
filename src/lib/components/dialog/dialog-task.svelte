<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as Form from '$lib/components/ui/form/index';
	import * as Select from '$lib/components/ui/select/index';
	import { Input } from '$lib/components/ui/input/index';
	import { superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { CrudToasts } from '$lib/utils/crud-toasts';
	import FormToasts from '$lib/utils/form-toasts';
	import {
		taskFormSchema,
		categorySchema,
		taskPrioritySchema,
		taskStatusSchema,
	} from '$lib/validation/index';

	let { data } = $props();

	const form = superForm(data.taskForm, {
		validators: zod4(taskFormSchema as any),
		onUpdate: ({ form: f }) => {
			if (f.valid) {
				// Use CRUD toast for successful task creation
				const taskName = f.data.description || 'Task';
				CrudToasts.success('create', 'task', { itemName: taskName });
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
		$formData.category
			? categorySchema[$formData.category as keyof typeof categorySchema]
			: 'Choose category',
	);

	const selectedPriority = $derived(
		$formData.priority
			? taskPrioritySchema[$formData.priority as keyof typeof taskPrioritySchema]
			: 'Select priority',
	);

	const selectedStatus = $derived(
		$formData.status
			? taskStatusSchema[$formData.status as keyof typeof taskStatusSchema]
			: 'Select task status',
	);
</script>

<Dialog.Content class="sm:max-w-[425px]">
	<form
		use:enhance
		method="POST"
		class="flex flex-col gap-4 py-4"
	>
		<Dialog.Header>
			<Dialog.Title>Add New Task</Dialog.Title>
			<Dialog.Description>
				<p>Write down what needs to be done for your wedding journey.</p>
			</Dialog.Description>
		</Dialog.Header>
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
			name="category"
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
							class="w-full"
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
		<div class="flex w-full gap-4">
			<Form.Field
				{form}
				name="priority"
				class="flex flex-col w-full"
			>
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Priority</Form.Label>
						<Select.Root
							type="single"
							bind:value={$formData.priority}
							name={props.name}
						>
							<Select.Trigger
								{...props}
								class="flex w-full"
							>
								{selectedPriority}
							</Select.Trigger>
							<Select.Content>
								{#each Object.entries(taskPrioritySchema) as [value, label] (label)}
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
						<Form.Label>Status</Form.Label>
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
								{#each Object.entries(taskStatusSchema) as [value, label] (label)}
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
			<Form.Button>Add Task</Form.Button>
		</Dialog.Footer>
	</form>
</Dialog.Content>
