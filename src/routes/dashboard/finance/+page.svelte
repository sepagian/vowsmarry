<script lang="ts">
	import * as Card from '$lib/components/ui/card/index';
	import SectionCards from '$lib/components/section/section-cards.svelte';
	import ExpenseTable from '$lib/components/table/expense-table.svelte';
	import ExpenseCategories from '$lib/components/chart/expense-categories.svelte';
	import ExpenseChart from '$lib/components/chart/expense-chart.svelte';

	import { expensesStore } from '$lib/stores/expenses';

	let { data } = $props();

	let overviewCards = $derived(() => {
		const expenses = $expensesStore;
		const totalbudget = 100_000_000;
		const totalspent = expenses
			.filter((e) => e['payment-status'] === 'paid')
			.reduce((sum, e) => sum + e.amount, 0);
		const pendingSpent = expenses
			.filter((e) => e['payment-status'] === 'pending')
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
				title: pendingSpent.toLocaleString('id-ID', {
					style: 'currency',
					currency: 'IDR',
					minimumFractionDigits: 0,
					maximumFractionDigits: 0,
				}),
				description: 'Pending Payment',
				actionClass: 'i-lucide:book-x',
				actionColor: 'bg-gray-500 text-white',
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
	});

	const overviewTitle = 'Budget Overview';
</script>

<<<<<<< HEAD:src/routes/dashboard/finance/+page.svelte
<div class="flex flex-1 flex-col gap-2 py-4 max-w-screen-xl mx-auto">
=======
<div class="flex flex-1 flex-col gap-3 py-4 max-w-screen-xl mx-auto">
>>>>>>> dev:src/routes/dashboard/budget/+page.svelte
	<SectionCards
		{overviewCards}
		{overviewTitle}
	/>
	<div class="flex px-4">
		<ExpenseChart />
	</div>
	<div class="grid grid-cols-3 gap-4 flex flex-col px-4">
		<div class="flex flex-col col-span-3 lg:col-span-2 gap-2">
<<<<<<< HEAD:src/routes/dashboard/finance/+page.svelte
			<ExpenseTable {data} />
		</div>
		<div class="flex flex-col col-span-3 lg:col-span-1 row-span-3 gap-2 pb-4">
=======
			<h2 class="text-base font-bold text-neutral-600">Recent Expenses</h2>
			<ExpenseTable {data} />
		</div>
		<div class="flex flex-col col-span-3 lg:col-span-1 row-span-3 gap-2 pb-4">
			<h2 class="text-base font-bold text-neutral-600">Expense by Category</h2>
>>>>>>> dev:src/routes/dashboard/budget/+page.svelte
			<Card.Root class="@container/card p-6 h-full gap-2 shadow-none">
				<Card.Content class="p-0">
					<ExpenseCategories />
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</div>
