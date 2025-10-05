<!--
Examples Navigation Component
Provides navigation between different example pages
-->

<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';

	const examples = [
		{
			title: 'Focus Management Demo',
			href: '/examples/focus-management',
			description: 'Interactive focus management testing',
			status: 'ready'
		},
		{
			title: 'Enhanced Form Example',
			href: '/examples/enhanced-form',
			description: 'Complete accessible form implementation',
			status: 'ready'
		},
		{
			title: 'Accessibility Testing',
			href: '/examples/accessibility-testing',
			description: 'Testing tools and utilities',
			status: 'coming-soon'
		}
	];

	const currentPath = $derived($page.url.pathname);
</script>

<nav class="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-lg" aria-label="Examples navigation">
	<Button
		variant={currentPath === '/examples' ? 'default' : 'outline'}
		size="sm"
		href="/examples"
	>
		Overview
	</Button>
	
	{#each examples as example}
		{#if example.status === 'ready'}
			<Button
				variant={currentPath === example.href ? 'default' : 'outline'}
				size="sm"
				href={example.href}
			>
				{example.title}
			</Button>
		{:else}
			<Button
				variant="outline"
				size="sm"
				disabled
				class="opacity-50"
			>
				{example.title}
				<Badge variant="secondary" class="ml-2 text-xs">Coming Soon</Badge>
			</Button>
		{/if}
	{/each}
</nav>