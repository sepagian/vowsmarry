<script lang="ts">
	import * as Card from '$lib/components/ui/card/index';
	import * as Select from '$lib/components/ui/select/index';
	import * as Dialog from '$lib/components/ui/dialog/index';
	import { Label } from '$lib/components/ui/label/index';
	import { Button, buttonVariants } from '$lib/components/ui/button/index';
	import DialogTask from '../dialog/dialog-task.svelte';

	let {
		tasks,
	}: {
		tasks: SimpleTask[];
	} = $props();

	const filterOptions: { value: Filter; label: string }[] = [
		{ value: 'all', label: 'All Tasks' },
		{ value: 'active', label: 'Active' },
		{ value: 'completed', label: 'Completed' },
	];

	let filter: Filter = $state('all');

	// Derived filtered tasks
	const filteredTasks = $derived(
		filter === 'all'
			? tasks
			: filter === 'active'
				? tasks.filter((t) => !t.done)
				: tasks.filter((t) => t.done),
	);

	const completedTasks = $derived(tasks.filter((t) => t.done));
	const allCompleted = $derived(tasks.length > 0 && completedTasks.length === tasks.length);

	function toggleTask(t: SimpleTask) {
		tasks = tasks.map((task) => (task.title === t.title ? { ...task, done: !task.done } : task));
	}
</script>

<div class="flex flex-col px-4 gap-2 pb-2">
	<!-- Header -->
	<div class="flex justify-between items-center">
		<h2 class="text-base font-bold text-neutral-600">Recent Tasks</h2>
		<div class="flex flex-1 items-center justify-end gap-4">
			<Select.Root
				type="single"
				name="taskFilter"
				bind:value={filter}
			>
				<Select.Trigger class="w-40 border border-neutral-300">
					{filterOptions.find((f) => f.value === filter)?.label}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						{#each filterOptions as f (f.value)}
							<Select.Item
								value={f.value}
								label={f.label}
							>
								{f.label}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>

			<Dialog.Root>
				<Dialog.Trigger class={buttonVariants({ variant: 'outline', size: 'default' })}>
					<div class="i-lucide:plus p-2"></div>
					<span class="hidden lg:inline">Add New Task</span>
				</Dialog.Trigger>
				<DialogTask />
			</Dialog.Root>
		</div>
	</div>

	<!-- Profile completion alert -->
	<div class="flex flex-col gap-4">
		<Card.Root class="@container/card flex flex-row justify-between items-center">
			<div class="w-full">
				<Card.Header>
					<Card.Title class="leading-6 text-base">Almost ready to plan your big day 🎉</Card.Title>
				</Card.Header>
				<Card.Content class="text-sm">
					<p>Complete your wedding profile to see tasks, invitations, and more.</p>
				</Card.Content>
			</div>
			<div class="w-fit justify-end flex px-6">
				<Button
					variant="outline"
					size="icon"
				>
					<div class="i-lucide:chevron-right"></div>
				</Button>
			</div>
		</Card.Root>

		<!-- Task list -->
		<div class="flex flex-col gap-4">
			{#if tasks.length === 0}
				<Label class="flex items-center justify-center h-12 gap-3 rounded-lg border p-3">
					You don’t have any tasks yet
				</Label>
			{:else if filter === 'completed' && filteredTasks.length === 0}
				<Label class="flex items-center justify-center h-12 gap-3 rounded-lg border p-3">
					You have not completed any task yet
				</Label>
			{:else if allCompleted && filter !== 'completed' && filter !== 'active'}
				<Label
					class="flex items-center justify-center h-12 gap-3 rounded-lg border p-3 bg-green-50 text-green-600"
				>
					🎉 All tasks completed! Time to celebrate 🎉
				</Label>
			{:else if filter === 'active' && filteredTasks.length === 0}
				<Label
					class="flex items-center justify-center h-12 gap-3 rounded-lg border p-3 bg-sky-50 text-sky-600"
				>
					You do not have any active task
				</Label>
			{/if}

			<!-- Always render tasks list if there are any filtered -->
			{#if filteredTasks.length > 0}
				{#each filteredTasks as task (task.title)}
					<Card.Root class="@container/card flex flex-row justify-between items-center">
						<div class="pl-6 flex items-center w-full">
							<input
								type="checkbox"
								checked={task.done}
								onchange={() => toggleTask(task)}
								class="mt-1 w-4 h-4 rounded border-neutral-300 text-primary focus:ring-primary"
							/>
							<div>
								<Card.Header>
									<Card.Title
										class={`leading-6 text-base ${task.done ? 'line-through text-neutral-400' : ''}`}
									>
										{task.title}
									</Card.Title>
								</Card.Header>
								<Card.Content class="text-sm">
									<p class={task.done ? 'line-through text-neutral-400' : ''}>
										{task.description}
									</p>
								</Card.Content>
							</div>
						</div>
					</Card.Root>
				{/each}
			{/if}
		</div>
	</div>
</div>
