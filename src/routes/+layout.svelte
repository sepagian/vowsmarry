<script lang="ts">
	import '@unocss/reset/tailwind.css';
	import 'uno.css';
	import { ToastContainer } from '$lib/components/ui/toast';
	let { children } = $props();
</script>

{@render children()}

<!-- Toast notifications -->
<ToastContainer />
