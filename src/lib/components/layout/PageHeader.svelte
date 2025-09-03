<script lang="ts">
	import Stack from './Stack.svelte';
	import Flex from './Flex.svelte';
	import { cn } from '$lib/utils/index.js';

	interface Props {
		/**
		 * Page title
		 */
		title?: string;
		/**
		 * Page description
		 */
		description?: string;
		/**
		 * Whether to show divider below header
		 */
		showDivider?: boolean;
		/**
		 * Additional CSS classes
		 */
		class?: string;
		/**
		 * Title content (overrides title prop)
		 */
		titleSlot?: import('svelte').Snippet;
		/**
		 * Description content (overrides description prop)
		 */
		descriptionSlot?: import('svelte').Snippet;
		/**
		 * Actions content (buttons, etc.)
		 */
		actions?: import('svelte').Snippet;
		/**
		 * Breadcrumb content
		 */
		breadcrumb?: import('svelte').Snippet;
	}

	let {
		title,
		description,
		showDivider = true,
		class: className = '',
		titleSlot,
		descriptionSlot,
		actions,
		breadcrumb
	}: Props = $props();

	const headerClasses = $derived(
		cn(
			'w-full',
			showDivider && 'border-b pb-6 mb-6',
			className
		)
	);
</script>

<header class={headerClasses}>
	<Stack direction="vertical" spacing={4}>
		<!-- Breadcrumb -->
		{#if breadcrumb}
			<div>
				{@render breadcrumb()}
			</div>
		{/if}

		<!-- Title and Actions Row -->
		<Flex justify="between" align="start" gap={4} wrap="wrap">
			<!-- Title and Description -->
			<Stack direction="vertical" spacing={2} class="flex-1 min-w-0">
				{#if titleSlot}
					{@render titleSlot()}
				{:else if title}
					<h1 class="text-3xl font-bold tracking-tight text-base-content">
						{title}
					</h1>
				{/if}

				{#if descriptionSlot}
					{@render descriptionSlot()}
				{:else if description}
					<p class="text-base text-base-content/70">
						{description}
					</p>
				{/if}
			</Stack>

			<!-- Actions -->
			{#if actions}
				<div class="flex-shrink-0">
					{@render actions()}
				</div>
			{/if}
		</Flex>
	</Stack>
</header>