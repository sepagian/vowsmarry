<script lang="ts" module>
	import {
		NotebookPen,
		FileText,
		Wallet,
		SquareCheck,
		Building2,
		Shirt,
		Calendar,
		PiggyBank,
		Gem,
		Gift,
		Palette,
		Heart,
		Mail,
		Image,
		HandCoins,
		BookOpen,
		Command,
		CirclePlus
	} from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button/index';

	const data = {
		navMain: [
			{
				title: 'Planner',
				url: '/dashboard',
				icon: NotebookPen,
				isActive: true,
				items: [
					{
						title: 'Paperwork',
						url: '/dashboard/paperwork',
						icon: FileText
					},
					{
						title: 'Budgeting',
						url: '/dashboard/budgeting',
						icon: Wallet
					},
					{
						title: 'To-do List',
						url: '/dashboard/todos',
						icon: SquareCheck
					},
					{
						title: 'Vendors',
						url: '/dashboard/vendors',
						icon: Building2
					},
					{
						title: 'Dresscode',
						url: '/dashboard/dresscode',
						icon: Shirt
					},
					{
						title: 'Rundown',
						url: '/dashboard/rundown',
						icon: Calendar
					},
					{
						title: 'Savings',
						url: '/dashboard/savings',
						icon: PiggyBank
					},
					{
						title: 'Dowry',
						url: '/dashboard/dowry',
						icon: Gem
					},
					{
						title: 'Souvenir',
						url: '/dashboard/souvenir',
						icon: Gift
					}
				]
			},
			{
				title: 'Invitation',
				url: '/dashboard/invitations',
				icon: Mail,
				isActive: false,
				items: [
					{
						title: 'Templates',
						url: '/dashboard/invitations/templates',
						icon: Palette
					},
					{
						title: 'Couple Details',
						url: '/dashboard/invitations/couple',
						icon: Heart
					},
					{
						title: 'RSVP',
						url: '/dashboard/invitations/rsvp',
						icon: Mail
					},
					{
						title: 'Gallery',
						url: '/dashboard/invitations/gallery',
						icon: Image
					},
					{
						title: 'Gifts',
						url: '/dashboard/invitations/gifts',
						icon: HandCoins
					},
					{
						title: 'Love Story',
						url: '/dashboard/invitations/love-story',
						icon: BookOpen
					}
				]
			}
		]
	};
</script>

<script lang="ts">
	import NavMain from './nav-main.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index';

	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		collapsible = 'icon',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root class="top-12 h-[calc(100svh-var(--header-height))]!" {collapsible} {...restProps}>
	<Sidebar.Header></Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
	</Sidebar.Content>
	<Sidebar.Footer></Sidebar.Footer>
</Sidebar.Root>
