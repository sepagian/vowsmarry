<script lang="ts">
	import { categoryOptions } from '$lib/constants/constants';
	import type { Task } from '$lib/types';

	export let description: Task['description'];
	export let category: Task['category'];
	export let status: Task['status'];

	function getCategoryData(category: Task['category']) {
		return (
			categoryOptions.find((c) => c.value === category) ?? {
				color: 'bg-gray-200 text-gray-800',
				icon: 'i-lucide:more-horizontal',
			}
		);
	}
	function getCategoryLabel(category: Task['category']) {
		return categoryOptions.find((s) => s.value === category)?.label ?? category;
	}

	$: categoryData = getCategoryData(category);
</script>

<span class="flex items-center gap-2">
	<span
		class="inline-flex items-center rounded-md px-2 py-1 text-xs gap-2 font-medium {categoryData.color}"
	>
		<div class={categoryData.icon}></div>
		{getCategoryLabel(category)}
	</span>
	<span class={status === 'completed' ? 'line-through text-gray-500' : ''}>{description}</span>
</span>
