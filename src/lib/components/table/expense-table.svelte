<script lang="ts">
	import {
		type ColumnDef,
		type ColumnFiltersState,
		type PaginationState,
		type RowSelectionState,
		type SortingState,
		type VisibilityState,
		getCoreRowModel,
		getFilteredRowModel,
		getPaginationRowModel,
		getSortedRowModel,
	} from '@tanstack/table-core';
	import { createRawSnippet } from 'svelte';
	import ExpenseTableDesc from './expense-table-desc.svelte';
	import ExpenseTableActions from './expense-table-actions.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import {
		FlexRender,
		createSvelteTable,
		renderComponent,
		renderSnippet,
	} from '$lib/components/ui/data-table/index.js';
	import DialogExpense from '../dialog/dialog-expense.svelte';
	import { expensesStore } from '$lib/stores/expenses';

	const columns: ColumnDef<Expense>[] = [
		{
			accessorKey: 'description',
			header: () => {
				const amountHeaderSnippet = createRawSnippet(() => {
					return {
						render: () => `<div class="font-semibold">Description</div>`,
					};
				});
				return renderSnippet(amountHeaderSnippet, '');
			},
			cell: ({ row }) =>
				renderComponent(ExpenseTableDesc, {
					category: row.original.category,
					description: row.original.description,
					status: row.original['payment-status'],
				}),
		},
		{
			accessorKey: 'date',
			header: () => {
				const amountHeaderSnippet = createRawSnippet(() => {
					return {
						render: () => `<div class="font-semibold">Date</div>`,
					};
				});
				return renderSnippet(amountHeaderSnippet, '');
			},
			cell: ({ row }) => {
				const emailSnippet = createRawSnippet<[string]>((getDate) => {
					const date = getDate();
					return {
						render: () => `<div class="">${date}</div>`,
					};
				});

				return renderSnippet(emailSnippet, row.getValue('date'));
			},
		},
		{
			accessorKey: 'amount',
			header: () => {
				const amountHeaderSnippet = createRawSnippet(() => {
					return {
						render: () => `<div class="text-right font-semibold">Amount</div>`,
					};
				});
				return renderSnippet(amountHeaderSnippet, '');
			},
			cell: ({ row }) => {
				const amountCellSnippet = createRawSnippet<[string]>((getAmount) => {
					const amount = getAmount();
					return {
						render: () => `<div class="text-right">${amount}</div>`,
					};
				});
				const formatter = new Intl.NumberFormat('id-ID', {
					style: 'currency',
					currency: 'IDR',
					minimumFractionDigits: 0,
					maximumFractionDigits: 0,
				});

				return renderSnippet(
					amountCellSnippet,
					formatter.format(Number.parseFloat(row.getValue('amount'))),
				);
			},
		},
		{
			id: 'actions',
			accessorKey: 'status',
			header: () => {
				const actionsHeaderSnippet = createRawSnippet(() => {
					return {
						render: () => `<div class="font-semibold w-32">Payment Status</div>`,
					};
				});
				return renderSnippet(actionsHeaderSnippet, '');
			},
			enableHiding: false,
			cell: ({ row }) =>
				renderComponent(ExpenseTableActions, {
					status: row.original['payment-status'],
					onChange: (newStatus: Expense['payment-status']) => {
						expensesStore.update((expenses) => {
							const expenseIndex = expenses.findIndex((expense) => expense.id === row.original.id);
							if (expenseIndex !== -1) {
								expenses[expenseIndex] = { ...expenses[expenseIndex], 'payment-status': newStatus };
							}
							return [...expenses];
						});
					},
				}),
		},
	];

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 5 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let rowSelection = $state<RowSelectionState>({});
	let columnVisibility = $state<VisibilityState>({});

	const table = createSvelteTable({
		get data() {
			return $expensesStore;
		},
		columns,
		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			},
			get columnVisibility() {
				return columnVisibility;
			},
			get rowSelection() {
				return rowSelection;
			},
			get columnFilters() {
				return columnFilters;
			},
		},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		onColumnVisibilityChange: (updater) => {
			if (typeof updater === 'function') {
				columnVisibility = updater(columnVisibility);
			} else {
				columnVisibility = updater;
			}
		},
		onRowSelectionChange: (updater) => {
			if (typeof updater === 'function') {
				rowSelection = updater(rowSelection);
			} else {
				rowSelection = updater;
			}
		},
	});
</script>

<div class="w-full">
	<div class="flex items-center pb-4 gap-4">
		<Input
			placeholder="Search expenses"
			value={(table.getState().globalFilter as string) ?? ''}
			oninput={(e: Event) => {
				const val = (e.currentTarget as HTMLInputElement).value;
				table.getColumn('description')?.setFilterValue(val);
				table.getColumn('category')?.setFilterValue(val);
			}}
			onchange={(e: Event) => {
				const val = (e.currentTarget as HTMLInputElement).value;
				table.getColumn('description')?.setFilterValue(val);
				table.getColumn('category')?.setFilterValue(val);
			}}
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
			<DropdownMenu.Content align="end">
				{#each table.getAllColumns().filter((col) => col.getCanHide()) as column (column)}
					<DropdownMenu.CheckboxItem
						class="capitalize"
						bind:checked={() => column.getIsVisible(), (v) => column.toggleVisibility(!!v)}
					>
						{column.id}
					</DropdownMenu.CheckboxItem>
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
		<Dialog.Root>
			<Dialog.Trigger class={buttonVariants({ variant: 'outline', size: 'default' })}>
				<div class="i-lucide:plus p-2"></div>
				<span class="hidden lg:inline">Add Expense</span>
			</Dialog.Trigger>
			<DialogExpense />
		</Dialog.Root>
	</div>
	<div class="rounded-md border">
		<Table.Root>
			<Table.Header>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<Table.Head class="[&:has([role=checkbox])]:pl-3">
								{#if !header.isPlaceholder}
									<FlexRender
										content={header.column.columnDef.header}
										context={header.getContext()}
									/>
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body>
				{#each table.getRowModel().rows as row (row.id)}
					<Table.Row data-state={row.getIsSelected() && 'selected'}>
						{#each row.getVisibleCells() as cell (cell.id)}
							<Table.Cell class="[&:has([role=checkbox])]:pl-3">
								<FlexRender
									content={cell.column.columnDef.cell}
									context={cell.getContext()}
								/>
							</Table.Cell>
						{/each}
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell
							colspan={columns.length}
							class="h-24 text-center">No results.</Table.Cell
						>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<div class="flex items-center justify-end space-x-2 pt-4">
		<div class="text-muted-foreground flex-1 text-sm">
			{table.getFilteredSelectedRowModel().rows.length} of
			{table.getFilteredRowModel().rows.length} row(s) selected.
		</div>
		<div class="space-x-2">
			<Button
				variant="outline"
				size="sm"
				onclick={() => table.previousPage()}
				disabled={!table.getCanPreviousPage()}
			>
				Previous
			</Button>
			<Button
				variant="outline"
				size="sm"
				onclick={() => table.nextPage()}
				disabled={!table.getCanNextPage()}
			>
				Next
			</Button>
		</div>
	</div>
</div>
