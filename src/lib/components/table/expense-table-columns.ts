import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index';
import ExpenseTableDesc from './expense-table-desc.svelte';
import ExpenseTableActions from './expense-table-actions.svelte';
import ExpenseTableActionsGroup from './expense-table-actions-group.svelte';
import type { Expense } from '$lib/types';

/**
 * Configuration for creating expense table columns
 */
export interface ExpenseColumnConfig {
	/** Callback for updating payment status */
	onPaymentStatusChange: (expenseId: string, newStatus: Expense['expensePaymentStatus']) => Promise<void>;
	/** Callback for updating expense data */
	onUpdate: (expenseId: string, updatedData: Partial<Expense>) => Promise<void>;
	/** Callback for deleting an expense */
	onDelete: (expenseId: string) => Promise<void>;
	/** Server data passed to action components */
	data: unknown;
}

/**
 * Creates the description column with category and status display
 */
function createDescriptionColumn(): ColumnDef<Expense> {
	return {
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
				category: row.original.expenseCategory,
				description: row.original.expenseDescription,
				status: row.original['expensePaymentStatus'],
			}),
	};
}

/**
 * Creates the due date column with formatted date display
 */
function createDueDateColumn(): ColumnDef<Expense> {
	return {
		id: 'dueDate',
		accessorKey: 'expenseDueDate',
		header: () => {
			const amountHeaderSnippet = createRawSnippet(() => {
				return {
					render: () => `<div class="font-semibold">Date</div>`,
				};
			});
			return renderSnippet(amountHeaderSnippet, '');
		},
		cell: ({ row }) => {
			const dateSnippet = createRawSnippet<[string]>((getDate) => {
				const date = getDate();
				return {
					render: () =>
						`<div class="flex flex-row gap-2 items-center"><div class="i-lucide:calendar"></div>${date}</div>`,
				};
			});

			const dateValue = row.original.expenseDueDate;
			const formattedDate = new Date(dateValue as string).toLocaleDateString('id-ID', {
				day: '2-digit',
				month: 'short',
				year: 'numeric',
			});

			return renderSnippet(dateSnippet, formattedDate);
		},
	};
}

/**
 * Creates the amount column with currency formatting
 */
function createAmountColumn(): ColumnDef<Expense> {
	return {
		accessorKey: 'expenseAmount',
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
				formatter.format(Number.parseFloat(row.getValue('expenseAmount'))),
			);
		},
	};
}

/**
 * Creates the payment status column with dropdown for status changes
 */
function createPaymentStatusColumn(
	onPaymentStatusChange: ExpenseColumnConfig['onPaymentStatusChange'],
): ColumnDef<Expense> {
	return {
		id: 'status',
		accessorKey: 'expensePaymentStatus',
		header: () => {
			const statusHeaderSnippet = createRawSnippet(() => {
				return {
					render: () => `<div class="font-semibold w-32">Payment Status</div>`,
				};
			});
			return renderSnippet(statusHeaderSnippet, '');
		},
		enableHiding: false,
		cell: ({ row }) =>
			renderComponent(ExpenseTableActions, {
				status: row.original.expensePaymentStatus,
				onChange: async (newPaymentStatus: Expense['expensePaymentStatus']) => {
					await onPaymentStatusChange(row.original.id as string, newPaymentStatus);
				},
			}),
	};
}

/**
 * Creates the actions column with edit and delete buttons
 */
function createActionsColumn(config: ExpenseColumnConfig): ColumnDef<Expense> {
	return {
		id: 'actions',
		header: () => {
			const actionsHeaderSnippet = createRawSnippet(() => {
				return {
					render: () => `<div class="font-semibold text-center">Actions</div>`,
				};
			});
			return renderSnippet(actionsHeaderSnippet, '');
		},
		enableHiding: false,
		cell: ({ row }) =>
			renderComponent(ExpenseTableActionsGroup, {
				expense: row.original,
				data: config.data,
				onUpdate: config.onUpdate,
				onDelete: config.onDelete,
			}),
	};
}

/**
 * Creates all column definitions for the expense table
 * 
 * @param config - Configuration object containing callbacks and data
 * @returns Array of column definitions for TanStack Table
 * 
 * @example
 * ```ts
 * const columns = createExpenseColumns({
 *   onPaymentStatusChange: updatePaymentStatus,
 *   onUpdate: updateExpense,
 *   onDelete: deleteExpense,
 *   data: pageData
 * });
 * ```
 */
export function createExpenseColumns(config: ExpenseColumnConfig): ColumnDef<Expense>[] {
	return [
		createDescriptionColumn(),
		createDueDateColumn(),
		createAmountColumn(),
		createPaymentStatusColumn(config.onPaymentStatusChange),
		createActionsColumn(config),
	];
}
