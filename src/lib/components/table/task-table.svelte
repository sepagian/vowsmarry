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
	import * as Table from '$lib/components/ui/table/index';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as ButtonGroup from '$lib/components/ui/button-group/index';
	import { Button, buttonVariants } from '$lib/components/ui/button/index';
	import { Input } from '$lib/components/ui/input/index';
	import {
		FlexRender,
		createSvelteTable,
		renderComponent,
		renderSnippet,
	} from '$lib/components/ui/data-table/index';
	import TaskTableCheckbox from './task-table-checkbox.svelte';
	import TaskTableActions from './task-table-actions.svelte';
	import TaskTableDesc from './task-table-desc.svelte';
	import TaskTablePriority from './task-table-priority.svelte';
	import TaskTableActionsGroup from './task-table-actions-group.svelte';
	import DialogTask from '../dialog/dialog-task.svelte';
	import { tasksStore } from '$lib/stores/tasks';
	import type { Task } from '$lib/types';
	import { invalidateAll } from '$app/navigation';
	import { CrudToasts } from '$lib/utils/crud-toasts';

	let { data } = $props();
	let open = $state(false);

	// Server action functions
	async function updateTaskStatus(taskId: string, newStatus: Task['status']) {
		try {
			// Optimistic update
			const originalTask = $tasksStore.find((task) => task.id === taskId);
			tasksStore.update((tasks) => {
				const taskIndex = tasks.findIndex((task) => task.id === taskId);
				if (taskIndex !== -1) {
					tasks[taskIndex] = { ...tasks[taskIndex], status: newStatus };
				}
				return [...tasks];
			});

			const formData = new FormData();
			formData.append('id', taskId);
			formData.append('status', newStatus);

			const response = await fetch('?/updateStatus', {
				method: 'POST',
				body: formData,
			});

			const result = await response.json();

			if (result.type === 'success') {
				CrudToasts.success('update', 'task');
				await invalidateAll();
			} else {
				// Revert optimistic update on error
				if (originalTask) {
					tasksStore.update((tasks) => {
						const taskIndex = tasks.findIndex((task) => task.id === taskId);
						if (taskIndex !== -1) {
							tasks[taskIndex] = originalTask;
						}
						return [...tasks];
					});
				}
				CrudToasts.error('update', result.error || 'Failed to update task status', 'task');
			}
		} catch (error) {
			console.error('Status update error:', error);
			CrudToasts.error('update', 'Network error occurred', 'task');
		}
	}

	async function deleteTask(taskId: string) {
		try {
			const formData = new FormData();
			formData.append('id', taskId);

			const response = await fetch('?/delete', {
				method: 'POST',
				body: formData,
			});

			const result = await response.json();

			if (result.type === 'success') {
				CrudToasts.success('delete', 'task');
				await invalidateAll();
			} else {
				CrudToasts.error('delete', result.error || 'Failed to delete task', 'task');
			}
		} catch (error) {
			console.error('Delete error:', error);
			CrudToasts.error('delete', 'Network error occurred', 'task');
		}
	}

	async function updateTask(taskId: string, updatedData: any) {
		try {
			const formData = new FormData();
			formData.append('id', taskId);
			formData.append('description', updatedData.description);
			formData.append('category', updatedData.category);
			formData.append('priority', updatedData.priority);
			formData.append('status', updatedData.status);
			formData.append('date', updatedData.date);

			const response = await fetch('?/update', {
				method: 'POST',
				body: formData,
			});

			const result = await response.json();

			if (result.type === 'success') {
				await invalidateAll();
			} else {
				throw new Error(result.error || 'Failed to update task');
			}
		} catch (error) {
			console.error('Update error:', error);
			throw error;
		}
	}

	const columns: ColumnDef<Task>[] = [
		{
			id: 'select',
			cell: ({ row }) =>
				renderComponent(TaskTableCheckbox, {
					checked: row.original.status === 'completed',
					onCheckedChange: async (value: unknown) => {
						const isCompleted = !!value;
						const newStatus: Task['status'] = isCompleted ? 'completed' : 'pending';
						await updateTaskStatus(row.original.id, newStatus);
					},
					'aria-label': 'Mark as completed',
				}),
			enableSorting: false,
			enableHiding: false,
		},
		{
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
					category: row.original.category,
					description: row.original.description,
					status: row.original.status,
				}),
		},
		{
			id: 'dueDate',
			accessorKey: 'dueDate',
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

				const dateValue = row.getValue('dueDate');
				const formattedDate = new Date(dateValue as string).toLocaleDateString('id-ID', {
					day: '2-digit',
					month: 'short',
					year: 'numeric',
				});

				return renderSnippet(dateSnippet, formattedDate);
			},
		},
		{
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
					priority: row.original.priority,
				}),
		},

		{
			id: 'status',
			accessorKey: 'status',
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
					status: row.original.status,
					onChange: async (newStatus: Task['status']) => {
						await updateTaskStatus(row.original.id, newStatus);
					},
				}),
		},
		{
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
					data,
					onUpdate: updateTask,
					onDelete: deleteTask,
				}),
		},
	];

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let rowSelection = $state<RowSelectionState>({});
	let columnVisibility = $state<VisibilityState>({});

	let table = $derived(
		createSvelteTable({
			get data() {
				return $tasksStore;
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
		}),
	);
</script>

<div class="w-full px-4">
	<div class="flex items-center justify-between pb-4 gap-2">
		<Input
			placeholder="Search tasks"
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
							bind:checked={() => column.getIsVisible(), (v) => column.toggleVisibility(!!v)}
						>
							{column.id}
						</DropdownMenu.CheckboxItem>
					{/each}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
			<Dialog.Root bind:open>
				<Dialog.Trigger class={buttonVariants({ variant: 'outline', size: 'default' })}>
					<div class="i-lucide:plus p-2"></div>
					<span class="hidden lg:inline">Add Task</span>
				</Dialog.Trigger>
				<DialogTask
					{data}
					bind:open
				/>
			</Dialog.Root>
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
