<script lang="ts">
	import type { SpacingValue } from '$lib/design-tokens/spacing';
	import { cn } from '$lib/utils/index';

	interface Props {
		/**
		 * Flex direction
		 */
		direction?: 'row' | 'row-reverse' | 'col' | 'col-reverse' | { [key: string]: string };
		/**
		 * Justify content (main axis alignment)
		 */
		justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly' | { [key: string]: string };
		/**
		 * Align items (cross axis alignment)
		 */
		align?: 'start' | 'end' | 'center' | 'stretch' | 'baseline' | { [key: string]: string };
		/**
		 * Flex wrap
		 */
		wrap?: 'nowrap' | 'wrap' | 'wrap-reverse' | { [key: string]: string };
		/**
		 * Gap between flex items
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
		 * Additional CSS classes
		 */
		class?: string;
		/**
		 * HTML element type
		 */
		as?: 'div' | 'section' | 'article' | 'nav' | 'header' | 'footer' | 'ul' | 'ol';
		/**
		 * Children content
		 */
		children?: import('svelte').Snippet;
	}

	let {
		direction = 'row',
		justify = 'start',
		align = 'stretch',
		wrap = 'nowrap',
		gap,
		gapX,
		gapY,
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

	// Generate flex classes based on props
	const flexClasses = $derived(
		cn(
			// Base flex styles
			'flex',
			
			// Direction
			generateResponsiveClasses('flex', direction),
			
			// Justify content
			generateResponsiveClasses('justify', justify),
			
			// Align items
			generateResponsiveClasses('items', align),
			
			// Wrap
			generateResponsiveClasses('flex', wrap),
			
			// Gap
			gap && generateResponsiveClasses('gap', gap),
			gapX && generateResponsiveClasses('gap-x', gapX),
			gapY && generateResponsiveClasses('gap-y', gapY),
			
			// Custom classes
			className
		)
	);
</script>

<svelte:element this={as} class={flexClasses}>
	{@render children?.()}
</svelte:element>