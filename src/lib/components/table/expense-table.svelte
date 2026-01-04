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

  import DialogExpense from "$lib/components/dialog/dialog-expense.svelte";
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

  import {
    useDeleteExpense,
    useUpdatePaymentStatus,
  } from "$lib/mutation/expense";
  import { useExpenses } from "$lib/query/expense";
  import type { Expense } from "$lib/types";

  import { createExpenseColumns } from "./expense-table-columns";

  let { data, allowAdd, readonly = false } = $props();
  let expenseDialogOpen = $state(false);

  const expensesQuery = useExpenses();
  const updatePaymentStatusMutation = useUpdatePaymentStatus();
  const deleteExpenseMutation = useDeleteExpense();

  async function updatePaymentStatus(
    expenseId: string,
    newPaymentStatus: Expense["expensePaymentStatus"],
  ): Promise<void> {
    try {
      await updatePaymentStatusMutation.mutateAsync({
        id: expenseId,
        paymentStatus: newPaymentStatus,
      });
      CrudToasts.success("update", "expense");
    } catch (error) {
      console.error("Payment status update error:", error);
      CrudToasts.error("update", "Failed to update payment status", "expense");
    }
  }

  async function deleteExpense(expenseId: string): Promise<void> {
    try {
      await deleteExpenseMutation.mutateAsync(expenseId);
      CrudToasts.success("delete", "expense");
    } catch (error) {
      console.error("Delete error:", error);
      CrudToasts.error("delete", "Failed to delete expense", "expense");
    }
  }

  const columns = createExpenseColumns({
    onPaymentStatusChange: readonly ? undefined : updatePaymentStatus,
    onDelete: readonly ? undefined : deleteExpense,
    data,
    readonly,
  });

  let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
  let sorting = $state<SortingState>([]);
  let columnFilters = $state<ColumnFiltersState>([]);
  let rowSelection = $state<RowSelectionState>({});
  let columnVisibility = $state<VisibilityState>({});

  let expenses = $derived(expensesQuery.data?.expenses ?? []);

  let table = $derived(
    createSvelteTable({
      get data() {
        return expenses;
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

<div class="w-full">
  <div class="flex items-center justify-between pb-4 gap-2">
    <Input
      placeholder="Search expenses"
      value={(table.getState().globalFilter as string) ?? ""}
      oninput={(e: Event) => {
        const val = (e.currentTarget as HTMLInputElement).value;
        table.getColumn("expenseDescription")?.setFilterValue(val);
      }}
      onchange={(e: Event) => {
        const val = (e.currentTarget as HTMLInputElement).value;
        table.getColumn("expenseDescription")?.setFilterValue(val);
      }}
      class="max-w-sm border-1 border-neutral-200"
    />
    <ButtonGroup>
      <DropdownMenu>
        <DropdownMenuTrigger>
          {#snippet child({ props })}
            <Button {...props} variant="outline" class="ml-auto items-center">
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
                () => column.getIsVisible(), (v) => column.toggleVisibility(!!v)
              }
            >
              {column.id}
            </DropdownMenuCheckboxItem>
          {/each}
        </DropdownMenuContent>
      </DropdownMenu>
      {#if allowAdd}
        <Dialog bind:open={expenseDialogOpen}>
          <DialogTrigger
            class={buttonVariants({
              variant: "outline",
              size: "default",
            })}
          >
            <div class="i-lucide:plus p-2"></div>
            <span class="hidden lg:inline">Add Expense</span>
          </DialogTrigger>
          <DialogExpense {data} bind:open={expenseDialogOpen} />
        </Dialog>
      {/if}
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
              No expenses in this workspace yet. Add your first expense to track
              your budget!
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
