<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index';
	import * as Card from '$lib/components/ui/card/index';
	import ExpenseTable from '$lib/components/table/expense-table.svelte';

	let {
		budgetCards,
	}: {
		budgetCards: BudgetCard[];
	} = $props();

	const expenseData: Expense[] = [
		{
			id: '1',
			date: '2025-08-01',
			category: 'Venue',
			description: 'Down payment for venue booking',
			amount: 5_000_000,
			status: 'Paid' as const,
		},
		{
			id: '2',
			date: '2025-08-03',
			category: 'Venue',
			description: 'Final payment for venue',
			amount: 3_000_000,
			status: 'Pending' as const,
		},
		{
			id: '3',
			date: '2025-08-05',
			category: 'Catering',
			description: 'Initial catering deposit',
			amount: 3_000_000,
			status: 'Paid' as const,
		},
		{
			id: '4',
			date: '2025-08-08',
			category: 'Catering',
			description: 'Second catering installment',
			amount: 2_000_000,
			status: 'Paid' as const,
		},
		{
			id: '5',
			date: '2025-08-10',
			category: 'Decoration',
			description: 'Stage setup & flowers',
			amount: 3_500_000,
			status: 'Paid' as const,
		},
		{
			id: '6',
			date: '2025-08-12',
			category: 'Photography',
			description: 'Pre-wedding photoshoot',
			amount: 2_000_000,
			status: 'Paid' as const,
		},
		{
			id: '7',
			date: '2025-08-15',
			category: 'Photography',
			description: 'Wedding day coverage',
			amount: 2_000_000,
			status: 'Pending' as const,
		},
		{
			id: '8',
			date: '2025-08-18',
			category: 'Attire',
			description: 'Bride and groom outfits',
			amount: 4_000_000,
			status: 'Paid' as const,
		},
		{
			id: '9',
			date: '2025-08-20',
			category: 'Entertainment',
			description: 'Live band booking',
			amount: 2_500_000,
			status: 'Paid' as const,
		},
		{
			id: '10',
			date: '2025-08-22',
			category: 'Makeup & Hair',
			description: 'Bridal makeup package',
			amount: 3_000_000,
			status: 'Pending' as const,
		},
	];
</script>

<div class="flex flex-col gap-4 px-4">
	<div class="flex flex-col">
		<h2 class="text-base font-bold text-neutral-600">Budget & Expenses</h2>
	</div>

	<div class="flex flex-col gap-1">
		<div
			class="flex gap-4 overflow-x-auto scrollbar-none scroll-smooth sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
		>
			{#each budgetCards as data (data.description)}
				<Card.Root class="@container/card shrink-0 w-64 sm:w-auto gap-2">
					<Card.Header>
						<Card.Description>{data.description}</Card.Description>
						<Card.Title class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
							{data.title}
						</Card.Title>
						<Card.Action>
							{#if data.action}
								<Badge variant="outline">{data.action}</Badge>
							{/if}
						</Card.Action>
					</Card.Header>
					<Card.Footer class="flex-col items-start text-sm">
						<div class="line-clamp-1 flex font-medium">
							{data.footer}
						</div>
					</Card.Footer>
				</Card.Root>
			{/each}
		</div>

		<div class="flex flex-col">
			<ExpenseTable data={expenseData} />
		</div>
	</div>
</div>
