<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import 'uno.css';
	import { page } from '$app/state';
	let { children } = $props();
	const title = $derived(
		(() => {
			const pathname = page.url.pathname;

			if (pathname.startsWith('/dashboard/')) {
				const pathParts = pathname.split('/dashboard/')[1]?.split('/');
				const section = pathParts?.[0];
				const subsection = pathParts?.[1];

				const titleMap: Record<string, string> = {
					task: 'Tasks - vowsmarry',
					document: 'Document - vowsmarry',
					budget: 'Budget - vowsmarry',
					vendor: 'Vendor - vowsmarry',
					rundown: 'Schedule - vowsmarry',
				};

				// Handle invitation subsections
				if (section === 'invitation' && subsection) {
					const invitationTitleMap: Record<string, string> = {
						story: 'Story - vowsmarry',
						guest: 'Guests Management - vowsmarry',
					};
					return invitationTitleMap[subsection] || 'Invitation - vowsmarry';
				}

				return section && titleMap[section] ? titleMap[section] : 'Dashboard - vowsmarry';
			}

			return 'vowsmarry';
		})(),
	);
</script>

<svelte:head>
	<link
		rel="icon"
		href={favicon}
	/>
	<title>{title}</title>
</svelte:head>

{@render children?.()}
