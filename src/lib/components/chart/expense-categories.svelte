<script lang="ts">
	import { SvelteMap } from 'svelte/reactivity';
	import { Progress } from '$lib/components/ui/progress';
	import { categoryOptions } from '$lib/constants/constants';
	import { expensesStore } from '$lib/stores/expenses';
	import type { Category } from '$lib/types';

	const totalBudget = 100_000_000;

	$: expensesData = (() => {
		const expenses = $expensesStore;
		const categoryMap = new SvelteMap<Category, number>();

		// Sum spent amounts per category for paid expenses only
		expenses
			.filter((expense) => expense['payment-status'] === 'paid')
			.forEach((expense) => {
				const current = categoryMap.get(expense.category as Category) || 0;
				categoryMap.set(expense.category as Category, current + expense.amount);
			});

		// Create data array with spent per category
		return categoryOptions.map((option) => ({
			category: option.label,
			spent: categoryMap.get(option.value) || 0,
		}));
	})();

	function percentage(spent: number) {
		return (spent / totalBudget) * 100;
	}

	function getCategoryIcon(categoryName: string) {
		const category = categoryOptions.find((option) => option.label === categoryName);
		return category ? category.icon : 'i-lucide:help-circle';
	}
</script>

<div class="flex flex-col gap-4">
	{#each expensesData as item (item.category)}
		<div>
			<div class="flex justify-between text-sm mb-1">
				<span class="flex items-center gap-2">
					<div class={getCategoryIcon(item.category)}></div>
					{item.category}
				</span>
				<span
					>{item.spent.toLocaleString('id-ID', {
						style: 'currency',
						currency: 'IDR',
						minimumFractionDigits: 0,
						maximumFractionDigits: 0,
					})} ({percentage(item.spent).toFixed(1)}%)</span
				>
			</div>
			<Progress
				value={percentage(item.spent)}
				max={100}
				class="[&[data-slot=progress]]:bg-blue-200 [&>[data-slot=progress-indicator]]:bg-blue-500"
			/>
		</div>
	{/each}
</div>
