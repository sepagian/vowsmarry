<script
	lang="ts"
	module
>
	const data = {
		navMain: [
			{ title: 'Account', url: '/settings/account', icon: 'i-lucide:user' }, // DASHBOARD
			{ title: 'Workspace', url: '/settings/workspace', icon: 'i-lucide:inbox' }, // TASKS
		],
		navUser: [
			{ title: 'Account', url: '/settings/account', icon: 'i-lucide:user' },
			{ title: 'Billing', url: '/settings/account', icon: 'i-lucide:credit-card' },
		],
	};
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
		<NavMain items={data.navMain} />
	</Sidebar.Content>
	<Sidebar.Footer class="bg-background">
		{#if $isAuthenticated}
			<NavUser items={data.navUser} />
		{/if}
	</Sidebar.Footer>
</Sidebar.Root>
