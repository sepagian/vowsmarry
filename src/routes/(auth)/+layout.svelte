<script lang="ts">
	import 'uno.css';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	let { children } = $props();

	const routeTitles = [
		{ path: '/login', title: 'Login to vowsmarry' },
		{ path: '/register', title: 'Register to vowsmarry' },
		{ path: '/forgot-password', title: 'Reset Password - vowsmarry' }
	];

	const title = $derived(
		(() => {
			const route = page.route.id;
			const matchedRoute = routeTitles.find((item) => route?.includes(item.path));
			return matchedRoute?.title || 'vowsmarry';
		})()
	); 
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{title}</title>
</svelte:head>

<div class="flex h-screen w-full items-center justify-center px-4">
	{@render children()}
</div>
