<script lang="ts">
	import { page } from '$app/state';
	import { ModeWatcher } from 'mode-watcher';
	import AppearanceSwitcher from '$lib/components/appearance-switcher.svelte';
	import favicon from '$lib/assets/favicon.svg';
	let { children } = $props();

	const routeTitles = [
		{ path: '/login', title: 'Login to vowsmarry' },
		{ path: '/register', title: 'Register to vowsmarry' },
		{ path: '/forgot-password', title: 'Forgot Password - vowsmarry' },
		{ path: '/reset-password', title: 'Reset Password - vowsmarry' },
	];

	const title = $derived(
		(() => {
			const route = page.route.id;
			const matchedRoute = routeTitles.find((item) => route?.includes(item.path));
			return matchedRoute?.title || 'vowsmarry';
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

<ModeWatcher />
<div class="grid min-h-svh lg:grid-cols-2">
	<div class="flex flex-col p-4">
		<div class="flex justify-between items-center gap-2">
			<a
				href="/"
				class="flex items-center gap-2 font-bold text-sm"
			>
				<div class="i-lucide:arrow-left"></div>
				Back to homepage
			</a>
			<AppearanceSwitcher />
		</div>
		<div class="flex flex-1 items-center justify-center">
			<div class="w-full max-w-md">
				{@render children()}
			</div>
		</div>
	</div>
	<div class=" relative hidden lg:block p-4">
		<div class="w-full h-full bg-neutral-200 dark:bg-neutral-800 rounded-xl"></div>
	</div>
</div>
