<script lang="ts">
	import type { SpacingValue } from '$lib/design-tokens/spacing';
	import type { GridCols } from '$lib/design-tokens/layout';
	import { Grid } from '$lib/components/layout/index';
	import { cn } from '$lib/utils/index';

	interface Props {
		/**
		 * Number of columns for different screen sizes
		 */
		cols?: GridCols | { [key: string]: GridCols };
		/**
		 * Gap between cards
		 */
		gap?: SpacingValue | { [key: string]: SpacingValue };
		/**
		 * Minimum card width for auto-fit layout
		 */
		minCardWidth?: string;
		/**
		 * Whether to use auto-fit layout (overrides cols)
		 */
		autoFit?: boolean;
		/**
		 * Additional CSS classes
		 */
		class?: string;
		/**
		 * Children content (should be Card components)
		 */
		children?: import('svelte').Snippet;
	}

	let {
		cols = 3,
		gap = 6,
		minCardWidth = '300px',
		autoFit = false,
		class: className = '',
		children
	}: Props = $props();
</script>

{#if autoFit}
	<Grid autoFit={minCardWidth} {gap} class={cn('w-full', className)}>
		{@render children?.()}
	</Grid>
{:else}
	<Grid {cols} {gap} class={cn('w-full', className)}>
		{@render children?.()}
	</Grid>
{/if}