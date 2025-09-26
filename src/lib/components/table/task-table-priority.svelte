<script lang="ts">
	import { priorityOptions } from '$lib/constants/constants';
	import type { Task } from '$lib/types';

	export let priority: Task['priority'];

	function getPriorityData(priority: Task['priority']) {
		return (
			priorityOptions.find((p) => p.value === priority) ?? {
				label: '-',
				color: 'bg-gray-200 text-gray-800',
				icon: 'i-lucide:minus',
			}
		);
	}

	$: priorityData = getPriorityData(priority);
</script>

{#if priority}
	<span
		class="inline-flex items-center rounded-md px-2 py-1 text-xs gap-2 font-medium {priorityData.color}"
	>
		<div class="{priorityData.icon} w-3 h-3"></div>
		{priorityData.label}
	</span>
{:else}
	<span class="text-gray-400">-</span>
{/if}
