<script
	lang="ts"
	module
>
	const navMainItems = [
		{ title: 'Dashboard', url: '/dashboard', icon: 'i-lucide:home' }, // dashboard
		{ title: 'Tasks', url: '/dashboard/task', icon: 'i-lucide:square-check' }, // could include paperwork
		{ title: 'Documents', url: '/dashboard/document', icon: 'i-lucide:file-text' }, // contracts, receipts, inspo
		{ title: 'Budget', url: '/dashboard/budget', icon: 'i-lucide:dollar-sign' }, // quick link to finance
		{ title: 'Vendors', url: '/dashboard/vendor', icon: 'i-lucide:signature' },
		{ title: 'Schedule', url: '/dashboard/schedule', icon: 'i-lucide:calendar-1' }, // could include dresscode
		{ title: 'Setup', url: '/dashboard/invitation', icon: 'i-lucide:settings' }, // overview, templates, couple details
		{ title: 'Story', url: '/dashboard/invitation/story', icon: 'i-lucide:notebook-pen' }, // love story, gallery
		{ title: 'Guests', url: '/dashboard/invitation/guest', icon: 'i-lucide:users' }, // guests, RSVP, gifts
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
	<Sidebar.Header class="h-13.75"></Sidebar.Header>
	<Sidebar.Content class="align-center bg-background">
		<NavMain items={navMainItems} />
	</Sidebar.Content>
	<Sidebar.Footer class="bg-background">
		{#if $isAuthenticated}
			<NavUser />
		{/if}
	</Sidebar.Footer>
</Sidebar.Root>
