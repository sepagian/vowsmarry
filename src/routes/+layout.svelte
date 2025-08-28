<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import SiteHeader from '$lib/components/site-header.svelte';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import 'uno.css';

	let { children } = $props();

	// Dynamic title based on dashboard routes
	const title = $derived(
		(() => {
			const pathname = page.url.pathname;

			if (pathname.startsWith('/dashboard/')) {
				const pathParts = pathname.split('/dashboard/')[1]?.split('/');
				const section = pathParts?.[0];
				const subsection = pathParts?.[1];

				const titleMap: Record<string, string> = {
					budget: 'Budget - vowsmarry',
					dowry: 'Dowry - vowsmarry',
					dresscode: 'Dress Code - vowsmarry',
					paperwork: 'Paperwork - vowsmarry',
					rundown: 'Rundown - vowsmarry',
					saving: 'Saving - vowsmarry',
					souvenir: 'Souvenir - vowsmarry',
					todo: 'To Do - vowsmarry',
					vendor: 'Vendor - vowsmarry'
				};

				// Handle invitation subsections
				if (section === 'invitation' && subsection) {
					const invitationTitleMap: Record<string, string> = {
						couple: 'Couple Info - vowsmarry',
						gallery: 'Photo Gallery - vowsmarry',
						gift: 'Gift Registry - vowsmarry',
						guest: 'Guest List - vowsmarry',
						'love-story': 'Love Story - vowsmarry',
						rsvp: 'RSVP - vowsmarry',
						templates: 'Templates - vowsmarry'
					};
					return invitationTitleMap[subsection] || 'Invitation - vowsmarry';
				}

				return section && titleMap[section] ? titleMap[section] : 'Dashboard - vowsmarry';
			}

			return 'vowsmarry';
		})()
	);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{title}</title>
</svelte:head>

<div class="[--header-height:calc(--spacing(14))]">
	<Sidebar.Provider class="flex flex-col">
		<SiteHeader />
		<div class="flex flex-1">
			<AppSidebar />
			<Sidebar.Inset>
				<main>
					{@render children()}
				</main>
			</Sidebar.Inset>
		</div>
	</Sidebar.Provider>
</div>
