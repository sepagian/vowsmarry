<script>
	import SectionCards from '$lib/components/section/section-cards.svelte';
	import SectionTodo from '$lib/components/section/section-todo.svelte';
	import SectionBudget from '$lib/components/section/section-budget.svelte';

	const overviewCards = [
		{
			title: '12',
			description: 'Tasks',
			action: 'Total',
			footer: 'Updated 5 minutes ago',
		},
		{
			title: 'Rp20.000.000',
			description: 'Budget',
			action: 'Remaining',
			footer: 'Updated 10 minutes ago',
		},
		{
			title: '5',
			description: 'Document',
			action: 'Active',
			footer: 'Updated 2 minutes ago',
		},
		{
			title: '4',
			description: 'Vendor',
			action: 'Total',
			footer: 'Updated 1 hour ago',
		},
	];

	const overviewTitle = 'Project Overview';

	const budgetCards = [
		{
			title: 'Rp50.000.000',
			description: 'Total Budget',
			footer: 'Updated 1 day ago',
		},
		{
			title: 'Rp30.000.000',
			description: 'Amount Spent',
			footer: 'Updated 2 days ago',
		},
		{
			title: 'Rp20.000.000',
			description: 'Remaining Budget',
			footer: 'Updated 3 days ago',
		},
	];

	const tasks = [
		{
			title: 'Create Wedding Website',
			description: 'Design and launch the wedding website for guests.',
		},
		{
			title: 'Send Invitations',
			description: 'Mail out physical invitations to all guests.',
		},
		{
			title: 'Book Photographer',
			description: 'Finalize and book the wedding photographer.',
		},
	];
</script>

<div class="flex flex-1 flex-col gap-8 py-4 max-w-screen-xl mx-auto">
	<SectionCards
		{overviewCards}
		{overviewTitle}
		columns={4}
	/>
	<SectionTodo {tasks} />
	<SectionBudget {budgetCards} />
</div>
