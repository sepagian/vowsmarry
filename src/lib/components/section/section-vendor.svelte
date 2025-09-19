<script lang="ts">
	import * as Dialog from '../ui/dialog/index';
	import * as DropdownMenu from '../ui/dropdown-menu/index';
	import { Input } from '../ui/input/index';
	import { Button, buttonVariants } from '../ui/button/index';
	import Board from '../dnd/board.svelte';
	import DialogVendor from '../dialog/dialog-vendor.svelte';

	let columnsData: ColumnType[] = [
		{
			id: 'c1',
			name: 'Booked',
			items: [
				{ id: '1', name: 'item41' },
				{ id: '2', name: 'item42' },
				{ id: '3', name: 'item43' },
				{ id: '4', name: 'item44' },
				{ id: '5', name: 'item45' },
				{ id: '6', name: 'item46' },
				{ id: '7', name: 'item47' },
				{ id: '8', name: 'item48' },
				{ id: '9', name: 'item49' },
			],
		},
		{
			id: 'c2',
			name: 'Contacted',
			items: [
				{ id: '10', name: 'item50' },
				{ id: '11', name: 'item51' },
			],
		},
		{
			id: 'c3',
			name: 'Negotiated',
			items: [{ id: '13', name: 'item52' }],
		},
		{
			id: 'c4',
			name: 'Completed',
			items: [{ id: '14', name: 'item53' }],
		},
	];
	function handleBoardUpdated(newColumnsData: ColumnType[]) {
		// if you wanted to update a database or a server, this is where you would do it
		columnsData = newColumnsData;
	}
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
