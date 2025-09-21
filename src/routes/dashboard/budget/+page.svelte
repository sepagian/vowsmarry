<script lang="ts">
	import * as Card from '$lib/components/ui/card/index';
	import SectionCards from '$lib/components/section/section-cards.svelte';
	import ExpenseTable from '$lib/components/table/expense-table.svelte';
	import ExampleChart from '$lib/components/chart/example-chart.svelte';
	import ExpenseCategories from '$lib/components/chart/expense-categories.svelte';
	import { expensesStore } from '$lib/stores/expenses';

	$: overviewCards = (() => {
		const expenses = $expensesStore;
		const totalbudget = 100_000_000;
		const totalspent = expenses
			.filter((e) => e['payment-status'] === 'paid')
			.reduce((sum, e) => sum + e.amount, 0);
		const remainingbudget = totalbudget - totalspent;

		return [
			{
				title: totalbudget.toLocaleString('id-ID', {
					style: 'currency',
					currency: 'IDR',
					minimumFractionDigits: 0,
					maximumFractionDigits: 0,
				}),
				description: 'Total Budget',
				actionClass: 'i-lucide:book-down',
				actionColor: 'bg-green-500 text-white',
				footer: 'Updated just now',
			},
			{
				title: totalspent.toLocaleString('id-ID', {
					style: 'currency',
					currency: 'IDR',
					minimumFractionDigits: 0,
					maximumFractionDigits: 0,
				}),
				description: 'Budget Spent',
				actionClass: 'i-lucide:book-up',
				actionColor: 'bg-yellow-500 text-white',
				footer: 'Updated just now',
			},
			{
				title: remainingbudget.toLocaleString('id-ID', {
					style: 'currency',
					currency: 'IDR',
					minimumFractionDigits: 0,
					maximumFractionDigits: 0,
				}),
				description: 'Budget Remaining',
				actionClass: 'i-lucide:book-text',
				actionColor: 'bg-blue-500 text-white',
				footer: 'Updated just now',
			},
		];
	})();

	const overviewTitle = 'Budget Overview';

	const sampleData: Record<Category, number> = {
		accommodation: 1000000,
		catering: 0,
		decoration: 0,
		entertainment: 0,
		'makeup-attire': 0,
		paperwork: 0,
		'photo-video': 0,
		venue: 0,
		miscellaneous: 0,
	};

	const totalBudget = 20000000; // Rp 20M
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
					<ExampleChart
						data={sampleData}
						{totalBudget}
					/>
				</Card.Content>
			</Card.Root>
		</div>
		<div class="flex flex-col col-span-1 row-span-3 gap-2 pb-4">
			<h2 class="text-base font-bold text-neutral-600">Expense by Category</h2>
			<Card.Root class="@container/card p-6 h-full gap-2 shadow-none">
				<Card.Content class="p-0">
					<ExpenseCategories />
				</Card.Content>
			</Card.Root>
		</div>
		<div class="flex flex-col col-span-2 gap-2">
			<h2 class="text-base font-bold text-neutral-600">Recent Expenses</h2>
			<ExpenseTable data={$expensesStore} />
		</div>
	</div>
</div>
