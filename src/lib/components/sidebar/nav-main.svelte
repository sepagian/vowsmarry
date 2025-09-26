<script lang="ts">
	import { resolve } from '$app/paths';
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
					<a href={resolve(item.url)}>
						<div class="flex flex-1 gap-2 items-center">
							{#if item.icon}
								<div class="{item.icon} h-4 w-4"></div>
							{/if}
							<span class="text-sm">{item.title}</span>
						</div>
					</a>
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
