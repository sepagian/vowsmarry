<script lang="ts">
  import { mode, toggleMode } from "mode-watcher";
  import type { ComponentProps } from "svelte";
  import { getContext } from "svelte";

  import { enhance } from "$app/forms";

  import {
    Root as AvatarRoot,
    Fallback as AvatarFallback,
  } from "$lib/components/ui/avatar/index";
  import {
    Root as DropdownMenuRoot,
    Trigger as DropdownMenuTrigger,
    Content as DropdownMenuContent,
    Group as DropdownMenuGroup,
    Item as DropdownMenuItem,
  } from "$lib/components/ui/dropdown-menu/index";
  import {
    Menu as SidebarMenu,
    MenuItem as SidebarMenuItem,
    MenuButton as SidebarMenuButton,
    Group as SidebarGroup,
  } from "$lib/components/ui/sidebar/index";
  import { useSidebar } from "$lib/components/ui/sidebar/index";

  import type { WithoutChildren } from "$lib/utils.js";
  import type { User } from "better-auth/types";

  const sidebar = useSidebar();
  let {
    items,
    ...restProps
  }: {
    items: { title: string; url: string; icon: string }[];
  } & WithoutChildren<ComponentProps<typeof SidebarGroup>> = $props();

  const { user }: { user: User | null } = getContext("auth");

  const fullName = $derived(user?.name || "");
  const displayName = $derived(fullName || "User");
  const displayEmail = $derived(user?.email || "");
  const initials = $derived(
    displayName
      .split(" ")
      .map((n: string) => n.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U",
  );
</script>

<SidebarMenu {...restProps}>
  <SidebarMenuItem>
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        {#snippet child({ props })}
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            {...props}
          >
            <AvatarRoot class="size-8 rounded-lg">
              <AvatarFallback class="rounded-lg">{initials}</AvatarFallback>
            </AvatarRoot>
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
          </SidebarMenuButton>
        {/snippet}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        class="w-(--bits-dropdown-menu-anchor-width) min-w-52 rounded-lg"
        side={sidebar.isMobile ? "bottom" : "bottom"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuGroup>
          <DropdownMenuItem
            class="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center justify-between"
            onclick={toggleMode}
          >
            Switch theme
            {#if mode.current === "dark"}
              <div class="i-tabler:sun-filled h-4 w-4 mr-1"></div>
            {:else}
              <div class="i-tabler:moon-filled h-4 w-4 mr-1"></div>
            {/if}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <form
          method="POST"
          action="/logout"
          use:enhance={() => {
            return async ({ update }) => {
              await update();
            };
          }}
        >
          <DropdownMenuItem
            class="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center justify-between"
            onclick={(e) => {
              e.preventDefault();
              const form = e.currentTarget.closest("form");
              if (form) form.submit();
            }}
          >
            Log out
            <div class="i-tabler:logout h-4 w-4 mr-1"></div>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  </SidebarMenuItem>
</SidebarMenu>
