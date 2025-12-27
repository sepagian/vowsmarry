<script lang="ts">
	import type { ComponentProps } from "svelte";

	import { page } from "$app/state";

	import {
		Sidebar,
		SidebarContent,
		SidebarFooter,
		SidebarHeader,
	} from "$lib/components/ui/sidebar/index";

	import NavMain from "./nav-main.svelte";
	import NavWorkspace from "./nav-workspace.svelte";

	let {
		collapsible = "offcanvas",
		...restProps
	}: ComponentProps<typeof Sidebar> = $props();
	const workspace = $derived(page.data.workspace || null);

	const data = {
		navMain: [
			{
				title: "Account",
				url: "/settings/account",
				icon: "i-tabler:user-filled",
			}, // DASHBOARD
			{
				title: "Workspace",
				url: "/settings/workspace",
				icon: "i-tabler:category-filled",
			}, // TASKS
		],
	};
</script>

<Sidebar class="bg-accent" {collapsible} {...restProps}>
	<SidebarHeader class="h-fit bg-accent">
		<NavWorkspace {workspace} />
	</SidebarHeader>
	<SidebarContent class="align-center bg-accent">
		<NavMain items={data.navMain} />
	</SidebarContent>
	<SidebarFooter class="bg-accent"></SidebarFooter>
</Sidebar>
