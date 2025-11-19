<script lang="ts">
	import SectionCards from '$lib/components/section/section-cards.svelte';
	import TaskTable from '$lib/components/table/task-table.svelte';

	import { tasksStore } from '$lib/stores/tasks';
	import { formatDistanceToNow } from 'date-fns';

	const overviewTitle = 'Task Overview';
	let { data } = $props();

	// Update store whenever data changes (including after invalidation)
	$effect(() => {
		if (data.tasks) {
			tasksStore.set(data.tasks);
		}
	});

	let overviewCards = $derived(() => {
		return [
			{
				title: $tasksStore.length.toString(),
				description: 'Total',
				actionClass: 'i-lucide:badge-info',
				actionColor: 'bg-blue-500 text-white',
				footer: data.taskStats.total && data.update.total
					? `Last updated ${formatDistanceToNow(new Date(data.update.total), { addSuffix: true })}`
					: 'No data yet',
			},
			{
				title: $tasksStore.filter((task) => task.taskStatus === 'pending').length.toString(),
				description: 'Pending',
				actionClass: 'i-lucide:badge-minus',
				actionColor: 'bg-gray-500 text-white',
				footer: data.taskStats.pending && data.update.pending
					? `Last updated ${formatDistanceToNow(new Date(data.update.pending), { addSuffix: true })}`
					: 'No data yet',
			},
			{
				title: $tasksStore.filter((task) => task.taskStatus === 'on_progress').length.toString(),
				description: 'On Progress',
				actionClass: 'i-lucide:badge-alert',
				actionColor: 'bg-yellow-500 text-white',
				footer: data.taskStats.onProgress && data.update.onProgress
					? `Last updated ${formatDistanceToNow(new Date(data.update.onProgress), { addSuffix: true })}`
					: 'No data yet',
			},
			{
				title: $tasksStore.filter((task) => task.taskStatus === 'completed').length.toString(),
				description: 'Completed',
				actionClass: 'i-lucide:badge-check',
				actionColor: 'bg-green-500 text-white',
				footer: data.taskStats.completed && data.update.completed
					? `Last updated ${formatDistanceToNow(new Date(data.update.completed), { addSuffix: true })}`
					: 'No data yet',
			},
		];
	});
</script>

<div class="flex flex-1 flex-col gap-4 py-4 max-w-screen-xl mx-auto">
	<SectionCards
		{overviewCards}
		{overviewTitle}
	/>

	<div class="grid grid-cols-3 gap-4 flex flex-col">
		<div class="flex flex-col col-span-3 gap-2">
			<TaskTable {data} />
		</div>
	</div>
</div>
