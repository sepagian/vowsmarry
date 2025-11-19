<script>
	import * as Sidebar from '$lib/components/ui/sidebar/index';
	import AppSidebar from '$lib/components/sidebar/app-sidebar.svelte';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';
	import SiteHeader from '$lib/components/sidebar/site-header.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link
		rel="icon"
		type="image/svg+xml"
		href={favicon}
	/>
	<link
		rel="alternate icon"
		href="/favicon.ico"
	/>
</svelte:head>

<ModeWatcher />

<div class="[--header-height:calc(--spacing(14))]">
	<Sidebar.Provider class="flex flex-col">
		<div class="flex flex-1">
			<AppSidebar />
			<Sidebar.Inset>
				<SiteHeader />
				<main>
					{@render children()}
				</main>
			</Sidebar.Inset>
		</div>
	</Sidebar.Provider>
</div>
