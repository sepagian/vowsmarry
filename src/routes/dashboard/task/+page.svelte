<script lang="ts">
	import SectionCards from '$lib/components/section/section-cards.svelte';
	import TaskTable from '$lib/components/table/task-table.svelte';

	const overviewCards = [
		{
			title: '2',
			description: 'Completed',
			actionClass: 'i-lucide:badge-check',
			actionColor: 'bg-green-500 text-white',
			footer: 'Updated 5 minutes ago',
		},
		{
			title: '5',
			description: 'Pending',
			actionClass: 'i-lucide:badge-minus',
			actionColor: 'bg-yellow-500 text-white',
			footer: 'Updated 10 minutes ago',
		},
		{
			title: '0',
			description: 'Overdue',
			actionClass: 'i-lucide:badge-alert',
			actionColor: 'bg-red-500 text-white',
			footer: 'Updated 2 minutes ago',
		},
		{
			title: '7',
			description: 'Total',
			actionClass: 'i-lucide:badge-info',
			actionColor: 'bg-blue-500 text-white',
			footer: 'Updated 1 hour ago',
		},
	];

	const overviewTitle = 'Task Overview';

	const data: Task[] = [
		{
			id: '1',
			title: 'Book guest accommodation',
			description: 'Reserve hotel rooms for out-of-town guests',
			category: 'accommodation' as const,
			priority: 'High' as const,
			status: 'Pending' as const,
			date: '2025-09-15',
		},
		{
			id: '2',
			title: 'Arrange catering menu',
			description: 'Finalize dishes and beverages with the catering service',
			category: 'catering' as const,
			priority: 'High' as const,
			status: 'Pending' as const,
			date: '2025-09-20',
		},
		{
			id: '3',
			title: 'Select floral decorations',
			description: 'Choose color palette and flower arrangements',
			category: 'decoration' as const,
			priority: 'Medium' as const,
			status: 'Pending' as const,
			date: '2025-09-25',
		},
		{
			id: '4',
			title: 'Book live band',
			description: 'Confirm entertainment for the reception party',
			category: 'entertainment' as const,
			priority: 'Low' as const,
			status: 'Pending' as const,
			date: '2025-09-28',
		},
		{
			id: '5',
			title: 'Bride’s makeup trial',
			description: 'Schedule hair and makeup rehearsal',
			category: 'makeup-attire' as const,
			priority: 'High' as const,
			status: 'Pending' as const,
			date: '2025-09-18',
		},
		{
			id: '6',
			title: 'Marriage paperwork',
			description: 'Submit documents to local registrar',
			category: 'paperwork' as const,
			priority: 'High' as const,
			status: 'Pending' as const,
			date: '2025-09-12',
		},
		{
			id: '7',
			title: 'Engagement photo shoot',
			description: 'Outdoor shoot at beach location',
			category: 'photo-video' as const,
			priority: 'Medium' as const,
			status: 'Pending' as const,
			date: '2025-09-22',
		},
		{
			id: '8',
			title: 'Confirm venue layout',
			description: 'Walkthrough with venue manager',
			category: 'venue' as const,
			priority: 'Medium' as const,
			status: 'Pending' as const,
			date: '2025-09-14',
		},
		{
			id: '9',
			title: 'Purchase wedding favors',
			description: 'Order custom souvenirs for guests',
			category: 'miscellaneous' as const,
			priority: 'Low' as const,
			status: 'Pending' as const,
			date: '2025-09-26',
		},
		{
			id: '10',
			title: 'Print invitation cards',
			description: 'Finalize design and print copies',
			category: 'paperwork' as const,
			priority: 'Medium' as const,
			status: 'Pending' as const,
			date: '2025-09-10',
		},
	];
</script>

<div class="flex flex-1 flex-col gap-4 py-4 max-w-screen-xl mx-auto">
	<SectionCards
		{overviewCards}
		{overviewTitle}
		columns={4}
	/>
	<TaskTable {data} />
</div>
