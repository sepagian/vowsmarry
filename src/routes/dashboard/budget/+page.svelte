<script lang="ts">
	import * as Card from '$lib/components/ui/card/index';
	import SectionCards from '$lib/components/section/section-cards.svelte';
	import ExpenseTable from '$lib/components/table/expense-table.svelte';
	import ExampleChart from '$lib/components/chart/example-chart.svelte';

	const overviewCards = [
		{
			title: 'Rp20.000.000',
			description: 'Total Budget',
			actionClass: 'i-lucide:scale',
			actionColor: 'bg-green-500 text-white',
			footer: 'Updated 5 minutes ago',
		},
		{
			title: 'Rp10.000.000',
			description: 'Amount Spent',
			actionClass: 'i-lucide:scroll-text',
			actionColor: 'bg-yellow-500 text-white',
			footer: 'Updated 10 minutes ago',
		},
		{
			title: 'Rp10.000.000',
			description: 'Budget Remaining',
			actionClass: 'i-lucide:book-open-check',
			actionColor: 'bg-blue-500 text-white',
			footer: 'Updated 2 minutes ago',
		},
	];

	const overviewTitle = 'Budget Overview';

	const expenseData: Expense[] = [
		{
			id: '1',
			date: '2025-08-01',
			category: 'Venue',
			description: 'Down payment for venue booking',
			amount: 5_000_000,
			status: 'Paid' as const,
		},
		{
			id: '2',
			date: '2025-08-03',
			category: 'Venue',
			description: 'Final payment for venue',
			amount: 3_000_000,
			status: 'Pending' as const,
		},
		{
			id: '3',
			date: '2025-08-05',
			category: 'Catering',
			description: 'Initial catering deposit',
			amount: 3_000_000,
			status: 'Paid' as const,
		},
		{
			id: '4',
			date: '2025-08-08',
			category: 'Catering',
			description: 'Second catering installment',
			amount: 2_000_000,
			status: 'Paid' as const,
		},
		{
			id: '5',
			date: '2025-08-10',
			category: 'Decoration',
			description: 'Stage setup & flowers',
			amount: 3_500_000,
			status: 'Paid' as const,
		},
		{
			id: '6',
			date: '2025-08-12',
			category: 'Photography',
			description: 'Pre-wedding photoshoot',
			amount: 2_000_000,
			status: 'Paid' as const,
		},
		{
			id: '7',
			date: '2025-08-15',
			category: 'Photography',
			description: 'Wedding day coverage',
			amount: 2_000_000,
			status: 'Pending' as const,
		},
		{
			id: '8',
			date: '2025-08-18',
			category: 'Attire',
			description: 'Bride and groom outfits',
			amount: 4_000_000,
			status: 'Paid' as const,
		},
		{
			id: '9',
			date: '2025-08-20',
			category: 'Entertainment',
			description: 'Live band booking',
			amount: 2_500_000,
			status: 'Paid' as const,
		},
		{
			id: '10',
			date: '2025-08-22',
			category: 'Makeup & Hair',
			description: 'Bridal makeup package',
			amount: 3_000_000,
			status: 'Pending' as const,
		},
	];
</script>

<div class="flex flex-1 flex-col gap-4 py-4 max-w-screen-xl mx-auto">
	<SectionCards
		{overviewCards}
		{overviewTitle}
		columns={3}
	/>
	<div class="sm:grid sm:grid-cols-3 gap-4 flex flex-col px-4">
		<div class="flex flex-col col-span-2 gap-2">
			<h2 class="text-base font-bold text-neutral-600">Spending Distribution</h2>
			<Card.Root class="@container/card shrink-0 p-0 gap-0 shadow-none">
				<Card.Content class="py-2 px-2">
					<ExampleChart />
				</Card.Content>
			</Card.Root>
		</div>
		<div class="flex flex-col col-span-1 row-span-3 gap-2 pb-4">
			<h2 class="text-base font-bold text-neutral-600">Budget Categories</h2>
			<Card.Root class="@container/card p-6 h-full gap-0 shadow-none">
				<Card.Header class="p-0">
					<Card.Title>Card Title</Card.Title>
				</Card.Header>
				<Card.Content class="p-0">
					<p>Card Content</p>
				</Card.Content>
			</Card.Root>
		</div>
		<div class="flex flex-col col-span-2 gap-2">
			<h2 class="text-base font-bold text-neutral-600">Recent Activities</h2>
			<ExpenseTable data={expenseData} />
		</div>
	</div>
</div>
