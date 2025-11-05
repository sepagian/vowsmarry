<script lang="ts">
	import * as Card from '$lib/components/ui/card/index';
	import * as Tabs from '$lib/components/ui/tabs/index';
	import SectionCards from '$lib/components/section/section-cards.svelte';
	import SectionSavings from '$lib/components/section/section-savings.svelte';
	import ExpenseTable from '$lib/components/table/expense-table.svelte';
	import ExpenseCategories from '$lib/components/chart/expense-categories.svelte';
	import { onMount } from 'svelte';
	import { formatDistanceToNow } from 'date-fns';

	import { expensesStore } from '$lib/stores/expenses';

	let { data } = $props();

	onMount(() => {
		if (data.expenses && data.expenses.length > 0) {
			expensesStore.set(data.expenses);
		}
	});

	let overviewCards = $derived(() => {
		return [
			{
				title: parseFloat(data.stats.plannedBudget).toLocaleString('id-ID', {
					style: 'currency',
					currency: 'IDR',
					minimumFractionDigits: 0,
					maximumFractionDigits: 0,
				}),
				description: 'Planned Budget',
				actionClass: 'i-lucide:wallet',
				actionColor: 'bg-green-500 text-white',
				footer: `Last updated ${formatDistanceToNow(new Date(data.update.plannedBudgetUpdate), { addSuffix: true })}`,
			},
			{
				title: parseFloat(data.stats.totalSavings).toLocaleString('id-ID', {
					style: 'currency',
					currency: 'IDR',
					minimumFractionDigits: 0,
					maximumFractionDigits: 0,
				}),
				description: 'Savings',
				actionClass: 'i-lucide:piggy-bank',
				actionColor: 'bg-pink-500 text-white',
				footer: `${data.stats.savingProgress}% saved`,
			},
			{
				title: parseFloat(data.stats.budgetSpent).toLocaleString('id-ID', {
					style: 'currency',
					currency: 'IDR',
					minimumFractionDigits: 0,
					maximumFractionDigits: 0,
				}),
				description: 'Expenses',
				actionClass: 'i-lucide:receipt-text',
				actionColor: 'bg-yellow-500 text-white',
				footer: `Last updated ${formatDistanceToNow(new Date(data.update.budgetSpentUpdate), { addSuffix: true })}`,
			},

			{
				title: parseFloat(data.stats.budgetRemaining).toLocaleString('id-ID', {
					style: 'currency',
					currency: 'IDR',
					minimumFractionDigits: 0,
					maximumFractionDigits: 0,
				}),
				description: 'Remaining Balance',
				actionClass: 'i-lucide:chart-area',
				actionColor: 'bg-blue-500 text-white',
				footer: `Last updated ${formatDistanceToNow(new Date(data.update.budgetSpentUpdate), { addSuffix: true })}`,
			},
		];
	});

	const overviewTitle = 'Finances Overview';
</script>

<div class="flex flex-1 flex-col gap-2 py-4 max-w-screen-xl mx-auto">
	<SectionCards
		{overviewCards}
		{overviewTitle}
	/>
	<Tabs.Root
		value="expense"
		class="px-4"
	>
		<Tabs.List class="w-full">
			<Tabs.Trigger value="expense">Expenses</Tabs.Trigger>
			<Tabs.Trigger value="savings">Savings</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="expense">
			<div class="grid grid-cols-3 gap-4 flex flex-col">
				<div class="flex flex-col col-span-3 lg:col-span-2 gap-2">
					<ExpenseTable
						{data}
						allowAdd={true}
					/>
				</div>
				<div class="flex flex-col col-span-3 lg:col-span-1 row-span-3 gap-2 pb-4">
					<Card.Root class="@container/card p-6 h-full gap-2 shadow-none">
						<Card.Content class="p-0">
							<ExpenseCategories />
						</Card.Content>
					</Card.Root>
				</div>
			</div>
		</Tabs.Content>
		<Tabs.Content value="savings">
			<SectionSavings />
		</Tabs.Content>
	</Tabs.Root>
</div>
