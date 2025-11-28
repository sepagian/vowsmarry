<script lang="ts">
	import SectionCards from '$lib/components/section/section-cards.svelte';
	import SectionBudget from '$lib/components/section/section-budget.svelte';
	import WeddingAlert from '$lib/components/wedding-alert.svelte';
	import DialogWedding from '$lib/components/dialog/dialog-wedding.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index';
	import { buttonVariants } from '$lib/components/ui/button/index';
	import { expensesState } from '$lib/stores/expenses.svelte';
	import { formatLastUpdate, formatCurrency, calculateDaysUntil } from '$lib/utils/format-utils';

	const overviewTitle = 'Wedding Overview';

	let { data } = $props();
	let open = $state(false);

	const weddingDate = data.wedding?.weddingDate ? new Date(data.wedding.weddingDate) : null;
	const daysUntilWedding = $derived(calculateDaysUntil(weddingDate));

	$effect(() => {
		if (data.expenses) {
			expensesState.set(data.expenses);
		}
	});

	let overviewCards = $derived([
		{
			title: data.stats.taskCount.toString(),
			description: 'Tasks',
			action: 'Total',
			footer: formatLastUpdate(data.update.taskUpdate),
		},
		{
			title: formatCurrency(data.stats.expensePaidAmount),
			description: 'Budget Spent',
			action: 'Total',
			footer: formatLastUpdate(data.update.expenseUpdate),
		},
		{
			title: data.stats.documentCount.toString(),
			description: 'Documents',
			action: 'Total',
			footer: formatLastUpdate(data.update.documentUpdate),
		},
		{
			title: data.stats.vendorCount.toString(),
			description: 'Vendors',
			action: 'Total',
			footer: formatLastUpdate(data.update.vendorUpdate),
		},
	]);
</script>

<div class="flex flex-1 flex-col gap-2 py-4 max-w-screen-xl mx-auto">
	<div class="flex justify-between gap-2 px-4 align-center">
		<div class="flex flex-col gap-2">
			<h1 class="text-2xl font-semibold">Welcome back, {data.user.firstName}!</h1>
			<p class="text-muted-foreground">
				{#if data.wedding}
					Plan your wedding with {data.wedding.brideName || 'your partner'}
					{#if daysUntilWedding !== null}
						- {daysUntilWedding} days to go!
					{/if}
				{:else}
					Let's start planning your perfect wedding!
				{/if}
			</p>
		</div>
		<Dialog.Root bind:open>
			{#if data.wedding}
				<Dialog.Trigger
					class="{buttonVariants({
						variant: 'default',
						size: 'default',
					})} self-center "
				>
					<div class="i-lucide:pencil"></div>
					<span class="hidden lg:inline">Edit wedding details</span>
				</Dialog.Trigger>
			{/if}
			<DialogWedding
				{data}
				bind:open
			/>
		</Dialog.Root>
	</div>

	<WeddingAlert {data} />
	<SectionCards
		{overviewCards}
		{overviewTitle}
	/>
	<SectionBudget {data} />
</div>
