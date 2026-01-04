<script lang="ts">
  import { formatDistanceToNow } from "date-fns";

  import SectionCards from "$lib/components/section/section-cards.svelte";
  import SectionSavings from "$lib/components/section/section-savings.svelte";
  import ExpenseTable from "$lib/components/table/expense-table.svelte";
  import { Card, CardContent } from "$lib/components/ui/card/index";
  import { ConfirmDeleteDialog } from "$lib/components/ui/confirm-delete-dialog";
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "$lib/components/ui/tabs/index";

  import { useExpenses } from "$lib/query/expense";

  let { data } = $props();

  const expensesQuery = useExpenses();

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  let overviewCards = $derived([
    {
      title: formatter.format(
        Number.parseFloat(expensesQuery.data?.financeStats.plannedBudget ?? "0")
      ),
      description: "Planned Budget",
      actionClass: "i-lucide:wallet",
      actionColor: "bg-green-500 text-white",
      footer: expensesQuery.data?.update?.planned
        ? `Last updated ${formatDistanceToNow(
            new Date(expensesQuery.data.update.planned),
            {
              addSuffix: true,
            }
          )}`
        : "No data yet",
    },
    {
      title: formatter.format(
        Number.parseFloat(expensesQuery.data?.financeStats.totalSavings ?? "0")
      ),
      description: "Savings",
      actionClass: "i-lucide:piggy-bank",
      actionColor: "bg-pink-500 text-white",
      footer: `${expensesQuery.data?.financeStats.savingProgress ?? 0}% saved`,
    },
    {
      title: formatter.format(
        Number.parseFloat(expensesQuery.data?.financeStats.budgetSpent ?? "0")
      ),
      description: "Expenses",
      actionClass: "i-lucide:receipt-text",
      actionColor: "bg-yellow-500 text-white",
      footer: expensesQuery.data?.update?.spent
        ? `Last updated ${formatDistanceToNow(
            new Date(expensesQuery.data.update.spent),
            {
              addSuffix: true,
            }
          )}`
        : "No data yet",
    },
    {
      title: formatter.format(
        Number.parseFloat(
          expensesQuery.data?.financeStats.budgetRemaining ?? "0"
        )
      ),
      description: "Remaining Balance",
      actionClass: "i-lucide:chart-area",
      actionColor: "bg-blue-500 text-white",
      footer: expensesQuery.data?.update?.spent
        ? `Last updated ${formatDistanceToNow(
            new Date(expensesQuery.data.update.spent),
            {
              addSuffix: true,
            }
          )}`
        : "No data yet",
    },
  ]);

  const overviewTitle = "Finances Overview";

  let isLoading = $derived(expensesQuery.isLoading);
</script>

<ConfirmDeleteDialog/>

<div class="flex flex-1 flex-col gap-2 py-4 max-w-screen-xl mx-auto">
  <SectionCards {overviewCards} {overviewTitle}/>
  <Tabs value="expense" class="px-4">
    <TabsList class="w-full">
      <TabsTrigger value="expense">Expenses</TabsTrigger>
      <TabsTrigger value="savings">Savings</TabsTrigger>
    </TabsList>
    <TabsContent value="expense">
      {#if isLoading}
        <div class="flex flex-col items-center justify-center h-64">
          <div
            class="i-lucide:loader-2 animate-spin h-8 w-8 text-gray-400"
          ></div>
          <p class="mt-4 text-gray-500">Loading expenses...</p>
        </div>
      {:else}
        <div class="grid grid-cols-3 gap-4 flex flex-col">
          <div class="flex flex-col col-span-3 lg:col-span-2 gap-2">
            <ExpenseTable {data} allowAdd={true}/>
          </div>
          <div
            class="flex flex-col col-span-3 lg:col-span-1 row-span-3 gap-2 pb-4"
          >
            <Card class="@container/card p-6 h-full gap-2 shadow-none">
              <CardContent class="p-0"></CardContent>
            </Card>
          </div>
        </div>
      {/if}
    </TabsContent>
    <TabsContent value="savings">
      <SectionSavings/>
    </TabsContent>
  </Tabs>
</div>
