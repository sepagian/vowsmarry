<script lang="ts">
  import { formatDistanceToNow } from "date-fns";

  import SectionCards from "$lib/components/section/section-cards.svelte";
  import TaskTable from "$lib/components/table/task-table.svelte";
  import { ConfirmDeleteDialog } from "$lib/components/ui/confirm-delete-dialog";

  import { getTaskStats } from "$lib/utils/task-stats";

  import { useTasks } from "$lib/query/task";

  const overviewTitle = "Task Overview";
  let { data } = $props();

  const taskQuery = useTasks();

  let taskStats = $derived(getTaskStats(taskQuery.data?.tasks || []));

  let overviewCards = $derived([
    {
      title: taskStats.total.toString(),
      description: "Total",
      actionClass: "i-lucide:badge-info",
      actionColor: "bg-blue-500 text-white",
      footer: taskQuery.data?.update?.total
        ? `Last updated ${formatDistanceToNow(new Date(taskQuery.data.update.total), { addSuffix: true })}`
        : "No data yet",
    },
    {
      title: taskStats.pending.toString(),
      description: "Pending",
      actionClass: "i-lucide:badge-minus",
      actionColor: "bg-gray-500 text-white",
      footer: taskQuery.data?.update?.pending
        ? `Last updated ${formatDistanceToNow(new Date(taskQuery.data.update.pending), { addSuffix: true })}`
        : "No data yet",
    },
    {
      title: taskStats.inProgress.toString(),
      description: "On Progress",
      actionClass: "i-lucide:badge-alert",
      actionColor: "bg-yellow-500 text-white",
      footer: taskQuery.data?.update?.onProgress
        ? `Last updated ${formatDistanceToNow(new Date(taskQuery.data.update.onProgress), { addSuffix: true })}`
        : "No data yet",
    },
    {
      title: taskStats.completed.toString(),
      description: "Completed",
      actionClass: "i-lucide:badge-check",
      actionColor: "bg-green-500 text-white",
      footer: taskQuery.data?.update?.completed
        ? `Last updated ${formatDistanceToNow(new Date(taskQuery.data.update.completed), { addSuffix: true })}`
        : "No data yet",
    },
  ]);

  let isLoading = $derived(taskQuery.isLoading);
</script>

<ConfirmDeleteDialog/>

<div class="flex flex-1 flex-col gap-4 py-4 max-w-screen-xl mx-auto">
  <SectionCards {overviewCards} {overviewTitle}/>

  <div class="grid grid-cols-3 gap-4 flex flex-col">
    <div class="flex flex-col col-span-3 gap-2">
      {#if isLoading}
        <div class="flex flex-col items-center justify-center h-full">
          <p class="mt-4 text-gray-500">Loading...</p>
        </div>
      {:else}
        <TaskTable {data}/>
      {/if}
    </div>
  </div>
</div>
