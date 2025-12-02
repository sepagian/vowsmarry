<script lang="ts">
	import { page } from '$app/state';
	import { ModeWatcher } from 'mode-watcher';
	import AppearanceSwitcher from '$lib/components/appearance-switcher.svelte';
	import favicon from '$lib/assets/favicon.svg';
	let { children } = $props();

	const routeTitles = [{ path: '/onboarding', title: 'Onboarding - vowsmarry' }];

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
<div class="grid min-h-svh">
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
			<div class="w-full">
				{@render children()}
			</div>
		</div>
	</div>
</div>
