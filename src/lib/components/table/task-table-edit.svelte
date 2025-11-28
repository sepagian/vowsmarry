<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as Form from '$lib/components/ui/form/index';
	import * as Select from '$lib/components/ui/select/index';
	import { Input } from '$lib/components/ui/input/index';
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { CrudToasts } from '$lib/utils/toasts';
	import type { Task } from '$lib/types';

	import {
		taskSchema,
		categoryEnum,
		taskPriorityEnum,
		taskStatusEnum,
	} from '$lib/validation/planner';

	let { task, data, onUpdate } = $props<{
		task: Task;
		data: any;
		onUpdate: (taskId: string, updatedData: any) => Promise<void>;
	}>();

	let dialogOpen = $state(false);
	let isUpdating = $state(false);

	const form = superForm(data.taskForm, {
		validators: valibot(taskSchema),
		resetForm: false,
	});
	const { form: formData } = form;

	$effect(() => {
		if (dialogOpen) {
			$formData.taskDescription = task.taskDescription;
			$formData.taskCategory = task.taskCategory;
			$formData.taskPriority = task.taskPriority;
			$formData.taskStatus = task.taskStatus;
			$formData.taskDueDate = task.taskDueDate;
		}
	});

	async function handleSubmit() {
		isUpdating = true;
		try {
			await onUpdate(task.id, $formData);
			CrudToasts.success('update', 'task', { itemName: $formData.taskDescription });
			dialogOpen = false;
		} catch (error) {
			CrudToasts.error('update', 'An error occurred while updating the task', 'task');
		} finally {
			isUpdating = false;
		}
	}

	const selectedCategory = $derived(
		categoryEnum.find((c) => c.value === $formData.taskCategory)?.label ?? 'Choose category',
	);

	const selectedPriority = $derived(
		taskPriorityEnum.find((p) => p.value === $formData.taskPriority)?.label ?? 'Select priority',
	);

	const selectedStatus = $derived(
		taskStatusEnum.find((s) => s.value === $formData.taskStatus)?.label ?? 'Select task status',
	);
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="outline"
				size="sm"
				class="h-8 w-8 p-0"
				title="Edit task"
			>
				<div class="i-lucide:pencil h-4 w-4"></div>
			</Button>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<form
			action="?/updateTask"
			onsubmit={(e) => {
				e.preventDefault();
				handleSubmit();
			}}
			class="flex flex-col gap-4"
		>
			<Dialog.Header>
				<Dialog.Title>Edit Task</Dialog.Title>
				<Dialog.Description>
					<p>Update the details of your wedding task.</p>
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
									class="w-full"
								>
									{selectedPriority}
								</Select.Trigger>
								<Select.Content class="w-full">
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
									class="w-full"
								>
									{selectedStatus}
								</Select.Trigger>
								<Select.Content class="w-full">
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
						<Form.Label>Due Date</Form.Label>
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
				<Button
					type="submit"
					disabled={isUpdating}
				>
					{isUpdating ? 'Updating...' : 'Update Task'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
