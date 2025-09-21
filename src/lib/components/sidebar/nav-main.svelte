<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	let {
		items,
	}: {
		items: {
			title: string;
			url?: string;
			icon?: string;
			isActive?: boolean;
			items?: {
				title: string;
				url: string;
				icon?: string;
			}[];
		}[];
	} = $props();
</script>

<Sidebar.Group class="border-t-1">
	<Sidebar.Menu>
		<Sidebar.MenuItem>
			<Sidebar.MenuButton
				tooltipContent="Dashboard"
				class="hover:bg-neutral-200 dark:hover:bg-neutral-900 h-10"
			>
				<a
					href="/dashboard"
					class="flex flex-1 gap-2 items-center"
				>
					<div
						class="i-lucide:house translate-y-[1px] translate-x-[-2px] h-5 w-5 bg-neutral-700 dark:bg-neutral-200"
					></div>
					<span class="text-base">Dashboard</span>
				</a>
			</Sidebar.MenuButton>
		</Sidebar.MenuItem>
	</Sidebar.Menu>
	<Sidebar.Menu class="gap-2">
		{#each items as item (item.title)}
			<Collapsible.Root
				open={item.isActive}
				class="group/collapsible"
			>
				{#snippet child({ props })}
					<Sidebar.MenuItem {...props}>
						<Collapsible.Trigger>
							{#snippet child({ props })}
								<Sidebar.MenuButton
									{...props}
									tooltipContent={item.title}
								>
									<div class="flex flex-1 gap-2 items-center">
										{#if item.icon}
											<div
												class="{item.icon} translate-y-[1px] translate-x-[-2px] h-5 w-5 bg-neutral-700 dark:bg-neutral-200"
											></div>
										{/if}
										<span class="text-base">{item.title}</span>
									</div>
									<div
										class="i-lucide:chevron-right ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
									></div>
								</Sidebar.MenuButton>
							{/snippet}
						</Collapsible.Trigger>
						<Collapsible.Content>
							<Sidebar.MenuSub class="gap-0">
								{#each item.items ?? [] as subItem (subItem.title)}
									<Sidebar.MenuSubItem>
										<Sidebar.MenuSubButton
											class="hover:bg-neutral-200 dark:hover:bg-neutral-900 h-8"
										>
											{#snippet child({ props }: { props: any })}
												<a
													href={subItem.url}
													{...props}
												>
													{#if subItem.icon}
														<div class="{subItem.icon} h-5 w-5"></div>
													{/if}

													<span class="text-sm">{subItem.title}</span>
												</a>
											{/snippet}
										</Sidebar.MenuSubButton>
									</Sidebar.MenuSubItem>
								{/each}
							</Sidebar.MenuSub>
						</Collapsible.Content>
					</Sidebar.MenuItem>
				{/snippet}
			</Collapsible.Root>
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
