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
		House,
		Users
	} from 'lucide-svelte';

	type User = {
		id: string;
		firstName: string;
		lastName: string;
		email: string;
	};

	const data = {
		navDashboard: [
			{
				title: 'Dashboard',
				url: '/dashboard',
				icon: House
			}
		],
		navMain: [
			{
				title: 'Planner',
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
						url: '/dashboard/budget',
						icon: Wallet
					},
					{
						title: 'To-do List',
						url: '/dashboard/todo',
						icon: SquareCheck
					},
					{
						title: 'Vendors',
						url: '/dashboard/vendor',
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
						url: '/dashboard/saving',
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
				url: '/dashboard/invitation',
				icon: Mail,
				isActive: true,
				items: [
					{
						title: 'Overview',
						url: '/dashboard/invitation/',
						icon: House
					},
					{
						title: 'Templates',
						url: '/dashboard/invitation/templates',
						icon: Palette
					},
					{
						title: 'Couple Details',
						url: '/dashboard/invitation/couple',
						icon: Heart
					},
					{
						title: 'Guests',
						url: '/dashboard/invitation/guest',
						icon: Users
					},
					{
						title: 'RSVP',
						url: '/dashboard/invitation/rsvp',
						icon: Mail
					},
					{
						title: 'Gallery',
						url: '/dashboard/invitation/gallery',
						icon: Image
					},
					{
						title: 'Gifts',
						url: '/dashboard/invitation/gift',
						icon: HandCoins
					},
					{
						title: 'Love Story',
						url: '/dashboard/invitation/love-story',
						icon: BookOpen
					}
				]
			}
		]
	};
</script>

<script lang="ts">
	import NavMain from './nav-main.svelte';
	import NavUser from './nav-user.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index';

	import type { ComponentProps } from 'svelte';

	let {
		user,
		ref = $bindable(null),
		collapsible = 'icon',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & { user: User } = $props();
</script>

<Sidebar.Root class="top-12 h-[calc(100svh-var(--header-height))]!" {collapsible} {...restProps}>
	<Sidebar.Header></Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser {user} />
	</Sidebar.Footer>
</Sidebar.Root>
