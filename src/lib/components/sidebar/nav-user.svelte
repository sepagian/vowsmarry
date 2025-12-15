<script lang="ts">
	import { mode, toggleMode } from "mode-watcher";
	import type { ComponentProps } from "svelte";

	import { enhance } from "$app/forms";

	import * as Avatar from "$lib/components/ui/avatar/index";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index";
	import * as Sidebar from "$lib/components/ui/sidebar/index";
	import { useSidebar } from "$lib/components/ui/sidebar/index";

	import { currentUser, userEmail } from "$lib/stores/auth";

	import type { WithoutChildren } from "$lib/utils.js";

	const sidebar = useSidebar();
	let {
		items,
		...restProps
	}: {
		items: { title: string; url: string; icon: string }[];
	} & WithoutChildren<ComponentProps<typeof Sidebar.Group>> = $props();

	// Better Auth stores the full name in the 'name' field
	const fullName = $derived($currentUser?.name || "");
	const nameParts = $derived(fullName.split(" "));
	const firstName = $derived(nameParts[0] || "");
	const lastName = $derived(nameParts.slice(1).join(" ") || "");
	const displayName = $derived(
		fullName || $currentUser?.email?.split("@")[0] || "User"
	);
	const displayEmail = $derived(userEmail || "");
	const initials = $derived(
		firstName && lastName
			? `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
			: displayName
					.split(" ")
					.map((n: string) => n.charAt(0))
					.join("")
					.toUpperCase()
					.slice(0, 2) || "U"
	);
</script>

<Sidebar.Menu {...restProps}>
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
							<span
								class="truncate font-medium {sidebar.isMobile ? 'hidden' : ''}"
								>{displayName}</span
							>
							<span
								class="truncate text-xs text-gray-500 {sidebar.isMobile
									? 'hidden'
									: ''}">{displayEmail}</span
							>
						</div>
						<div class="i-lucide:chevron-down ml-auto h-4 w-4"></div>
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-(--bits-dropdown-menu-anchor-width) min-w-52 rounded-lg"
				side={sidebar.isMobile ? "bottom" : "bottom"}
				align="end"
				sideOffset={4}
			>
				<DropdownMenu.Group>
					<DropdownMenu.Item
						class="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center justify-between"
						onclick={toggleMode}
					>
						Switch theme
						{#if mode.current === "dark"}
							<div class="i-tabler:sun-filled h-4 w-4 mr-1"></div>
						{:else}
							<div class="i-tabler:moon-filled h-4 w-4 mr-1"></div>
						{/if}
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<form
					method="POST"
					action="/logout"
					use:enhance={() => {
						return async ({ update }) => {
							await update();
						};
					}}
				>
					<DropdownMenu.Item
						class="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center justify-between"
						onclick={(e) => {
							e.preventDefault();
							const form = e.currentTarget.closest("form");
							if (form) form.submit();
						}}
					>
						Log out
						<div class="i-tabler:logout h-4 w-4 mr-1"></div>
					</DropdownMenu.Item>
				</form>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
