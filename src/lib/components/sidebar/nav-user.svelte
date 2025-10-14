<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import * as Sidebar from '$lib/components/ui/sidebar/index';
	import { useSidebar } from '$lib/components/ui/sidebar/index';
	import { enhance } from '$app/forms';
	import { currentUser, userEmail } from '$lib/stores/auth';

	const sidebar = useSidebar();
	
	// Get user data from auth store, with fallback for display name
	const displayName = $derived($currentUser?.user_metadata?.name || $currentUser?.email?.split('@')[0] || 'User');
	const displayEmail = $derived($userEmail || '');
	
	// Get initials for avatar
	const initials = $derived(
		displayName
			.split(' ')
			.map(n => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2) || 'U'
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
							<span class="truncate text-xs">{displayEmail}</span>
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
							<span class="truncate text-xs">{displayEmail}</span>
						</div>
					</div>
				</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item>
						<div class="i-lucide:user h-5 w-5"></div>
						Account
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<div class="i-lucide:settings h-5 w-5"></div>
						Settings
					</DropdownMenu.Item>
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
