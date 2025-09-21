<script lang="ts">
	import { categoryOptions } from '$lib/constants/constants';

	export let description: Expense['description'];
	export let category: Expense['category'];

	function getCategoryData(category: Expense['category']) {
		return (
			categoryOptions.find((c) => c.value === category) ?? {
				color: 'bg-gray-200 text-gray-800',
				icon: 'i-lucide:more-horizontal',
			}
		);
	}

	function getLabel(category: Expense['category']) {
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
