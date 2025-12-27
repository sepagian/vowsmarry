<script lang="ts">
	import {
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
	import * as Table from '$lib/components/ui/table/index';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as ButtonGroup from '$lib/components/ui/button-group/index';
	import { Button, buttonVariants } from '$lib/components/ui/button/index';
	import { Input } from '$lib/components/ui/input/index';
	import { FlexRender, createSvelteTable } from '$lib/components/ui/data-table/index.js';
	import DialogExpense from '$lib/components/dialog/dialog-expense.svelte';
	import { expensesState } from '$lib/stores/expenses.svelte';
	import type { Expense } from '$lib/types';
	import { CrudToasts } from '$lib/utils/toasts';
	import { InvalidationService } from '$lib/utils/invalidation-helpers';
	import { createFormDataWithId } from '$lib/utils/form-helpers';
	import { createExpenseColumns } from './expense-table-columns';

	let { data, allowAdd } = $props();
	
	let expenseDialogOpen = $state(false);

	async function updatePaymentStatus(
		expenseId: string,
		newPaymentStatus: Expense['expensePaymentStatus'],
	) {
		try {
			// Optimistic update
			const originalExpense = expensesState.findById(expenseId);
			expensesState.update(expenseId, { expensePaymentStatus: newPaymentStatus });

			const formData = createFormDataWithId(expenseId, { paymentStatus: newPaymentStatus });

			const response = await fetch('?/updatePaymentStatus', {
				method: 'POST',
				body: formData,
			});

			const result = (await response.json()) as { type: string; error?: string };

			if (result.type === 'success') {
				CrudToasts.success('update', 'expense');
				await InvalidationService.invalidateExpense();
			} else {
				// Revert optimistic update on error
				if (originalExpense) {
					expensesState.update(expenseId, { expensePaymentStatus: originalExpense.expensePaymentStatus });
				}
				CrudToasts.error('update', result.error || 'Failed to update payment status', 'expense');
			}
		} catch (error) {
			CrudToasts.error('update', 'Network error occurred', 'expense');
		}
	}

	async function updateExpense() {
		// This function is passed to the actions group component
		// The actual update is handled by the form submission in the dialog
		await InvalidationService.invalidateExpense();
	}

	async function deleteExpense() {
		// This function is passed to the actions group component
		// The actual delete is handled by the delete dialog in the actions group
		await InvalidationService.invalidateExpense();
	}

	const columns = createExpenseColumns({
		onPaymentStatusChange: updatePaymentStatus,
		onUpdate: updateExpense,
		onDelete: deleteExpense,
		data,
	});

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let rowSelection = $state<RowSelectionState>({});
	let columnVisibility = $state<VisibilityState>({});

	const table = createSvelteTable({
		get data() {
			return expensesState.expenses;
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
	<div class="flex items-center justify-between pb-4 gap-2">
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
		<ButtonGroup.Root>
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
			{#if allowAdd}
				<Dialog.Root bind:open={expenseDialogOpen}>
					<Dialog.Trigger class={buttonVariants({ variant: 'outline', size: 'default' })}>
						<div class="i-lucide:plus p-2"></div>
						<span class="hidden lg:inline">Add Expense</span>
					</Dialog.Trigger>
					<DialogExpense {data} bind:open={expenseDialogOpen} />
				</Dialog.Root>
			{/if}
		</ButtonGroup.Root>
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
				{#each table.getRowModel().rows as row (row.original.id)}
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
							class="h-24 text-center text-muted-foreground">
							No expenses in this workspace yet. Add your first expense to track your budget!
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<div class="flex items-center justify-end space-x-2 pt-4">
		<div class="text-muted-foreground flex-1 text-sm">
			{table.getFilteredRowModel().rows.length} row(s) displayed.
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
