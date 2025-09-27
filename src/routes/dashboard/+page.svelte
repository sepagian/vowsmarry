<script lang="ts">
	import SectionCards from '$lib/components/section/section-cards.svelte';
	import SectionTodo from '$lib/components/section/section-todo.svelte';
	import SectionBudget from '$lib/components/section/section-budget.svelte';
	import { tasksStore } from '$lib/stores/tasks';
	import { vendorsStore } from '$lib/stores/vendors';
	import { documentsStore } from '$lib/stores/documents';
	import { expensesStore } from '$lib/stores/expenses';

	const overviewTitle = 'Project Overview';

	let { data } = $props();

	// Reactive overviewCards based on stores
	let overviewCards = $derived(() => {
		return [
			{
				title: $tasksStore.length.toString(),
				description: 'Tasks',
				action: 'Total',
				footer: 'Updated just now',
			},
			{
				title: `${$expensesStore
					.filter((e) => e['payment-status'] === 'paid')
					.reduce((sum, e) => sum + e.amount, 0)
					.toLocaleString('id-ID', {
						style: 'currency',
						currency: 'IDR',
						minimumFractionDigits: 0,
						maximumFractionDigits: 0,
					})}`,
				description: 'Budget Spent',
				action: 'Total',
				footer: 'Updated just now',
			},
			{
				title: $documentsStore.length.toString(),
				description: 'Documents',
				action: 'Total',
				footer: 'Updated just now',
			},
			{
				title: $vendorsStore.length.toString(),
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
		columns={4}
	/>
	<SectionTodo {data} />
	<SectionBudget />
</div>
