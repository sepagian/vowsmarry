<script lang="ts">
	import type { ComponentProps } from 'svelte';

	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	import type { WithoutChildren } from '$lib/utils.js';

	let {
		items,
		...restProps
	}: { items: { title: string; url: string; icon: string }[] } & WithoutChildren<
		ComponentProps<typeof Sidebar.Group>
	> = $props();
</script>

<Sidebar.Group {...restProps}>
	<Sidebar.GroupContent>
		<Sidebar.Menu>
			{#each items as item (item.title)}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton>
						{#snippet child({ props })}
							<a
								href={item.url}
								{...props}
							>
								<div class="{item.icon} h-4 w-4"></div>
								<span>{item.title}</span>
							</a>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			{/each}
		</Sidebar.Menu>
	</Sidebar.GroupContent>
</Sidebar.Group>
