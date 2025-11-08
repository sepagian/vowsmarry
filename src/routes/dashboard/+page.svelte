<script lang="ts">
	import SectionCards from '$lib/components/section/section-cards.svelte';
	import SectionTodo from '$lib/components/section/section-todo.svelte';
	import SectionBudget from '$lib/components/section/section-budget.svelte';
	import DialogWedding from '$lib/components/dialog/dialog-wedding.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index';
	import { buttonVariants } from '$lib/components/ui/button/index';
	import { expensesStore } from '$lib/stores/expenses';
	import { formatDistanceToNow } from 'date-fns';

	const overviewTitle = 'Wedding Overview';

	let { data } = $props();
	let open = $state(false);
	const weddingDate = data.wedding?.weddingDate ? new Date(data.wedding.weddingDate) : null;
	const daysUntilWedding = weddingDate
		? Math.ceil((weddingDate.getTime() - new Date().getTime()) / 86400000)
		: null;

	$effect(() => {
		if (data.expenses) {
			expensesStore.set(data.expenses);
		}
	});

	let overviewCards = $derived(() => {
		return [
			{
				title: data.stats.taskCount.toString(),
				description: 'Tasks',
				action: 'Total',
				footer: data.update.taskUpdate
					? `Last updated ${formatDistanceToNow(new Date(data.update.taskUpdate), { addSuffix: true })}`
					: 'No data yet',
			},
			{
				title: parseFloat(data.stats.expensePaidAmount).toLocaleString('id-ID', {
					style: 'currency',
					currency: 'IDR',
					minimumFractionDigits: 0,
					maximumFractionDigits: 0,
				}),
				description: 'Budget Spent',
				action: 'Total',
				footer: data.update.expenseUpdate
					? `Last updated ${formatDistanceToNow(new Date(data.update.expenseUpdate), { addSuffix: true })}`
					: 'No data yet',
			},
			{
				title: data.stats.documentCount.toString(),
				description: 'Documents',
				action: 'Total',
				footer: data.update.documentUpdate
					? `Last updated ${formatDistanceToNow(new Date(data.update.documentUpdate), { addSuffix: true })}`
					: 'No data yet',
			},
			{
				title: data.stats.vendorCount.toString(),
				description: 'Vendors',
				action: 'Total',
				footer: data.update.vendorUpdate
					? `Last updated ${formatDistanceToNow(new Date(data.update.vendorUpdate), { addSuffix: true })}`
					: 'No data yet',
			},
		];
	});
</script>

<div class="flex flex-1 flex-col gap-2 py-4 max-w-screen-xl mx-auto">
	<div class="flex justify-between gap-2 px-4 align-center">
		<div class="flex flex-col gap-2">
			<h1 class="text-2xl font-semibold">Welcome back, {data.user.firstName}!</h1>
			<p class="text-muted-foreground">
				{#if data.wedding}
					Plan your wedding with {data.wedding.partnerName || 'your partner'}
					{#if weddingDate}
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
			{:else}{/if}
			<DialogWedding
				{data}
				bind:open
			/>
		</Dialog.Root>
	</div>

	<SectionTodo {data} />
	<SectionCards
		{overviewCards}
		{overviewTitle}
	/>
	<SectionBudget {data} />
</div>
