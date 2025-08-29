<script lang="ts">
	import { invalidate } from '$app/navigation'
	import { onMount } from 'svelte'
	import 'uno.css'

	let { data, children } = $props()
	let { session, supabase } = $derived(data)

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange(() => {
			// Invalidate on any auth state change since session is always null in this setup
			invalidate('supabase:auth')
		})

		return () => data.subscription.unsubscribe()
	})
</script>

{@render children()}