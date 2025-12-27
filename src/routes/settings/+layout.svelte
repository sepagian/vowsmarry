<script lang="ts">
	import { ModeWatcher } from "mode-watcher";

	import { page } from "$app/state";

	import SettingSidebar from "$lib/components/sidebar/setting-sidebar.svelte";
	import SiteHeader from "$lib/components/sidebar/site-header.svelte";
	import { Button } from "$lib/components/ui/button";
	import {
		SidebarInset,
		SidebarProvider,
	} from "$lib/components/ui/sidebar/index";

	import favicon from "$lib/assets/favicon.svg";

	let { children } = $props();

	const pageTitle = $derived(() => {
		const workspace = page.data.workspace;
		const pathname = page.url.pathname;

		if (pathname.startsWith("/settings")) {
			const pathParts = pathname.split("/settings/")[1]?.split("/");
			const section = pathParts?.[0];

			const titleMap: Record<string, string> = {
				account: "Account",
				workspace: "Workspace",
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

<div class="[--header-height:calc(--spacing(14))]">
	<SidebarProvider class="flex flex-col">
		<div class="flex flex-1">
			<SettingSidebar />
			<SidebarInset>
				<SiteHeader />
				<main>
					<div class="flex flex-col gap-4 p-4 max-w-screen-xl mx-auto">
						{@render children()}
					</div>
				</main>
			</SidebarInset>
		</div>
	</SidebarProvider>
</div>
