<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import * as Sidebar from '$lib/components/ui/sidebar/index';
	import { useSidebar } from '$lib/components/ui/sidebar/index';
	import { ChevronsUpDown, LogOut, Settings, User } from 'lucide-svelte';
	import { enhance } from '$app/forms';

	type UserType = {
		id: string;
		firstName: string;
		lastName: string;
		email: string;
	};

	let {
		user
	}: {
		user: UserType;
	} = $props();

	const sidebar = useSidebar();

	// Create display name and initials
	const displayName = $derived(`${user.firstName} ${user.lastName}`);
	const initials = $derived(
		`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
	);
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						{...props}
					>
						<Avatar.Root class="size-8 rounded-lg">
							<Avatar.Fallback class="rounded-lg">{initials}</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-medium">{displayName}</span>
							<span class="truncate text-xs">{user.email}</span>
						</div>
						<ChevronsUpDown class="ml-auto size-4" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				align="end"
				sideOffset={4}
			>
				<DropdownMenu.Label class="p-0 font-normal">
					<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
						<Avatar.Root class="size-8 rounded-lg">
							<Avatar.Fallback class="rounded-lg">{initials}</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-medium">{displayName}</span>
							<span class="truncate text-xs">{user.email}</span>
						</div>
					</div>
				</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item>
						<User />
						Account
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<Settings />
						Settings
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<form method="POST" action="/logout" use:enhance>
					<DropdownMenu.Item onclick={(e) => {
						e.preventDefault();
						const form = e.currentTarget.closest('form');
						if (form) form.submit();
					}}>
						<LogOut />
						Log out
					</DropdownMenu.Item>
				</form>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
