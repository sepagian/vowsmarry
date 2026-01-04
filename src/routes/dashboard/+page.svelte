<script lang="ts">
	import SectionCards from "$lib/components/section/section-cards.svelte";
	import SectionBudget from "$lib/components/section/section-budget.svelte";
	import { formatLastUpdate, formatCurrency, calculateDaysUntil } from "$lib/utils/format-utils";
	import { useTasks } from "$lib/query/task";
	import { useExpenses } from "$lib/query/expense";
	import { useVendors } from "$lib/query/vendor";

	const overviewTitle = "Wedding Overview";

	let { data } = $props();

	const taskQuery = useTasks();
	const expensesQuery = useExpenses();
	const vendorQuery = useVendors();

	const weddingDate = data.workspace?.weddingDate ? new Date(data.workspace.weddingDate) : null;
	const daysUntilWedding = $derived(calculateDaysUntil(weddingDate));

	const formatter = new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	});

	const expensePaidAmount = $derived(
		expensesQuery.data?.expenses.reduce(
			(sum, e) => sum + Number(e.expenseAmount),
			0,
		) ?? 0
	);

	const vendorCount = $derived(vendorQuery.data?.vendors.length ?? 0);

	let overviewCards = $derived([
		{
			title: (taskQuery.data?.tasks.length ?? 0).toString(),
			description: "Tasks",
			action: "Total",
			footer: taskQuery.data?.update?.total
				? formatLastUpdate(taskQuery.data.update.total)
				: "No data yet",
		},
		{
			title: formatter.format(expensePaidAmount),
			description: "Budget Spent",
			action: "Total",
			footer: expensesQuery.data?.update?.spent
				? formatLastUpdate(expensesQuery.data.update.spent)
				: "No data yet",
		},
		{
			title: (data.stats.documentCount ?? 0).toString(),
			description: "Documents",
			action: "Total",
			footer: "Loading...",
		},
		{
			title: vendorCount.toString(),
			description: "Vendors",
			action: "Total",
			footer: vendorQuery.data?.update?.booked
				? formatLastUpdate(vendorQuery.data.update.booked)
				: "No data yet",
		},
	]);

	let isLoading = $derived(
		taskQuery.isLoading || expensesQuery.isLoading || vendorQuery.isLoading
	);
</script>

<div class="flex flex-1 flex-col gap-2 py-4 max-w-screen-xl mx-auto">
	<div class="flex justify-between gap-2 px-4 align-center">
		<div class="flex flex-col gap-2">
			{#if data.workspace}
				{@const groomName = data.workspace.groomName}
				{@const brideName = data.workspace.brideName}
				{#if groomName && brideName}
					<h1 class="text-2xl font-semibold">{groomName} & {brideName}'s Wedding</h1>
				{:else}
					<h1 class="text-2xl font-semibold">Welcome back, {data.user.firstName}!</h1>
				{/if}
				<p class="text-muted-foreground">
					{#if daysUntilWedding !== null}
						{#if daysUntilWedding === 0}
							Today is the big day! 🎉
						{:else if daysUntilWedding === 1}
							Tomorrow is the big day! 🎉
						{:else if daysUntilWedding > 0}
							{daysUntilWedding} days until your wedding
						{:else}
							Celebrating your marriage
						{/if}
					{:else}
						Planning your perfect wedding together
					{/if}
				</p>
			{:else}
				<h1 class="text-2xl font-semibold">Welcome back, {data.user.firstName}!</h1>
				<p class="text-muted-foreground">Let's start planning your perfect wedding!</p>
			{/if}
		</div>
	</div>

	<SectionCards {overviewCards} {overviewTitle} />
	<SectionBudget {data} />
</div>
