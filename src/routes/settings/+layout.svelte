<script>
	import * as Sidebar from '$lib/components/ui/sidebar/index';
	import { Button } from '$lib/components/ui/button';
	import SettingSidebar from '$lib/components/sidebar/setting-sidebar.svelte';
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
			<SettingSidebar />
			<Sidebar.Inset>
				<SiteHeader />
				<main>
					<div class="flex flex-col gap-4 p-4 max-w-screen-xl mx-auto">
						{@render children()}
					</div>
				</main>
			</Sidebar.Inset>
		</div>
	</Sidebar.Provider>
</div>
