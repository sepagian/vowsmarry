import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index';
import TaskTableCheckbox from './task-table-checkbox.svelte';
import TaskTableActions from './task-table-actions.svelte';
import TaskTableDesc from './task-table-desc.svelte';
import TaskTablePriority from './task-table-priority.svelte';
import TaskTableActionsGroup from './task-table-actions-group.svelte';
import type { Task } from '$lib/types';

/**
 * Configuration for creating task table columns
 */
export interface TaskColumnConfig {
	/** Callback for updating task status */
	onStatusChange: (taskId: string, newStatus: Task['taskStatus']) => Promise<void>;
	/** Callback for updating task data */
	onUpdate: (taskId: string, updatedData: Partial<Task>) => Promise<void>;
	/** Callback for deleting a task */
	onDelete: (taskId: string) => Promise<void>;
	/** Server data passed to action components */
	data: unknown;
}

/**
 * Creates the select/checkbox column for marking tasks as completed
 */
function createSelectColumn(
	onStatusChange: TaskColumnConfig['onStatusChange'],
): ColumnDef<Task> {
	return {
		id: 'select',
		cell: ({ row }) =>
			renderComponent(TaskTableCheckbox, {
				checked: row.original.taskStatus === 'completed',
				onCheckedChange: async (value: unknown) => {
					const isCompleted = !!value;
					const newStatus: Task['taskStatus'] = isCompleted ? 'completed' : 'pending';
					await onStatusChange(row.original.id as string, newStatus);
				},
				'aria-label': 'Mark as completed',
			}),
		enableSorting: false,
		enableHiding: false,
	};
}

/**
 * Creates the description column with category and status display
 */
function createDescriptionColumn(): ColumnDef<Task> {
	return {
		id: 'description',
		accessorKey: 'description',
		header: () => {
			const descriptionHeaderSnippet = createRawSnippet(() => {
				return { render: () => `<div class="font-semibold">Task Description</div>` };
			});
			return renderSnippet(descriptionHeaderSnippet, '');
		},
		enableHiding: false,
		cell: ({ row }) =>
			renderComponent(TaskTableDesc, {
				category: row.original.taskCategory,
				description: row.original.taskDescription,
				status: row.original.taskStatus,
			}),
	};
}

/**
 * Creates the due date column with formatted date display
 */
function createDueDateColumn(): ColumnDef<Task> {
	return {
		id: 'dueDate',
		accessorKey: 'taskDueDate',
		header: () => {
			const dateHeaderSnippet = createRawSnippet(() => {
				return {
					render: () => `<div class="font-semibold">Due Date</div>`,
				};
			});
			return renderSnippet(dateHeaderSnippet, '');
		},
		cell: ({ row }) => {
			const dateSnippet = createRawSnippet<[string]>((getDate) => {
				const date = getDate();
				return {
					render: () =>
						`<div class="flex flex-row gap-2 items-center"><div class="i-lucide:calendar"></div>${date}</div>`,
				};
			});

			const dateValue = row.original.taskDueDate;
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
 * Creates the priority column with visual priority indicator
 */
function createPriorityColumn(): ColumnDef<Task> {
	return {
		accessorKey: 'Priority',
		header: () => {
			const priorityHeaderSnippet = createRawSnippet(() => {
				return {
					render: () => `<div class="font-semibold">Priority</div>`,
				};
			});
			return renderSnippet(priorityHeaderSnippet, '');
		},
		cell: ({ row }) =>
			renderComponent(TaskTablePriority, {
				priority: row.original.taskPriority,
			}),
	};
}

/**
 * Creates the status column with dropdown for status changes
 */
function createStatusColumn(
	onStatusChange: TaskColumnConfig['onStatusChange'],
): ColumnDef<Task> {
	return {
		id: 'status',
		accessorKey: 'taskStatus',
		header: () => {
			const statusHeaderSnippet = createRawSnippet(() => {
				return {
					render: () => `<div class="font-semibold w-36">Status</div>`,
				};
			});
			return renderSnippet(statusHeaderSnippet, '');
		},
		enableHiding: false,
		cell: ({ row }) =>
			renderComponent(TaskTableActions, {
				status: row.original.taskStatus,
				onChange: async (newStatus: Task['taskStatus']) => {
					await onStatusChange(row.original.id as string, newStatus);
				},
			}),
	};
}

/**
 * Creates the actions column with edit and delete buttons
 */
function createActionsColumn(config: TaskColumnConfig): ColumnDef<Task> {
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
			renderComponent(TaskTableActionsGroup, {
				task: row.original,
				data: config.data,
				onUpdate: config.onUpdate,
				onDelete: config.onDelete,
			}),
	};
}

/**
 * Creates all column definitions for the task table
 * 
 * @param config - Configuration object containing callbacks and data
 * @returns Array of column definitions for TanStack Table
 * 
 * @example
 * ```ts
 * const columns = createTaskColumns({
 *   onStatusChange: updateTaskStatus,
 *   onUpdate: updateTask,
 *   onDelete: deleteTask,
 *   data: pageData
 * });
 * ```
 */
export function createTaskColumns(config: TaskColumnConfig): ColumnDef<Task>[] {
	return [
		createSelectColumn(config.onStatusChange),
		createDescriptionColumn(),
		createDueDateColumn(),
		createPriorityColumn(),
		createStatusColumn(config.onStatusChange),
		createActionsColumn(config),
	];
}
