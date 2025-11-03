<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import { expenseStatusOptions } from '$lib/constants/constants';
	import type { Expense } from '$lib/types';

	export let status: Expense['paymentStatus'];
	export let onChange: (newPaymentStatus: Expense['paymentStatus']) => void;
	function getActionData(paymentStatus: Expense['paymentStatus']) {
		return (
			expenseStatusOptions.find((s) => s.value === paymentStatus) ?? {
				label: '-',
				color: 'bg-gray-200 text-gray-800',
				icon: 'i-lucide:minus',
			}
		);
	}

	$: statusData = getActionData(status);
</script>

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
		{#each expenseStatusOptions as s (s.value)}
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
