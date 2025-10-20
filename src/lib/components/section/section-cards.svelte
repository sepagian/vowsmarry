<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index';
	import * as Card from '$lib/components/ui/card/index';
	import type { OverviewCard } from '$lib/types';

	let {
		overviewCards,
		overviewTitle,
	}: {
		overviewCards: () => OverviewCard[];
		overviewTitle: string;
	} = $props();
</script>

<div class="flex flex-col gap-3 px-4">
	<div class="flex flex-col">
		<h2 class="text-base font-bold text-neutral-600">{overviewTitle}</h2>
	</div>

	<div
		class="flex gap-4 overflow-x-auto scrollbar-none scroll-smooth grid-flow-row-dense sm:grid md:grid-cols-2 lg:grid-cols-4"
	>
		{#each overviewCards() as data (data.description)}
			<Card.Root
				class="@container/card shrink-0 w-68 h-32 sm:w-auto gap-2 flex flex-col py-4 px-0 shadow-none"
			>
				<Card.Header class="flex flex-col gap-2 px-4">
					<div class="flex flex-1 justify-between align-center w-full">
						<Card.Description class="px-0">{data.description}</Card.Description>
						<Card.Action>
							{#if data.action}
								<Badge
									variant="outline"
									class="flex items-center justify-center">{data.action}</Badge
								>
							{/if}
							{#if data.actionClass}
								<Badge
									class="flex items-center justify-center rounded-full px-0 font-mono tabular-nums bg-base"
								>
									<div class="{data.actionClass} {data.actionColor} h-4 w-4"></div>
								</Badge>
							{/if}
						</Card.Action>
					</div>
					<Card.Title class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
						{data.title}
					</Card.Title>
				</Card.Header>
				<Card.Footer class="flex-col items-start text-sm px-4">
					<div class="line-clamp-1 flex font-medium">
						{data.footer}
					</div>
				</Card.Footer>
			</Card.Root>
		{/each}
	</div>
</div>
