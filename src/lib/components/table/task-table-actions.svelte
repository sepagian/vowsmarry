<script lang="ts">
	import { statusOptions } from '$lib/constants/constants';
	import type { Task } from '$lib/types';

	export let status: Task['status'];

	function getStatusData(status: Task['status']) {
		return (
			statusOptions.find((s) => s.value === status) ?? {
				label: '-',
				color: 'bg-gray-200 text-gray-800',
				icon: 'i-lucide:minus',
			}
		);
	}

	$: statusData = getStatusData(status);
</script>

{#if status}
	<span
		class="inline-flex items-center rounded-md px-2 py-1 text-xs gap-2 font-medium {statusData.color}"
	>
		<div class="{statusData.icon} w-3 h-3"></div>
		{statusData.label}
	</span>
{:else}
	<span class="text-gray-400">-</span>
{/if}
