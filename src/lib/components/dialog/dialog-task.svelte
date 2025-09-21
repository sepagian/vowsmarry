<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as Select from '$lib/components/ui/select/index';
	import { Button } from '$lib/components/ui/button/index';
	import { Input } from '$lib/components/ui/input/index';
	import { Label } from '$lib/components/ui/label/index';
	import { Textarea } from '$lib/components/ui/textarea/index';
	import { categoryOptions, priorityOptions } from '$lib/constants/constants';

	let categoryValue = $state('');
	let priorityValue = $state('');

	const triggerCategory = $derived(
		categoryValue
			? categoryOptions.find((c) => c.value === categoryValue)?.label
			: 'Pick a category',
	);

	const triggerPriority = $derived(
		priorityValue
			? priorityOptions.find((p) => p.value === priorityValue)?.label
			: 'Choose priority level',
	);
</script>

<Dialog.Content class="sm:max-w-[425px] bg-neutral-100">
	<Dialog.Header>
		<Dialog.Title>Add New Task</Dialog.Title>
		<Dialog.Description>
			<p>Write down what needs to be done for your wedding journey.</p>
		</Dialog.Description>
	</Dialog.Header>
	<div class="flex flex-col gap-4 py-4">
		<div class="flex flex-col items-start gap-2">
			<Label
				for="taskName"
				class="text-right">Task Title *</Label
			>
			<Input
				id="taskName"
				placeholder="e.g. Book the photographer"
				class="col-span-3"
			/>
		</div>
		<div class="flex flex-col gap-2">
			<Label
				for="taskDescription"
				class="text-right">Description</Label
			>
			<Textarea
				id="taskDescription"
				placeholder="Add details or notes (optional)"
				class="col-span-3"
			/>
		</div>
		<div class="flex flex-col gap-2">
			<Label
				for="taskCategory"
				class="text-right">Category</Label
			>
			<Select.Root
				type="single"
				name="taskCategory"
				bind:value={categoryValue}
			>
				<Select.Trigger class="w-full">
					{triggerCategory}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						{#each categoryOptions as category (category.value)}
							<Select.Item
								value={category.value}
								label={category.label}
							>
								{category.label}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		</div>
		<div class="flex flex-col gap-2">
			<Label
				for="taskPriority"
				class="text-right">Priority</Label
			>
			<Select.Root
				type="single"
				name="taskPriority"
				bind:value={priorityValue}
			>
				<Select.Trigger class="w-full">
					{triggerPriority}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						{#each priorityOptions as priority (priority.value)}
							<Select.Item
								value={priority.value}
								label={priority.label}
							>
								{priority.label}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		</div>
		<div class="flex flex-col gap-2">
			<Label
				for="taskDue"
				class="text-right">Due Date</Label
			>
			<Input
				type="date"
				id="taskDue"
				class="w-full"
				placeholder="Select date..."
			/>
		</div>
	</div>
	<Dialog.Footer>
		<Button type="submit">Add Task</Button>
	</Dialog.Footer>
</Dialog.Content>
