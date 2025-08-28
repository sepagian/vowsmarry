<script lang="ts">
	import 'uno.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>Register to vowsmarry</title>
</svelte:head>

<div class="flex h-screen w-full items-center justify-center px-4">
	{@render children()}
</div>