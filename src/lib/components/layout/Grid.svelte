<script lang="ts">
	import type { GridCols, GridRows } from '$lib/design-tokens/layout';
	import type { SpacingValue } from '$lib/design-tokens/spacing';
	import { cn } from '$lib/utils/index';

	interface Props {
		/**
		 * Number of grid columns
		 */
		cols?: GridCols | { [key: string]: GridCols };
		/**
		 * Number of grid rows
		 */
		rows?: GridRows | { [key: string]: GridRows };
		/**
		 * Gap between grid items
		 */
		gap?: SpacingValue | { [key: string]: SpacingValue };
		/**
		 * Gap between columns
		 */
		gapX?: SpacingValue | { [key: string]: SpacingValue };
		/**
		 * Gap between rows
		 */
		gapY?: SpacingValue | { [key: string]: SpacingValue };
		/**
		 * Auto-fit columns with minimum width
		 */
		autoFit?: string;
		/**
		 * Auto-fill columns with minimum width
		 */
		autoFill?: string;
		/**
		 * Additional CSS classes
		 */
		class?: string;
		/**
		 * HTML element type
		 */
		as?: 'div' | 'section' | 'article' | 'ul' | 'ol';
		/**
		 * Children content
		 */
		children?: import('svelte').Snippet;
	}

	let {
		cols = 1,
		rows,
		gap,
		gapX,
		gapY,
		autoFit,
		autoFill,
		class: className = '',
		as = 'div',
		children
	}: Props = $props();

	// Generate responsive classes for a property
	function generateResponsiveClasses(
		property: string,
		value: any,
		prefix: string = ''
	): string[] {
		if (typeof value === 'object' && value !== null) {
			return Object.entries(value).map(([breakpoint, val]) => {
				const bp = breakpoint === 'default' ? '' : `${breakpoint}:`;
				return `${bp}${prefix}${property}-${val}`;
			});
		}
		return [`${prefix}${property}-${value}`];
	}

	// Generate grid classes based on props
	const gridClasses = $derived(
		cn(
			// Base grid styles
			'grid',
			
			// Auto-fit or auto-fill
			autoFit && `grid-cols-[repeat(auto-fit,minmax(${autoFit},1fr))]`,
			autoFill && `grid-cols-[repeat(auto-fill,minmax(${autoFill},1fr))]`,
			
			// Grid columns (if not using auto-fit/auto-fill)
			!autoFit && !autoFill && generateResponsiveClasses('grid-cols', cols),
			
			// Grid rows
			rows && generateResponsiveClasses('grid-rows', rows),
			
			// Gap
			gap && generateResponsiveClasses('gap', gap),
			gapX && generateResponsiveClasses('gap-x', gapX),
			gapY && generateResponsiveClasses('gap-y', gapY),
			
			// Custom classes
			className
		)
	);
</script>

<svelte:element this={as} class={gridClasses}>
	{@render children?.()}
</svelte:element>