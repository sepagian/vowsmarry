<script lang="ts">
	import { active } from '$lib/actions/active.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	let {
		items,
	}: {
		items: {
			title: string;
			url?: string;
			icon?: string;
			isActive?: boolean;
			items?: {
				title: string;
				url: string;
				icon?: string;
			}[];
		}[];
	} = $props();
</script>

<Sidebar.Group class="border-t-1">
	<Sidebar.Menu class="gap-1">
		{#each items as item (item.title)}
			<Sidebar.MenuItem>
				<Sidebar.MenuButton tooltipContent={item.title}>
					{#if item.url}
						<a
							href={item.url}
							use:active
							class="flex flex-1 py-2 rounded-r-xl gap-2 items-center data-[active=true]:bg-neutral-200"
						>
							{#if item.icon}
								<div class="{item.icon} h-4 w-4"></div>
							{/if}
							<span class="text-sm">{item.title}</span>
						</a>
					{/if}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
