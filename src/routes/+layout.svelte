<script lang="ts">
	import 'uno.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { invalidate } from '$app/navigation';
	import { Toaster } from '$lib/components/ui/sonner';
	import { Progress } from '@friendofsvelte/progress';
	import { authStore } from '$lib/stores/auth';
	import { TOAST_CONFIG } from '$lib/constants/config';

	let { data, children } = $props();
	let { user, session } = $derived(data);

	const title = $derived(
		(() => {
			const pathname = page.url.pathname;

			if (pathname.startsWith('/dashboard')) {
				const pathParts = pathname.split('/dashboard/')[1]?.split('/');
				const section = pathParts?.[0];
				// const subsection = pathParts?.[1];

				const titleMap: Record<string, string> = {
					task: 'Tasks - vowsmarry',
					document: 'Document - vowsmarry',
					budget: 'Finance - vowsmarry',
					vendor: 'Vendor - vowsmarry',
					rundown: 'Rundown - vowsmarry',
				};

				return section && titleMap[section] ? titleMap[section] : 'Dashboard - vowsmarry';
			}

			return 'vowsmarry';
		})(),
	);

	onMount(() => {
		// Initialize auth store with server-provided data
		authStore.initialize(user, session);
	});

	$effect(() => {
		// Update auth store when data changes
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
	duration={TOAST_CONFIG.DEFAULT_DURATION}
/>
