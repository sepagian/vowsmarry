<script lang="ts">
	import { page } from '$app/state';
	import { useSidebar } from '$lib/components/ui/sidebar/index';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import { Button } from '$lib/components/ui/button/index';
	import { Separator } from '$lib/components/ui/separator/index';
	import NavUser from './nav-user.svelte';

	const breadcrumbs = $derived(
		page.url.pathname
			.split('/')
			.filter(Boolean) // Remove empty segments from leading/trailing slashes
			.map((segment, index, arr) => {
				const href = '/' + arr.slice(0, index + 1).join('/');
				// Capitalize the segment for display
				const title = segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
				return { title, href, isLast: index === arr.length - 1 };
			}),
	);

	let data = {
		navUser: [],
	};

	const sidebar = useSidebar();

	const toggleIcon = $derived(
		sidebar.open
			? 'i-tabler:layout-sidebar-left-collapse-filled'
			: 'i-tabler:layout-sidebar-right-collapse-filled',
	);
</script>

<header
	class="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear"
>
	<div class=" flex w-full items-center gap-2 justify-between px-4">
		<div class="flex items-center gap-2">
			<Button
				variant="ghost"
				size="sm"
				class="p-0"
				onclick={sidebar.toggle}
			>
				<div
					class="{toggleIcon} h-7 w-7 text-muted-foreground hover:text-foreground transition-all duration-300 ease-in-out"
				></div>
			</Button>
			<Separator
				orientation="vertical"
				class="mr-2 h-14"
			/>
			<Breadcrumb.Root class="hidden sm:block">
				<Breadcrumb.List>
					{#each breadcrumbs as crumb, i (i)}
						<Breadcrumb.Item>
							{#if crumb.isLast}
								<Breadcrumb.Page>{crumb.title}</Breadcrumb.Page>
							{:else}
								<Breadcrumb.Link href={crumb.href}>{crumb.title}</Breadcrumb.Link>
							{/if}
						</Breadcrumb.Item>
						{#if !crumb.isLast}
							<Breadcrumb.Separator />
						{/if}
					{/each}
				</Breadcrumb.List>
			</Breadcrumb.Root>
		</div>
		<div class="flex justify-end gap-4 items-center">
			<a href="/settings/workspace">
				<Button
					variant="outline"
					size="icon"
					class="p-2"
					><div class="i-tabler:settings-filled h-6 w-6 text-muted-foreground"></div></Button
				>
			</a>
			<NavUser items={data.navUser} />
		</div>
	</div>
</header>
