<script lang="ts">
    import {
        type ColumnFiltersState,
        getCoreRowModel,
        getFilteredRowModel,
        getPaginationRowModel,
        getSortedRowModel,
        type PaginationState,
        type RowSelectionState,
        type SortingState,
        type VisibilityState,
    } from "@tanstack/table-core";

    import DialogTask from "$lib/components/dialog/dialog-task.svelte";
    import { Button, buttonVariants } from "$lib/components/ui/button/index";
    import { ButtonGroup } from "$lib/components/ui/button-group/index";
    import {
        createSvelteTable,
        FlexRender,
    } from "$lib/components/ui/data-table/index";
    import { Dialog, DialogTrigger } from "$lib/components/ui/dialog/index";
    import {
        DropdownMenu,
        DropdownMenuCheckboxItem,
        DropdownMenuContent,
        DropdownMenuTrigger,
    } from "$lib/components/ui/dropdown-menu/index";
    import { Input } from "$lib/components/ui/input/index";
    import {
        Table,
        TableBody,
        TableCell,
        TableHead,
        TableHeader,
        TableRow,
    } from "$lib/components/ui/table/index";

    import { CrudToasts } from "$lib/utils/toasts";

    import { useDeleteTask, useUpdateTaskStatus } from "$lib/mutation/task";
    import { useTasks } from "$lib/query/task";
    import type { Task } from "$lib/types";

    import { createTaskColumns } from "./task-table-columns";

    let { data } = $props();
    let open = $state(false);

    const taskQuery = useTasks();

    const updateTaskStatusMutation = useUpdateTaskStatus();
    const deleteTaskMutation = useDeleteTask();

    async function updateTaskStatus(
        taskId: string,
        newStatus: Task["taskStatus"],
    ): Promise<void> {
        try {
            await updateTaskStatusMutation.mutateAsync({
                id: taskId,
                status: newStatus,
            });
            CrudToasts.success("update", "task");
        } catch (error) {
            console.error("Status update error:", error);
            CrudToasts.error("update", "Failed to update task status", "task");
        }
    }

    async function deleteTask(taskId: string): Promise<void> {
        try {
            await deleteTaskMutation.mutateAsync(taskId);
            CrudToasts.success("delete", "task");
        } catch (error) {
            console.error("Delete error:", error);
            CrudToasts.error("delete", "Failed to delete task", "task");
        }
    }

    const columns = createTaskColumns({
        onStatusChange: updateTaskStatus,
        onDelete: deleteTask,
        data,
    });

    let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
    let sorting = $state<SortingState>([]);
    let columnFilters = $state<ColumnFiltersState>([]);
    let rowSelection = $state<RowSelectionState>({});
    let columnVisibility = $state<VisibilityState>({});

    let tasks = $derived(taskQuery.data?.tasks || []);

    let table = $derived(
        createSvelteTable({
            get data() {
                return tasks;
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
                if (typeof updater === "function") {
                    pagination = updater(pagination);
                } else {
                    pagination = updater;
                }
            },
            onSortingChange: (updater) => {
                if (typeof updater === "function") {
                    sorting = updater(sorting);
                } else {
                    sorting = updater;
                }
            },
            onColumnFiltersChange: (updater) => {
                if (typeof updater === "function") {
                    columnFilters = updater(columnFilters);
                } else {
                    columnFilters = updater;
                }
            },
            onColumnVisibilityChange: (updater) => {
                if (typeof updater === "function") {
                    columnVisibility = updater(columnVisibility);
                } else {
                    columnVisibility = updater;
                }
            },
            onRowSelectionChange: (updater) => {
                if (typeof updater === "function") {
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
            value={(table.getState().globalFilter as string) ?? ""}
            oninput={(e: Event) => {
                const val = (e.currentTarget as HTMLInputElement).value;
                table.getColumn("taskDescription")?.setFilterValue(val);
            }}
            onchange={(e: Event) => {
                const val = (e.currentTarget as HTMLInputElement).value;
                table.getColumn("taskDescription")?.setFilterValue(val);
            }}
            class="max-w-sm border-1 border-neutral-200"
        />
        <ButtonGroup>
            <DropdownMenu>
                <DropdownMenuTrigger>
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
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {#each table
                        .getAllColumns()
                        .filter((col) => col.getCanHide()) as column (column)}
                        <DropdownMenuCheckboxItem
                            bind:checked={
                                () => column.getIsVisible(),
                                (v) => column.toggleVisibility(!!v)
                            }
                        >
                            {column.id}
                        </DropdownMenuCheckboxItem>
                    {/each}
                </DropdownMenuContent>
            </DropdownMenu>
            <Dialog bind:open>
                <DialogTrigger
                    class={buttonVariants({
                        variant: "outline",
                        size: "default",
                    })}
                >
                    <div class="i-lucide:plus p-2"></div>
                    <span class="hidden lg:inline">Add Task</span>
                </DialogTrigger>
                <DialogTask {data} bind:open />
            </Dialog>
        </ButtonGroup>
    </div>
    <div class="rounded-md border">
        <Table>
            <TableHeader>
                {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
                    <TableRow>
                        {#each headerGroup.headers as header (header.id)}
                            <TableHead class="[&:has([role=checkbox])]:pl-3">
                                {#if !header.isPlaceholder}
                                    <FlexRender
                                        content={header.column.columnDef.header}
                                        context={header.getContext()}
                                    />
                                {/if}
                            </TableHead>
                        {/each}
                    </TableRow>
                {/each}
            </TableHeader>
            <TableBody>
                {#each table.getRowModel().rows as row (row.original.id)}
                    <TableRow data-state={row.getIsSelected() && "selected"}>
                        {#each row.getVisibleCells() as cell (cell.id)}
                            <TableCell class="[&:has([role=checkbox])]:pl-3">
                                <FlexRender
                                    content={cell.column.columnDef.cell}
                                    context={cell.getContext()}
                                />
                            </TableCell>
                        {/each}
                    </TableRow>
                {:else}
                    <TableRow>
                        <TableCell
                            colspan={columns.length}
                            class="h-24 text-center text-muted-foreground"
                        >
                            No tasks in this workspace yet. Create your first
                            task to get started!
                        </TableCell>
                    </TableRow>
                {/each}
            </TableBody>
        </Table>
    </div>
    <div class="flex items-center justify-end space-x-2 pt-4">
        <div class="text-muted-foreground flex-1 text-sm">
            {table.getFilteredRowModel().rows.length}row(s) displayed.
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
