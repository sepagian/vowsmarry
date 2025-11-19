<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index';
	import { tasksStore } from '$lib/stores/tasks';

	let { taskId, taskDescription, onDelete } = $props<{
		taskId: string;
		taskDescription: string;
		onDelete: (taskId: string) => Promise<void>;
	}>();

	let isDeleting = $state(false);
	let dialogOpen = $state(false);

	async function handleDelete() {
		isDeleting = true;

		// Optimistic update - remove from store immediately
		const originalTasks = $tasksStore;
		tasksStore.update((tasks) => tasks.filter((task) => task.id !== taskId));

		try {
			await onDelete(taskId);
			// Close dialog on success
			dialogOpen = false;
		} catch (error) {
			// Revert optimistic update on error
			tasksStore.set(originalTasks);
		} finally {
			isDeleting = false;
		}
	}
</script>

<AlertDialog.Root bind:open={dialogOpen}>
	<AlertDialog.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="outline"
				size="sm"
				class="h-8 w-8 p-0"
				title="Delete task"
			>
				<div class="i-lucide:trash-2 h-4 w-4 text-red-500"></div>
			</Button>
		{/snippet}
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete Task</AlertDialog.Title>
			<AlertDialog.Description>
				Are you sure you want to delete "{taskDescription}"? This action cannot be undone.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				onclick={handleDelete}
				disabled={isDeleting}
				class="bg-red-600 hover:bg-red-700"
			>
				{isDeleting ? 'Deleting...' : 'Delete'}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
