<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import { statusOptions } from '$lib/constants/constants';
	import type { Task } from '$lib/types';

	export let status: Task['taskStatus'];
	export let onChange: (newStatus: Task['taskStatus']) => void;

	function getActionData(status: Task['taskStatus']) {
		return (
			statusOptions.find((s) => s.value === status) ?? {
				label: '-',
				color: 'bg-gray-200 text-gray-800',
				icon: 'i-lucide:minus',
			}
		);
	}

	$: statusData = getActionData(status);
</script>

{#if status}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			<div
				class="rounded-md px-3 inline-flex items-center gap-2 py-1 text-sm font-medium {statusData.color}"
			>
				<div class={statusData.icon}></div>
				{statusData.label}
				<div class="i-lucide:chevron-down"></div>
			</div>
		</DropdownMenu.Trigger>

		<DropdownMenu.Content class="bg-white">
			{#each statusOptions as s (s.value)}
				<DropdownMenu.Item
					class="flex items-center gap-2"
					onclick={() => onChange(s.value)}
				>
					{#if s.value === status}
						<div class="i-lucide:check h-4 w-4 text-gray-500"></div>
					{:else}
						<span class="h-4 w-4"></span>
					{/if}

					<span
						class={`inline-flex rounded-md items-center gap-2 px-2 py-1 text-xs font-medium ${s.color}`}
					>
						<div class={`${s.icon}`}></div>
						{s.label}
					</span>
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}
