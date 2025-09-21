<script lang="ts">
	import * as Card from '$lib/components/ui/card/index';
	import * as Dialog from '$lib/components/ui/dialog/index';
	import { Label } from '$lib/components/ui/label/index';
	import { Button, buttonVariants } from '$lib/components/ui/button/index';
	import { Checkbox } from '$lib/components/ui/checkbox/index';
	import DialogTask from '../dialog/dialog-task.svelte';
	import { tasksStore } from '$lib/stores/tasks';

	// Show 3 most recent tasks as SimpleTask
	const filteredTasks = $derived(() => {
		return $tasksStore
			.sort((a, b) => {
				const dateA = a.date ? new Date(a.date) : new Date(0);
				const dateB = b.date ? new Date(b.date) : new Date(0);
				return dateB.getTime() - dateA.getTime();
			})
			.slice(0, 3)
			.map(
				(t): SimpleTask => ({
					id: t.id,
					title: t.title,
					description: t.description,
					done: t.status === 'completed',
				}),
			);
	});

	function toggleTask(t: SimpleTask) {
		const newStatus: Task['status'] = t.done ? 'pending' : 'completed';
		tasksStore.update((ts) => {
			const taskIndex = ts.findIndex((task) => task.id === t.id);
			if (taskIndex !== -1) {
				ts[taskIndex] = { ...ts[taskIndex], status: newStatus };
			}
			return [...ts];
		});
	}
</script>

<div class="flex flex-col px-4 gap-2">
	<!-- Header -->
	<div class="flex justify-between items-center">
		<h2 class="text-base font-bold text-neutral-600">Recent Tasks</h2>
		<div class="flex flex-1 items-center justify-end gap-4">
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
		<Card.Root class="@container/card flex flex-row justify-between items-center shadow-none">
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
			{#if $tasksStore.length === 0}
				<Label class="flex items-center justify-center h-12 gap-3 rounded-lg border p-3">
					You don’t have any tasks yet
				</Label>
			{:else}
				{#each filteredTasks as task (task.id)}
					<Card.Root class="flex flex-row items-center gap-3 p-4">
						<Checkbox
							checked={task.done}
							onCheckedChange={() => toggleTask(task)}
							aria-label="Mark task as completed"
						/>
						<div class="flex-1">
							<Card.Title class="text-sm font-medium leading-5">{task.title}</Card.Title>
							{#if task.description}
								<Card.Description class="text-xs text-muted-foreground mt-1">
									{task.description}
								</Card.Description>
							{/if}
						</div>
					</Card.Root>
				{/each}
			{/if}
		</div>
	</div>
</div>
