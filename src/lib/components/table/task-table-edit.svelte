<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as Form from '$lib/components/ui/form/index';
	import * as Select from '$lib/components/ui/select/index';
	import { Input } from '$lib/components/ui/input/index';
	import { superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { CrudToasts } from '$lib/utils/crud-toasts';
	import { invalidateAll } from '$app/navigation';

	import {
		taskFormSchema,
		categoryEnum,
		taskPriorityEnum,
		taskStatusEnum,
	} from '$lib/validation/index';

	let { task, data, onUpdate } = $props<{
		task: {
			id: string;
			description: string;
			category?: string;
			priority?: string;
			status?: string;
			dueDate?: string;
		};
		data: any;
		onUpdate: (taskId: string, updatedData: any) => Promise<void>;
	}>();

	let dialogOpen = $state(false);
	let isUpdating = $state(false);

	function wait(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	const form = superForm(data.taskForm, {
		validators: zod4(taskFormSchema as any),
		resetForm: false,
	});
	const { form: formData } = form;

	// Initialize form with task data when dialog opens
	$effect(() => {
		if (dialogOpen) {
			$formData.description = task.description;
			$formData.category = task.category || '';
			$formData.priority = task.priority || '';
			$formData.status = task.status || '';
			$formData.date = task.dueDate;
		}
	});

	async function handleSubmit() {
		isUpdating = true;
		try {
			await onUpdate(task.id, $formData);
			const taskName = $formData.description || 'Task';
			CrudToasts.success('update', 'task', { itemName: taskName });
			await wait(500);
			dialogOpen = false;
			await invalidateAll();
		} catch (error) {
			CrudToasts.error('update', 'An error occurred while updating the task', 'task');
		} finally {
			isUpdating = false;
		}
	}

	const selectedCategory = $derived(
		$formData.category
			? categoryEnum[$formData.category as keyof typeof categoryEnum]
			: 'Choose category',
	);

	const selectedPriority = $derived(
		$formData.priority
			? taskPriorityEnum[$formData.priority as keyof typeof taskPriorityEnum]
			: 'Select priority',
	);

	const selectedStatus = $derived(
		$formData.status
			? taskStatusEnum[$formData.status as keyof typeof taskStatusEnum]
			: 'Select task status',
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
			onsubmit={(e) => {
				e.preventDefault();
				handleSubmit();
			}}
			class="flex flex-col gap-4 py-4"
		>
			<Dialog.Header>
				<Dialog.Title>Edit Task</Dialog.Title>
				<Dialog.Description>
					<p>Update the details of your wedding task.</p>
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
									class="w-full"
								>
									{selectedPriority}
								</Select.Trigger>
								<Select.Content class="w-full">
									{#each Object.entries(taskPriorityEnum) as [value, label] (label)}
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
									class="w-full"
								>
									{selectedStatus}
								</Select.Trigger>
								<Select.Content class="w-full">
									{#each Object.entries(taskStatusEnum) as [value, label] (label)}
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
