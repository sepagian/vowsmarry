<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import * as Sidebar from '$lib/components/ui/sidebar/index';
	import { Button } from '$lib/components/ui/button/index';
	import { Separator } from '$lib/components/ui/separator/index';
	import AppearanceSwitcher from '../appearance-switcher.svelte';
	import { page } from '$app/state';
	import { enhance } from '$app/forms';

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
</script>

<header
	class="sticky top-0 z-50 flex items-center border-b flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear bg-background"
>
	<div class="h-14 flex w-full items-center gap-2 justify-between px-4">
		<div class="flex items-center gap-2">
			<Sidebar.Trigger />
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
		<div class="flex justify-end gap-4">
			<AppearanceSwitcher />
			<form
				method="POST"
				action="/logout"
				use:enhance={() => {
					return async ({ update }) => {
						await update();
					};
				}}
			>
				<Button
					variant="outline"
					class="px-2"
					onclick={(e: MouseEvent & { currentTarget: HTMLButtonElement }) => {
						e.preventDefault();
						const form = e.currentTarget.closest('form');
						if (form) form.submit();
					}}
				>
					<div class="i-lucide:log-out h-5 w-5"></div>
				</Button>
			</form>
		</div>
	</div>
</header>
