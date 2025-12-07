<script lang="ts">
	import { active } from '$lib/actions/active.svelte';
	import { Button } from '$lib/components/ui/button/';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { WithoutChildren } from '$lib/utils.js';
	import type { ComponentProps } from 'svelte';

	let {
		items,
		...restProps
	}: { items: { title: string; url: string; icon: string }[] } & WithoutChildren<
		ComponentProps<typeof Sidebar.Group>
	> = $props();
</script>

<Sidebar.Group
	{...restProps}
	class="px-6"
>
	<Sidebar.Menu class="gap-2">
		<Sidebar.MenuItem class="p-0">
			<Sidebar.MenuButton class="text-muted-foreground p-0 h-full text-sm">
				<a
					href="/dashboard"
					class=" h-full flex flex-1 gap-3 items-center"
				>
					<Button class="w-full cursor-pointer">
						<div class="i-tabler:home h-4 w-4"></div>
						Dashboard</Button
					>
				</a>
			</Sidebar.MenuButton>
		</Sidebar.MenuItem>
		{#each items as item (item.title)}
			<Sidebar.MenuItem>
				<Sidebar.MenuButton
					tooltipContent={item.title}
					class="text-muted-foreground p-0 h-full text-sm  hover:text-foreground"
				>
					{#if item.url}
						<a
							href={item.url}
							use:active
							class="data-[active=true]:(text-foreground font-bold bg-secondary) px-2 py-2 h-full flex flex-1 gap-3 items-center"
						>
							{#if item.icon}
								<div class="{item.icon} h-[24px] w-[24px]"></div>
							{/if}
							<span>{item.title}</span>
						</a>
					{/if}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
