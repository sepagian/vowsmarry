<script lang="ts">
	import 'uno.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { invalidate } from '$app/navigation';
	import { Toaster } from '$lib/components/ui/sonner';
	import { Progress } from '@friendofsvelte/progress';
	import { authStore } from '$lib/stores/auth';

	let { data, children } = $props();
	let { supabase, user, session } = $derived(data);

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

	onMount(() => {
		// Initialize auth store with server-side data
		authStore.initialize(user, session);

		const { data } = supabase.auth.onAuthStateChange((event, session) => {
			// Update auth store when auth state changes
			authStore.setAuth(session?.user || null, session);
			invalidate('supabase:auth');
		});

		return () => data.subscription.unsubscribe();
	});

	// Reactive update when server data changes (for SSR/hydration)
	$effect(() => {
		if (authStore.getState().initialized) {
			authStore.setAuth(user, session);
		}
	});
</script>

<svelte:head>
	<link
		rel="icon"
		href={favicon}
	/>
	<title>{title}</title>
</svelte:head>

<Progress
	size="md"
	color="blue"
/>
{@render children()}
<Toaster
	richColors
	position="top-right"
	expand={true}
	visibleToasts={3}
	closeButton={true}
	duration={4000}
/>
