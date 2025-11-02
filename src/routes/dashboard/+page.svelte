<script lang="ts">
	import SectionCards from '$lib/components/section/section-cards.svelte';
	import SectionTodo from '$lib/components/section/section-todo.svelte';
	import SectionBudget from '$lib/components/section/section-budget.svelte';
	import { expensesStore } from '$lib/stores/expenses';
	import { onMount } from 'svelte';

	const overviewTitle = 'Project Overview';

	let { data } = $props();

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
	<SectionCards
		{overviewCards}
		{overviewTitle}
	/>
	<SectionTodo {data} />
	<SectionBudget {data} />
</div>
