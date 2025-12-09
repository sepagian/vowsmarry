<script lang="ts" module>
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

<script lang="ts">
	import type { ComponentProps } from "svelte";
	import { page } from "$app/state";
	import * as Sidebar from "$lib/components/ui/sidebar/index";
	import NavMain from "./nav-main.svelte";
	import NavWorkspace from "./nav-workspace.svelte";

	let {
		collapsible = "offcanvas",
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();
	const workspace = $derived(page.data.workspace || null);
</script>

<Sidebar.Root class="bg-background" {collapsible} {...restProps}>
	<Sidebar.Header class="h-fit bg-background">
		<NavWorkspace {workspace}/>
	</Sidebar.Header>
	<Sidebar.Content class="align-center bg-background">
		<NavMain items={data.navMain}/>
	</Sidebar.Content>
	<Sidebar.Footer class="bg-background"></Sidebar.Footer>
</Sidebar.Root>
