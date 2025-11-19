<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import * as Sidebar from '$lib/components/ui/sidebar/index';
	import { useSidebar } from '$lib/components/ui/sidebar/index';
	import { enhance } from '$app/forms';
	import { active } from '$lib/actions/active.svelte';
	import { currentUser, userEmail } from '$lib/stores/auth';

	const sidebar = useSidebar();

	const firstName = $derived($currentUser?.user_metadata?.first_name || '');
	const lastName = $derived($currentUser?.user_metadata?.last_name || '');
	const displayName = $derived(
		firstName && lastName
			? `${firstName} ${lastName}`
			: firstName || $currentUser?.email?.split('@')[0] || 'User',
	);
	const displayEmail = $derived($userEmail || '');
	const initials = $derived(
		firstName && lastName
			? `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
			: displayName
					.split(' ')
					.map((n: string) => n.charAt(0))
					.join('')
					.toUpperCase()
					.slice(0, 2) || 'U',
	);

	const userNavItems = [
		{ title: 'Account', url: '/account', icon: 'i-lucide:user' },
		{ title: 'Settings', url: '/settings', icon: 'i-lucide:settings' },
	];
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
							<span class="truncate text-xs text-gray-500">{displayEmail}</span>
						</div>
						<div class="i-lucide:chevron-down ml-auto h-5 w-5"></div>
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
							<span class="truncate text-xs text-gray-500">{displayEmail}</span>
						</div>
					</div>
				</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					{#each userNavItems as item (item.title)}
						<DropdownMenu.Item class="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
							{#if item.url}
								<a
									href={item.url}
									use:active
									class="flex flex-1 rounded-r-xl gap-2 items-center"
								>
									{#if item.icon}
										<div class="{item.icon} h-4 w-4"></div>
									{/if}
									<span class="text-sm">{item.title}</span>
								</a>
							{/if}
						</DropdownMenu.Item>
					{/each}
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<form
					method="POST"
					action="/logout"
					use:enhance={() => {
						// Show loading toast while logout is processing
						return async ({ update }) => {
							await update();
						};
					}}
				>
					<DropdownMenu.Item
						class="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
						onclick={(e) => {
							e.preventDefault();
							const form = e.currentTarget.closest('form');
							if (form) form.submit();
						}}
					>
						<div class="i-lucide:log-out h-5 w-5"></div>
						Log out
					</DropdownMenu.Item>
				</form>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
