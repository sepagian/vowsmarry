<script lang="ts">
	import { formatDistanceToNow } from 'date-fns';

	import SectionCards from '$lib/components/section/section-cards.svelte';
	import SectionSavings from '$lib/components/section/section-savings.svelte';
	import ExpenseTable from '$lib/components/table/expense-table.svelte';
	import { Card, CardContent } from '$lib/components/ui/card/index';
	import { ConfirmDeleteDialog } from '$lib/components/ui/confirm-delete-dialog';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs/index';

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
				title: Number.parseFloat(data.financeStats.plannedBudget).toLocaleString('id-ID', {
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
				title: Number.parseFloat(data.financeStats.totalSavings).toLocaleString('id-ID', {
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
				title: Number.parseFloat(data.financeStats.budgetSpent).toLocaleString('id-ID', {
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
				title: Number.parseFloat(data.financeStats.budgetRemaining).toLocaleString('id-ID', {
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

<ConfirmDeleteDialog />

<div class="flex flex-1 flex-col gap-2 py-4 max-w-screen-xl mx-auto">
	<SectionCards
		{overviewCards}
		{overviewTitle}
	/>
	<Tabs
		value="expense"
		class="px-4"
	>
		<TabsList class="w-full">
			<TabsTrigger value="expense">Expenses</TabsTrigger>
			<TabsTrigger value="savings">Savings</TabsTrigger>
		</TabsList>
		<TabsContent value="expense">
			<div class="grid grid-cols-3 gap-4 flex flex-col">
				<div class="flex flex-col col-span-3 lg:col-span-2 gap-2">
					<ExpenseTable
						{data}
						allowAdd={true}
					/>
				</div>
				<div class="flex flex-col col-span-3 lg:col-span-1 row-span-3 gap-2 pb-4">
					<Card class="@container/card p-6 h-full gap-2 shadow-none">
						<CardContent class="p-0"></CardContent>
					</Card>
				</div>
			</div>
		</TabsContent>
		<TabsContent value="savings">
			<SectionSavings />
		</TabsContent>
	</Tabs>
</div>
