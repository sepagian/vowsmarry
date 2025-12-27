<script lang="ts">
  import type { ComponentProps } from "svelte";

  import { Button } from "$lib/components/ui/button/";
  import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "$lib/components/ui/sidebar/";

  import { active } from "$lib/actions/active.svelte";
  import type { WithoutChildren } from "$lib/utils.js";

  let {
    items,
    ...restProps
  }: {
    items: { title: string; url: string; icon: string }[];
  } & WithoutChildren<ComponentProps<typeof SidebarGroup>> = $props();
</script>

<SidebarGroup {...restProps} class="px-4">
  <SidebarMenu class="gap-2">
    <SidebarMenuItem class="p-0">
      <SidebarMenuButton class="text-muted-foreground p-0 h-full text-sm">
        <a href="/dashboard" class=" h-full flex flex-1 gap-3 items-center">
          <Button class="w-full cursor-pointer">
            <div class="i-tabler:home h-4 w-4"></div>
            Dashboard</Button
          >
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
    {#each items as item (item.title)}
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltipContent={item.title}
          class="text-muted-foreground p-0 h-full text-sm  hover:text-foreground"
        >
          {#if item.url}
            <a
              href={item.url}
              use:active
              class="data-[active=true]:(text-foreground font-bold bg-background shadow-sm border-2 rounded-lg px-1.5 py-1.5) px-2 py-2 h-full flex flex-1 gap-3 items-center"
            >
              {#if item.icon}
                <div class="{item.icon} h-[24px] w-[24px]"></div>
              {/if}
              <span>{item.title}</span>
            </a>
          {/if}
        </SidebarMenuButton>
      </SidebarMenuItem>
    {/each}
  </SidebarMenu>
</SidebarGroup>
