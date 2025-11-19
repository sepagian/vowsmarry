<script lang="ts">
	import { categoryOptions } from '$lib/constants/constants';
	import type { Expense } from '$lib/types';

	export let description: Expense['expenseDescription'];
	export let category: Expense['expenseCategory'];

	function getCategoryData(category: Expense['expenseCategory']) {
		return (
			categoryOptions.find((c) => c.value === category) ?? {
				color: 'bg-gray-200 text-gray-800',
				icon: 'i-lucide:more-horizontal',
			}
		);
	}

	function getLabel(category: Expense['expenseCategory']) {
		return categoryOptions.find((s) => s.value === category)?.label ?? category;
	}

	$: categoryData = getCategoryData(category);
</script>

<span class="flex items-center gap-2">
	<span
		class="inline-flex items-center rounded-md px-2 py-1 text-xs gap-2 font-medium {categoryData.color}"
	>
		<div class={categoryData.icon}></div>
		{getLabel(category)}
	</span>
	<span>{description}</span>
</span>
