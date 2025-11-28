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
	import { FlexRender, createSvelteTable } from '$lib/components/ui/data-table/index';
	import DialogTask from '../dialog/dialog-task.svelte';
	import { tasksState } from '$lib/stores/tasks.svelte';
	import type { Task } from '$lib/types';
	import { CrudToasts } from '$lib/utils/toasts';
	import { createFormDataWithId } from '$lib/utils/form-helpers';
	import { InvalidationService } from '$lib/utils/invalidation-helpers';
	import { createTaskColumns } from './task-table-columns';

	let { data } = $props();
	let open = $state(false);

	// Server action functions
	async function updateTaskStatus(taskId: string, newStatus: Task['taskStatus']): Promise<void> {
		try {
			// Optimistic update
			const originalTask = tasksState.findById(taskId);
			tasksState.update(taskId, { taskStatus: newStatus });

			const formData = createFormDataWithId(taskId, { status: newStatus });

			const response = await fetch('?/updateTaskStatus', {
				method: 'POST',
				body: formData,
			});

			const result = (await response.json()) as { type: string; error?: string };

			if (result.type === 'success') {
				CrudToasts.success('update', 'task');
				await InvalidationService.invalidateTask();
			} else {
				// Revert optimistic update on error
				if (originalTask) {
					tasksState.update(taskId, { taskStatus: originalTask.taskStatus });
				}
				CrudToasts.error('update', result.error || 'Failed to update task status', 'task');
			}
		} catch (error) {
			console.error('Status update error:', error);
			CrudToasts.error('update', 'Network error occurred', 'task');
		}
	}

	async function deleteTask(taskId: string): Promise<void> {
		try {
			const formData = createFormDataWithId(taskId);

			const response = await fetch('?/deleteTask', {
				method: 'POST',
				body: formData,
			});

			const result = (await response.json()) as { type: string; error?: string };

			if (result.type === 'success') {
				CrudToasts.success('delete', 'task');
				await InvalidationService.invalidateTask();
			} else {
				CrudToasts.error('delete', result.error || 'Failed to delete task', 'task');
			}
		} catch (error) {
			console.error('Delete error:', error);
			CrudToasts.error('delete', 'Network error occurred', 'task');
		}
	}

	async function updateTask(taskId: string, updatedData: Partial<Task>): Promise<void> {
		try {
			const formData = createFormDataWithId(taskId, {
				taskDescription: updatedData.taskDescription,
				taskCategory: updatedData.taskCategory,
				taskPriority: updatedData.taskPriority,
				taskStatus: updatedData.taskStatus,
				taskDueDate: updatedData.taskDueDate,
			});

			const response = await fetch('?/updateTask', {
				method: 'POST',
				body: formData,
			});

			const result = (await response.json()) as { type: string; error?: string };

			if (result.type === 'success') {
				await InvalidationService.invalidateTask();
			} else {
				throw new Error(result.error || 'Failed to update task');
			}
		} catch (error) {
			console.error('Update error:', error);
			throw error;
		}
	}

	const columns = createTaskColumns({
		onStatusChange: updateTaskStatus,
		onUpdate: updateTask,
		onDelete: deleteTask,
		data,
	});

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let rowSelection = $state<RowSelectionState>({});
	let columnVisibility = $state<VisibilityState>({});

	let table = $derived(
		createSvelteTable({
			get data() {
				return tasksState.tasks;
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
