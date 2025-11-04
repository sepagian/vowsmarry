<script lang="ts">
	import TaskTableEdit from './task-table-edit.svelte';
	import TaskTableDelete from './task-table-delete.svelte';

	let { task, data, onUpdate, onDelete } = $props<{
		task: any;
		data: any;
		onUpdate: (taskId: string, updatedData: any) => Promise<void>;
		onDelete: (taskId: string) => Promise<void>;
	}>();
</script>

<div class="flex gap-2">
	<TaskTableEdit
		{task}
		{data}
		{onUpdate}
	/>
	<TaskTableDelete
		taskId={task.id}
		taskDescription={task.description}
		{onDelete}
	/>
</div>
