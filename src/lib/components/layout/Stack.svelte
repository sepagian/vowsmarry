<script lang="ts">
	import type { SpacingValue } from '$lib/design-tokens/spacing';
	import { cn } from '$lib/utils/index';

	interface Props {
		/**
		 * Direction of the stack
		 */
		direction?: 'vertical' | 'horizontal';
		/**
		 * Spacing between stack items
		 */
		spacing?: SpacingValue | { [key: string]: SpacingValue };
		/**
		 * Alignment of items along the main axis
		 */
		justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
		/**
		 * Alignment of items along the cross axis
		 */
		align?: 'start' | 'end' | 'center' | 'stretch' | 'baseline';
		/**
		 * Whether items should wrap
		 */
		wrap?: boolean;
		/**
		 * Additional CSS classes
		 */
		class?: string;
		/**
		 * HTML element type
		 */
		as?: 'div' | 'section' | 'article' | 'ul' | 'ol' | 'nav';
		/**
		 * Children content
		 */
		children?: import('svelte').Snippet;
	}

	let {
		direction = 'vertical',
		spacing = 4,
		justify = 'start',
		align = 'stretch',
		wrap = false,
		class: className = '',
		as = 'div',
		children
	}: Props = $props();

	// Generate responsive classes for spacing
	function generateSpacingClasses(value: any): string[] {
		if (typeof value === 'object' && value !== null) {
			return Object.entries(value).map(([breakpoint, val]) => {
				const bp = breakpoint === 'default' ? '' : `${breakpoint}:`;
				const property = direction === 'vertical' ? 'space-y' : 'space-x';
				return `${bp}${property}-${val}`;
			});
		}
		const property = direction === 'vertical' ? 'space-y' : 'space-x';
		return [`${property}-${value}`];
	}

	// Generate stack classes based on props
	const stackClasses = $derived(
		cn(
			// Base flex styles
			'flex',
			
			// Direction
			direction === 'vertical' ? 'flex-col' : 'flex-row',
			
			// Wrapping
			wrap && 'flex-wrap',
			
			// Justify content (main axis)
			justify === 'start' && 'justify-start',
			justify === 'end' && 'justify-end',
			justify === 'center' && 'justify-center',
			justify === 'between' && 'justify-between',
			justify === 'around' && 'justify-around',
			justify === 'evenly' && 'justify-evenly',
			
			// Align items (cross axis)
			align === 'start' && 'items-start',
			align === 'end' && 'items-end',
			align === 'center' && 'items-center',
			align === 'stretch' && 'items-stretch',
			align === 'baseline' && 'items-baseline',
			
			// Spacing between items
			generateSpacingClasses(spacing),
			
			// Custom classes
			className
		)
	);
</script>

<svelte:element this={as} class={stackClasses}>
	{@render children?.()}
</svelte:element>