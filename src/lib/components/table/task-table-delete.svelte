<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import { confirmDelete, ConfirmDeleteDialog} from '$lib/components/ui/confirm-delete-dialog';

	let { taskId, taskDescription, onDelete } = $props<{
		taskId: string;
		taskDescription: string;
		onDelete: (taskId: string) => Promise<void>;
	}>();
</script>

<Button
	variant="outline"
	size="sm"
	class="h-8 w-8 p-0"
	title="Delete task"
	onclick={() => {
		confirmDelete({
			title: 'Delete Task',
			description: `Are you sure you want to delete "${taskDescription}"? This action cannot be undone.`,
			onConfirm: async () => {
				await onDelete(taskId);
			}
		});
	}}
>
	<div class="i-lucide:trash-2 h-4 w-4 text-red-500"></div>
</Button>
