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

	// Get workspace from page data (passed from layout)
	const workspace = $derived(page.data.workspace || null);

	const data = {
		navMain: [
			{
				title: "Tasks",
				url: "/dashboard/task",
				icon: "i-tabler:square-check-filled",
			}, // TASKS
			{
				title: "Documents",
				url: "/dashboard/document",
				icon: "i-tabler:file-text-filled",
			}, // DOCUMENTS & PAPERWORK
			{
				title: "Finance",
				url: "/dashboard/finance",
				icon: "i-tabler:receipt-dollar-filled",
			}, // EXPENSES AND SAVINGS
			{
				title: "Vendors",
				url: "/dashboard/vendor",
				icon: "i-tabler:writing-sign-filled",
			}, // VENDORS
			{
				title: "Schedules",
				url: "/dashboard/schedules",
				icon: "i-tabler:calendar-month-filled",
			}, // RUNDOWN & DRESSCODES
			{
				title: "Invitation",
				url: "/dashboard/invitation",
				icon: "i-tabler:mail-filled",
			}, // OVERVIEW, TEMPLATES, COUPLES DETAILS
			{
				title: "Story",
				url: "/dashboard/invitation/story",
				icon: "i-tabler:feather-filled",
			}, // LOVE STORY & GALLERY
			{
				title: "Guests",
				url: "/dashboard/invitation/guest",
				icon: "i-tabler:user-filled",
			}, // RSVPS
			{
				title: "Settings",
				url: "/settings/workspace",
				icon: "i-tabler:settings-filled",
			},
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
