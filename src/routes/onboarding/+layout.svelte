<script lang="ts">
	import { page } from '$app/state';
	import { enhance } from '$app/forms';
	import { ModeWatcher } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index';

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
			<div class="flex justify-end gap-4">
				<AppearanceSwitcher />
				<form
					method="POST"
					action="/logout"
					use:enhance={() => {
						return async ({ update }) => {
							await update();
						};
					}}
				>
					<Button
						variant="outline"
						class="px-2"
						onclick={(e: MouseEvent & { currentTarget: HTMLButtonElement }) => {
							e.preventDefault();
							const form = e.currentTarget.closest('form');
							if (form) form.submit();
						}}
					>
						<div class="i-lucide:log-out h-5 w-5"></div>
					</Button>
				</form>
			</div>
		</div>
		<div class="flex flex-1 items-center justify-center">
			<div class="w-full">
				{@render children()}
			</div>
		</div>
	</div>
</div>
