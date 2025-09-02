<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button/index';
	import { Separator } from '$lib/components/ui/separator/index';
	import { PanelRight } from 'lucide-svelte';
	import AppearanceSwitcher from './appearance-switcher.svelte';
	import NotificationBell from './notifications/notification-bell.svelte';
	const sidebar = Sidebar.useSidebar();
	import 'uno.css';

	const breadcrumbs = $derived(
		page.url.pathname
			.split('/')
			.filter(Boolean) // Remove empty segments from leading/trailing slashes
			.map((segment, index, arr) => {
				const href = '/' + arr.slice(0, index + 1).join('/');
				// Capitalize the segment for display
				const title = segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
				return { title, href, isLast: index === arr.length - 1 };
			})
	);
</script>

<header class="bg-base-100 sticky top-0 z-50 flex w-full items-center border-b">
	<div class="h-12 flex w-full items-center gap-2 px-4">
		<Button class="size-8" variant="ghost" size="icon" onclick={sidebar.toggle}>
			<PanelRight />
		</Button>
		<Separator orientation="vertical" class="mr-2 h-4" />
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
	<div class="flex gap-2 px-4">
		<NotificationBell />
		<AppearanceSwitcher />
	</div>
</header>
