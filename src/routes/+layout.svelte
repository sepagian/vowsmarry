<script lang="ts">
	import "uno.css";
	import { Progress } from "@friendofsvelte/progress";
	import { onMount } from "svelte";

	import { page } from "$app/state";

	import { Toaster } from "$lib/components/ui/sonner";

	import { authStore } from "$lib/stores/auth";

	import favicon from "$lib/assets/favicon.svg";
	import { TOAST_CONFIG } from "$lib/constants/config";

	let { data, children } = $props();
	let { user, session, pageTitle } = $derived(data);

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
	<link rel="icon" href={favicon} />
	<title>{pageTitle}</title>
</svelte:head>

<Progress size="md" color="blue" />
{@render children()}
<Toaster
	richColors
	position="top-right"
	expand={true}
	visibleToasts={3}
	closeButton={true}
	duration={TOAST_CONFIG.DEFAULT_DURATION}
/>
