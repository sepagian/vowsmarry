<script lang="ts">
	import SectionCards from '$lib/components/section/section-cards.svelte';
	import TaskTable from '$lib/components/table/task-table.svelte';
	import { tasksStore } from '$lib/stores/tasks';

	const overviewTitle = 'Task Overview';

	// Reactive overviewCards based on the store
	$: overviewCards = (() => {
		const tasks = $tasksStore;
		const completed = tasks.filter((task) => task.status === 'completed').length;
		const pending = tasks.filter((task) => task.status === 'pending').length;
		const onprogress = tasks.filter((task) => task.status === 'on-progress').length;
		const total = tasks.length;

		return [
			{
				title: total.toString(),
				description: 'Total',
				actionClass: 'i-lucide:badge-info',
				actionColor: 'bg-blue-500 text-white',
				footer: 'Updated just now',
			},
			{
				title: pending.toString(),
				description: 'Pending',
				actionClass: 'i-lucide:badge-minus',
				actionColor: 'bg-gray-500 text-white',
				footer: 'Updated just now',
			},
			{
				title: onprogress.toString(),
				description: 'On Progress',
				actionClass: 'i-lucide:badge-alert',
				actionColor: 'bg-yellow-500 text-white',
				footer: 'Updated just now',
			},
			{
				title: completed.toString(),
				description: 'Completed',
				actionClass: 'i-lucide:badge-check',
				actionColor: 'bg-green-500 text-white',
				footer: 'Updated just now',
			},
		];
	})();
</script>

<div class="flex flex-1 flex-col gap-4 py-4 max-w-screen-xl mx-auto">
	<SectionCards
		{overviewCards}
		{overviewTitle}
		columns={4}
	/>
	<TaskTable />
</div>
