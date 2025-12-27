<script lang="ts">
	import { ModeWatcher } from "mode-watcher";

	import { page } from "$app/state";

	import AppSidebar from "$lib/components/sidebar/app-sidebar.svelte";
	import SiteHeader from "$lib/components/sidebar/site-header.svelte";
	import {
		SidebarInset,
		SidebarProvider,
	} from "$lib/components/ui/sidebar/index";

	import favicon from "$lib/assets/favicon.svg";

	let { children } = $props();

	// Generate page title based on workspace and current route
	const pageTitle = $derived(() => {
		const workspace = page.data.workspace;
		const pathname = page.url.pathname;

		if (pathname.startsWith("/dashboard")) {
			const pathParts = pathname.split("/dashboard/")[1]?.split("/");
			const section = pathParts?.[0];

			const titleMap: Record<string, string> = {
				task: "Tasks",
				document: "Document",
				finance: "Finance",
				vendor: "Vendor",
				schedules: "Schedule",
			};

			if (workspace) {
				const groomName = workspace.groomName;
				const brideName = workspace.brideName;

				if (groomName && brideName) {
					return section && titleMap[section] && groomName && brideName
						? `${titleMap[section]} - ${groomName} & ${brideName} | VowsMarry`
						: `Dashboard - ${groomName} & ${brideName} | VowsMarry`;
				}
				return `${pathname} - ${workspace.name} | VowsMarry`;
			}
		}
	});
</script>

<svelte:head>
	<title>{pageTitle()}</title>
	<link rel="icon" type="image/svg+xml" href={favicon} />
	<link rel="alternate icon" href="/favicon.ico" />
</svelte:head>

<ModeWatcher />

<div>
	<SidebarProvider class="flex flex-col">
		<div class="flex flex-1">
			<AppSidebar />
			<SidebarInset class="bg-background">
				<SiteHeader />
				<main>{@render children()}</main>
			</SidebarInset>
		</div>
	</SidebarProvider>
</div>
