<script lang="ts">
	import type { ComponentProps } from "svelte";

	import {
		SidebarGroup,
		SidebarGroupContent,
		SidebarMenu,
		SidebarMenuButton,
		SidebarMenuItem,
	} from "$lib/components/ui/sidebar/";

	import type { WithoutChildren } from "$lib/utils.js";

	let {
		items,
		...restProps
	}: {
		items: { title: string; url: string; icon: string }[];
	} & WithoutChildren<ComponentProps<typeof SidebarGroup>> = $props();
</script>

<SidebarGroup {...restProps}>
	<SidebarGroupContent>
		<SidebarMenu>
			{#each items as item (item.title)}
				<SidebarMenuItem>
					<SidebarMenuButton>
						{#snippet child({ props })}
							<a href={item.url} {...props}>
								<div class="{item.icon} h-4 w-4"></div>
								<span>{item.title}</span>
							</a>
						{/snippet}
					</SidebarMenuButton>
				</SidebarMenuItem>
			{/each}
		</SidebarMenu>
	</SidebarGroupContent>
</SidebarGroup>
