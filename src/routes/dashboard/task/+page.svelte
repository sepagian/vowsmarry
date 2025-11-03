<script lang="ts">
	import SectionCards from '$lib/components/section/section-cards.svelte';
	import TaskTable from '$lib/components/table/task-table.svelte';

	import { tasksStore } from '$lib/stores/tasks';
	import { onMount } from 'svelte';

	const overviewTitle = 'Task Overview';
	let { data } = $props();

	onMount(() => {
		if (data.tasks && data.tasks.length > 0) {
			tasksStore.set(data.tasks);
		}
	});

	let overviewCards = $derived(() => {
		return [
			{
				title: data.stats.tasksCount.toString(),
				description: 'Total',
				actionClass: 'i-lucide:badge-info',
				actionColor: 'bg-blue-500 text-white',
				footer: 'Updated just now',
			},
			{
				title: data.stats.pendingTasksCount.toString(),
				description: 'Pending',
				actionClass: 'i-lucide:badge-minus',
				actionColor: 'bg-gray-500 text-white',
				footer: 'Updated just now',
			},
			{
				title: data.stats.onProgressTasksCount.toString(),
				description: 'On Progress',
				actionClass: 'i-lucide:badge-alert',
				actionColor: 'bg-yellow-500 text-white',
				footer: 'Updated just now',
			},
			{
				title: data.stats.completedTasksCount.toString(),
				description: 'Completed',
				actionClass: 'i-lucide:badge-check',
				actionColor: 'bg-green-500 text-white',
				footer: 'Updated just now',
			},
		];
	});
</script>

<div class="flex flex-1 flex-col gap-4 py-4 max-w-screen-xl mx-auto">
	<SectionCards
		{overviewCards}
		{overviewTitle}
	/>
	<div class="flex flex-col gap-4">
		<div class="flex flex-col gap-2">
			<TaskTable {data} />
		</div>
	</div>
</div>
