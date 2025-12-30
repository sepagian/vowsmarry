<script lang="ts">
	import SectionCards from "$lib/components/section/section-cards.svelte";
	import TaskTable from "$lib/components/table/task-table.svelte";
	import { ConfirmDeleteDialog } from "$lib/components/ui/confirm-delete-dialog";

	import { tasksState } from "$lib/stores/tasks.svelte";
	import { formatDistanceToNow } from "date-fns";
	import { page } from "$app/state";
	import { goto } from "$app/navigation";
	import { Pagination } from "$lib/components/ui/pagination";

	const overviewTitle = "Task Overview";
	let { data } = $props();

	// Pagination state derived from URL
	let currentPage = $derived(Number(page.url.searchParams.get("page")) || 1);
	let limit = $derived(Number(page.url.searchParams.get("limit")) || 10);

	// Handle page change
	function handlePageChange(newPage: number) {
		const url = new URL(page.url);
		if (newPage !== 1) {
			url.searchParams.set("page", newPage.toString());
		} else {
			url.searchParams.delete("page");
		}
		goto(url.toString(), { replaceState: true, noScroll: true });
	}

	// Update store whenever data changes (including after invalidation)
	// Pass workspace ID to ensure data consistency when workspace changes
	$effect(() => {
		if (data.tasks) {
			const workspaceId = data.workspace?.id || null;

			// Clear store if workspace changed to prevent stale data
			if (!tasksState.isWorkspace(workspaceId)) {
				tasksState.clearWorkspace();
			}

			tasksState.set((data.tasks as any).list || data.tasks, workspaceId);
		}
	});

	let overviewCards = $derived([
		{
			title: tasksState.stats.total.toString(),
			description: "Total",
			actionClass: "i-lucide:badge-info",
			actionColor: "bg-blue-500 text-white",
			footer:
				data.taskStats.total && data.update.total
					? `Last updated ${formatDistanceToNow(new Date(data.update.total), { addSuffix: true })}`
					: "No data yet",
		},
		{
			title: tasksState.stats.pending.toString(),
			description: "Pending",
			actionClass: "i-lucide:badge-minus",
			actionColor: "bg-gray-500 text-white",
			footer:
				data.taskStats.pending && data.update.pending
					? `Last updated ${formatDistanceToNow(new Date(data.update.pending), { addSuffix: true })}`
					: "No data yet",
		},
		{
			title: tasksState.stats.inProgress.toString(),
			description: "On Progress",
			actionClass: "i-lucide:badge-alert",
			actionColor: "bg-yellow-500 text-white",
			footer:
				data.taskStats.onProgress && data.update.onProgress
					? `Last updated ${formatDistanceToNow(new Date(data.update.onProgress), { addSuffix: true })}`
					: "No data yet",
		},
		{
			title: tasksState.stats.completed.toString(),
			description: "Completed",
			actionClass: "i-lucide:badge-check",
			actionColor: "bg-green-500 text-white",
			footer:
				data.taskStats.completed && data.update.completed
					? `Last updated ${formatDistanceToNow(new Date(data.update.completed), { addSuffix: true })}`
					: "No data yet",
		},
	]);
</script>

<ConfirmDeleteDialog/>

<div class="flex flex-1 flex-col gap-4 py-4 max-w-screen-xl mx-auto">
	<SectionCards {overviewCards} {overviewTitle}/>

	<div class="grid grid-cols-3 gap-4 flex flex-col">
		<div class="flex flex-col col-span-3 gap-2">
			<TaskTable {data}/>
		</div>
	</div>

	{#if data.tasks && (data.tasks as any).pagination}
		<div class="flex justify-center mt-4">
			<Pagination
				count={(data.tasks as any).pagination.total}
				perPage={limit}
				page={currentPage}
				onPageChange={handlePageChange}
			/>
		</div>
	{/if}
</div>
