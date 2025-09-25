<script
	lang="ts"
	module
>
	const items = {
		user: {
			id: '1',
			name: 'Mawar Melati',
			email: 'm@example.com',
		},
		navMain: [
			{
				title: 'Planner',
				icon: 'i-lucide:notebook-pen',
				isActive: true,
				items: [
					{ title: 'Tasks', url: '/dashboard/task' }, // could include paperwork
					{ title: 'Documents', url: '/dashboard/document' }, // contracts, receipts, inspo
					{ title: 'Budget', url: '/dashboard/budget' }, // quick link to finance
					{ title: 'Vendors', url: '/dashboard/vendor' },
					{ title: 'Schedule', url: '/dashboard/schedule' }, // could include dresscode
				],
			},
			{
				title: 'Invitation',
				icon: 'i-lucide:mail',
				isActive: true,
				items: [
					{ title: 'Setup', url: '/dashboard/invitation' }, // overview, templates, couple details
					{ title: 'Story', url: '/dashboard/invitation/story' }, // love story, gallery
					{ title: 'Guests', url: '/dashboard/invitation/guest' }, // guests, RSVP, gifts
				],
			},
		],
	};
</script>

<script lang="ts">
	import NavMain from './nav-main.svelte';
	import NavUser from './nav-user.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index';

	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		collapsible = 'icon',
		variant = 'sidebar',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root
	class=""
	{collapsible}
	{variant}
	{...restProps}
>
	<Sidebar.Header class="h-13.75"></Sidebar.Header>
	<Sidebar.Content class="align-center">
		<NavMain items={items.navMain} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={items.user} />
	</Sidebar.Footer>
</Sidebar.Root>
