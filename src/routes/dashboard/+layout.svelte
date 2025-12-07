<script>
	import * as Sidebar from '$lib/components/ui/sidebar/index';
	import AppSidebar from '$lib/components/sidebar/app-sidebar.svelte';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';
	import SiteHeader from '$lib/components/sidebar/site-header.svelte';
	import { page } from '$app/stores';

	let { children } = $props();
	
	// Generate page title based on workspace and current route
	const pageTitle = $derived(() => {
		const workspace = $page.data.workspace;
		const pathname = $page.url.pathname;
		
		// Get page name from pathname
		let pageName = 'Dashboard';
		if (pathname.includes('/task')) pageName = 'Tasks';
		else if (pathname.includes('/finance')) pageName = 'Finance';
		else if (pathname.includes('/vendor')) pageName = 'Vendors';
		else if (pathname.includes('/document')) pageName = 'Documents';
		else if (pathname.includes('/schedules')) pageName = 'Schedules';
		else if (pathname.includes('/invitation')) pageName = 'Invitation';
		else if (pathname.includes('/story')) pageName = 'Story';
		else if (pathname.includes('/guest')) pageName = 'Guests';
		
		// Build title with workspace context
		if (workspace) {
			const groomName = workspace.groomName;
			const brideName = workspace.brideName;
			
			if (groomName && brideName) {
				return `${pageName} - ${groomName} & ${brideName} | VowsMarry`;
			}
			return `${pageName} - ${workspace.name} | VowsMarry`;
		}
		
		return `${pageName} | VowsMarry`;
	});
</script>

<svelte:head>
	<title>{pageTitle()}</title>
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

<div>
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
