<script lang="ts">
    import type { Task } from "$lib/types";
    import TaskTableEdit from "./task-table-edit.svelte";
    import TaskTableDelete from "./task-table-delete.svelte";

    let { task, data, onDelete } = $props<{
        task: Task;
        data: unknown;
        onDelete: (taskId: string) => Promise<void>;
    }>();
</script>

<div class="flex gap-2 justify-center">
    <TaskTableEdit {task} {data} />
    <TaskTableDelete
        taskId={task.id}
        taskDescription={task.taskDescription}
        {onDelete}
    />
</div>
