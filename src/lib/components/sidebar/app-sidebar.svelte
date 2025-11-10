<script
	lang="ts"
	module
>
	const navMainItems = [
		{ title: 'Dashboard', url: '/dashboard', icon: 'i-lucide:home' }, // DASHBOARD
		{ title: 'Tasks', url: '/dashboard/task', icon: 'i-lucide:square-check' }, // TASKS
		{ title: 'Documents', url: '/dashboard/document', icon: 'i-lucide:file-text' }, // DOCUMENTS & PAPERWORK
		{ title: 'Finance', url: '/dashboard/finance', icon: 'i-lucide:dollar-sign' }, // EXPENSES AND SAVINGS
		{ title: 'Vendors', url: '/dashboard/vendor', icon: 'i-lucide:signature' }, // VENDORS
		{ title: 'Schedules', url: '/dashboard/schedules', icon: 'i-lucide:calendar-1' }, // RUNDOWN & DRESSCODES
		{ title: 'Setup', url: '/dashboard/invitation', icon: 'i-lucide:settings' }, // OVERVIEW, TEMPLATES, COUPLES DETAILS
		{ title: 'Story', url: '/dashboard/invitation/story', icon: 'i-lucide:notebook-pen' }, // LOVE STORY & GALLERY
		{ title: 'Guests', url: '/dashboard/invitation/guest', icon: 'i-lucide:users' }, // RSVPS
	];
</script>

<script lang="ts">
	import NavMain from './nav-main.svelte';
	import NavUser from './nav-user.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index';
	import { isAuthenticated } from '$lib/stores/auth';

	import type { ComponentProps } from 'svelte';

	let {
		collapsible = 'icon',
		variant = 'sidebar',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root
	class="bg-background"
	{collapsible}
	{variant}
	{...restProps}
>
	<Sidebar.Header class="h-13.75 bg-background"></Sidebar.Header>
	<Sidebar.Content class="align-center bg-background">
		<NavMain items={navMainItems} />
	</Sidebar.Content>
	<Sidebar.Footer class="bg-background">
		{#if $isAuthenticated}
			<NavUser />
		{/if}
	</Sidebar.Footer>
</Sidebar.Root>
