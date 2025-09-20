<script lang="ts">
	import * as Dialog from '../ui/dialog/index';
	import * as DropdownMenu from '../ui/dropdown-menu/index';
	import { Input } from '../ui/input/index';
	import { Button, buttonVariants } from '../ui/button/index';
	import Board from '../dnd/board.svelte';
	import DialogVendor from '../dialog/dialog-vendor.svelte';
	import { vendorsColumns, type ColumnType, type Item } from '$lib/stores/vendors';

	let columnsData: ColumnType[];

	// Subscribe to the store
	const unsubscribe = vendorsColumns.subscribe((value) => {
		columnsData = value;
	});

	function handleBoardUpdated(newColumnsData: ColumnType[]) {
		// Update the store
		vendorsColumns.set(newColumnsData);
	}

	// Cleanup on destroy
	import { onDestroy } from 'svelte';
	onDestroy(unsubscribe);
</script>

<div class="flex flex-col gap-4 px-4">
	<div class="flex items-center gap-4">
		<Input
			placeholder="Search vendors"
			type="search"
			class="max-w-sm border-1 border-neutral-200"
		/>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button
						{...props}
						variant="outline"
						class="ml-auto items-center"
					>
						<div class="i-lucide:columns-2"></div>
						View
						<div class="i-lucide:chevron-down ml-2"></div>
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end"></DropdownMenu.Content>
		</DropdownMenu.Root>
		<Dialog.Root>
			<Dialog.Trigger class={buttonVariants({ variant: 'outline', size: 'default' })}>
				<div class="i-lucide:plus p-2"></div>
				<span class="hidden lg:inline">Add Vendor</span>
			</Dialog.Trigger>
			<DialogVendor />
		</Dialog.Root>
	</div>
	<Board
		columns={columnsData}
		onFinalUpdate={handleBoardUpdated}
	/>
</div>

<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
	}
</style>
