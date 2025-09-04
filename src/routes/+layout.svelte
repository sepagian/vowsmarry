<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import 'uno.css';
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from 'svelte-sonner';
	import { Progress } from '@friendofsvelte/progress';

	let { data, children } = $props();
	let { session, supabase } = $derived(data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange(() => {
			// Invalidate on any auth state change since session is always null in this setup
			invalidate('supabase:auth');
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<ModeWatcher />
<Progress size="md" color="blue" />
{@render children()}
<!-- Sonner Toast notifications -->
<Toaster richColors position="top-right" />
