<script lang="ts">
	import * as Card from '$lib/components/ui/card/index';
	import * as Tabs from '$lib/components/ui/tabs/index';
	import SectionCards from '$lib/components/section/section-cards.svelte';
	import SectionSavings from '$lib/components/section/section-savings.svelte';
	import ExpenseTable from '$lib/components/table/expense-table.svelte';
	import { formatDistanceToNow } from 'date-fns';

	import { expensesState } from '$lib/stores/expenses.svelte';

	let { data } = $props();

	// Update store whenever data changes (including after invalidation)
	// Pass workspace ID to ensure data consistency when workspace changes
	$effect(() => {
		if (data.expenses) {
			const workspaceId = data.workspace?.id || null;
			
			// Clear store if workspace changed to prevent stale data
			if (!expensesState.isWorkspace(workspaceId)) {
				expensesState.clearWorkspace();
			}
			
			expensesState.set(data.expenses, workspaceId);
		}
	});

	let overviewCards = $derived([
			{
				title: parseFloat(data.financeStats.plannedBudget).toLocaleString('id-ID', {
					style: 'currency',
					currency: 'IDR',
					minimumFractionDigits: 0,
					maximumFractionDigits: 0,
				}),
				description: 'Planned Budget',
				actionClass: 'i-lucide:wallet',
				actionColor: 'bg-green-500 text-white',
				footer: data.update.planned
					? `Last updated ${formatDistanceToNow(new Date(data.update.planned), { addSuffix: true })}`
					: 'No data yet',
			},
			{
				title: parseFloat(data.financeStats.totalSavings).toLocaleString('id-ID', {
					style: 'currency',
					currency: 'IDR',
					minimumFractionDigits: 0,
					maximumFractionDigits: 0,
				}),
				description: 'Savings',
				actionClass: 'i-lucide:piggy-bank',
				actionColor: 'bg-pink-500 text-white',
				footer: `${data.financeStats.savingProgress}% saved`,
			},
			{
				title: parseFloat(data.financeStats.budgetSpent).toLocaleString('id-ID', {
					style: 'currency',
					currency: 'IDR',
					minimumFractionDigits: 0,
					maximumFractionDigits: 0,
				}),
				description: 'Expenses',
				actionClass: 'i-lucide:receipt-text',
				actionColor: 'bg-yellow-500 text-white',
				footer: data.update.spent
					? `Last updated ${formatDistanceToNow(new Date(data.update.spent), { addSuffix: true })}`
					: 'No data yet',
			},

			{
				title: parseFloat(data.financeStats.budgetRemaining).toLocaleString('id-ID', {
					style: 'currency',
					currency: 'IDR',
					minimumFractionDigits: 0,
					maximumFractionDigits: 0,
				}),
				description: 'Remaining Balance',
				actionClass: 'i-lucide:chart-area',
				actionColor: 'bg-blue-500 text-white',
				footer: data.update.spent
					? `Last updated ${formatDistanceToNow(new Date(data.update.spent), { addSuffix: true })}`
					: 'No data yet',
			},
		]);

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
						<Card.Content class="p-0"></Card.Content>
					</Card.Root>
				</div>
			</div>
		</Tabs.Content>
		<Tabs.Content value="savings">
			<SectionSavings />
		</Tabs.Content>
	</Tabs.Root>
</div>

