<script lang="ts">
	import SectionCards from '$lib/components/section/section-cards.svelte';
	import SectionBudget from '$lib/components/section/section-budget.svelte';
	import { buttonVariants } from '$lib/components/ui/button/index';
	import { expensesState } from '$lib/stores/expenses.svelte';
	import { formatLastUpdate, formatCurrency, calculateDaysUntil } from '$lib/utils/format-utils';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Pagination } from '$lib/components/ui/pagination';

	const overviewTitle = 'Wedding Overview';

	let { data } = $props();

	const weddingDate = data.workspace?.weddingDate ? new Date(data.workspace.weddingDate) : null;
	const daysUntilWedding = $derived(calculateDaysUntil(weddingDate));

	// Pagination state derived from URL
	let currentPage = $derived(Number(page.url.searchParams.get('page')) || 1);
	let limit = $derived(Number(page.url.searchParams.get('limit')) || 10);

	// Handle page change
	function handlePageChange(newPage: number) {
		const url = new URL(page.url);
		if (newPage !== 1) {
			url.searchParams.set('page', newPage.toString());
		} else {
			url.searchParams.delete('page');
		}
		goto(url.toString(), { replaceState: true, noScroll: true });
	}

	// Update store whenever data changes (including after invalidation)
	// Pass workspace ID to ensure data consistency when workspace changes
	$effect(() => {
		if (data.expenses) {
			const workspaceId = data.workspace?.id || null;

			// Clear store if workspace changed to prevent stale data
			if (!expensesState.isWorkspace(workspaceId)) {
				expensesState.clearWorkspace();
			}

			expensesState.set((data.expenses as any).list || data.expenses, workspaceId);
		}
	});

	let overviewCards = $derived([
		{
			title: data.stats.taskCount.toString(),
			description: 'Tasks',
			action: 'Total',
			footer: formatLastUpdate(data.update.taskUpdate),
		},
		{
			title: formatCurrency(data.stats.expensePaidAmount),
			description: 'Budget Spent',
			action: 'Total',
			footer: formatLastUpdate(data.update.expenseUpdate),
		},
		{
			title: data.stats.documentCount.toString(),
			description: 'Documents',
			action: 'Total',
			footer: formatLastUpdate(data.update.documentUpdate),
		},
		{
			title: data.stats.vendorCount.toString(),
			description: 'Vendors',
			action: 'Total',
			footer: formatLastUpdate(data.update.vendorUpdate),
		},
	]);
</script>

<div class="flex flex-1 flex-col gap-2 py-4 max-w-screen-xl mx-auto">
	<div class="flex justify-between gap-2 px-4 align-center">
		<div class="flex flex-col gap-2">
			{#if data.workspace}
				{@const groomName = data.workspace.groomName}
				{@const brideName = data.workspace.brideName}
				{#if groomName && brideName}
					<h1 class="text-2xl font-semibold">{groomName} & {brideName}'s Wedding</h1>
				{:else}
					<h1 class="text-2xl font-semibold">Welcome back, {data.user.firstName}!</h1>
				{/if}
				<p class="text-muted-foreground">
					{#if daysUntilWedding !== null}
						{#if daysUntilWedding === 0}
							Today is the big day! 🎉
						{:else if daysUntilWedding === 1}
							Tomorrow is the big day! 🎉
						{:else if daysUntilWedding > 0}
							{daysUntilWedding} days until your wedding
						{:else}
							Celebrating your marriage
						{/if}
					{:else}
						Planning your perfect wedding together
					{/if}
				</p>
			{:else}
				<h1 class="text-2xl font-semibold">Welcome back, {data.user.firstName}!</h1>
				<p class="text-muted-foreground">Let's start planning your perfect wedding!</p>
			{/if}
		</div>
	</div>

	<SectionCards
		{overviewCards}
		{overviewTitle}
	/>
	<SectionBudget {data} />

	{#if data.expenses && (data.expenses as any).pagination}
		<div class="flex justify-center mt-4">
			<Pagination
				count={(data.expenses as any).pagination.total}
				perPage={limit}
				page={currentPage}
				onPageChange={handlePageChange}
			/>
		</div>
	{/if}
</div>
