<script lang="ts">
	import type { SpacingValue } from '$lib/design-tokens/spacing';
	import type { GridCols } from '$lib/design-tokens/layout';
	import { Grid } from '$lib/components/layout/index';
	import { cn } from '$lib/utils/index';

	interface Props {
		/**
		 * Number of stat cards per row for different screen sizes
		 */
		cols?: GridCols | { [key: string]: GridCols };
		/**
		 * Gap between stat cards
		 */
		gap?: SpacingValue | { [key: string]: SpacingValue };
		/**
		 * Whether to use equal height for all cards
		 */
		equalHeight?: boolean;
		/**
		 * Additional CSS classes
		 */
		class?: string;
		/**
		 * Children content (stat cards)
		 */
		children?: import('svelte').Snippet;
	}

	let {
		cols = 4,
		gap = 6,
		equalHeight = true,
		class: className = '',
		children
	}: Props = $props();

	const gridClasses = $derived(
		cn(
			'w-full',
			equalHeight && '[&>*]:h-full',
			className
		)
	);
</script>

<Grid {cols} {gap} class={gridClasses}>
	{@render children?.()}
</Grid>