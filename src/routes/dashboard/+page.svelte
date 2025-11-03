<script lang="ts">
	import SectionCards from '$lib/components/section/section-cards.svelte';
	import SectionTodo from '$lib/components/section/section-todo.svelte';
	import SectionBudget from '$lib/components/section/section-budget.svelte';
	import { expensesStore } from '$lib/stores/expenses';
	import { onMount } from 'svelte';

	const overviewTitle = 'Wedding Overview';

	let { data } = $props();
	const weddingDate = data.wedding?.weddingDate ? new Date(data.wedding.weddingDate) : null;
	const daysUntilWedding = weddingDate
		? Math.ceil((weddingDate.getTime() - new Date().getTime()) / 86400000)
		: null;

	onMount(() => {
		if (data.expenses && data.expenses.length > 0) {
			expensesStore.set(data.expenses);
		}
	});

	let overviewCards = $derived(() => {
		return [
			{
				title: data.stats.taskCount.toString(),
				description: 'Tasks',
				action: 'Total',
				footer: 'Updated just now',
			},
			{
				title: parseFloat(data.stats.expensePaidAmount).toLocaleString('id-ID', {
					style: 'currency',
					currency: 'IDR',
					minimumFractionDigits: 0,
					maximumFractionDigits: 0,
				}),
				description: 'Budget Spent',
				action: 'Total',
				footer: 'Updated just now',
			},
			{
				title: data.stats.documentCount.toString(),
				description: 'Documents',
				action: 'Total',
				footer: 'Updated just now',
			},
			{
				title: data.stats.vendorCount.toString(),
				description: 'Vendors',
				action: 'Total',
				footer: 'Updated just now',
			},
		];
	});
</script>

<div class="flex flex-1 flex-col gap-4 py-4 max-w-screen-xl mx-auto">
	<div class="flex flex-col gap-2 px-4">
		<h1 class="text-2xl font-semibold">Welcome back, {data.user.firstName}!</h1>
		<p class="text-muted-foreground">
			{#if data.wedding}
				Plan your wedding with {data.wedding.partnerName || 'your partner'}
				{#if weddingDate}
					- {daysUntilWedding} days to go!
				{/if}
			{:else}
				Let's start planning your perfect wedding!
			{/if}
		</p>
	</div>
	<SectionCards
		{overviewCards}
		{overviewTitle}
	/>
	<SectionTodo {data} />
	<SectionBudget {data} />
</div>
