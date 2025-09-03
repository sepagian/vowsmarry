<script lang="ts">
	import type { GridColSpan, GridRowSpan } from '$lib/design-tokens/layout';
	import { cn } from '$lib/utils/index';

	interface Props {
		/**
		 * Column span
		 */
		colSpan?: GridColSpan | { [key: string]: GridColSpan };
		/**
		 * Row span
		 */
		rowSpan?: GridRowSpan | { [key: string]: GridRowSpan };
		/**
		 * Column start position
		 */
		colStart?: number | 'auto' | { [key: string]: number | 'auto' };
		/**
		 * Column end position
		 */
		colEnd?: number | 'auto' | { [key: string]: number | 'auto' };
		/**
		 * Row start position
		 */
		rowStart?: number | 'auto' | { [key: string]: number | 'auto' };
		/**
		 * Row end position
		 */
		rowEnd?: number | 'auto' | { [key: string]: number | 'auto' };
		/**
		 * Justify self (horizontal alignment within grid cell)
		 */
		justifySelf?: 'auto' | 'start' | 'end' | 'center' | 'stretch';
		/**
		 * Align self (vertical alignment within grid cell)
		 */
		alignSelf?: 'auto' | 'start' | 'end' | 'center' | 'stretch';
		/**
		 * Additional CSS classes
		 */
		class?: string;
		/**
		 * HTML element type
		 */
		as?: 'div' | 'section' | 'article' | 'li';
		/**
		 * Children content
		 */
		children?: import('svelte').Snippet;
	}

	let {
		colSpan,
		rowSpan,
		colStart,
		colEnd,
		rowStart,
		rowEnd,
		justifySelf,
		alignSelf,
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

	// Generate grid item classes based on props
	const gridItemClasses = $derived(
		cn(
			// Column span
			colSpan && generateResponsiveClasses('col-span', colSpan),
			
			// Row span
			rowSpan && generateResponsiveClasses('row-span', rowSpan),
			
			// Column start/end
			colStart && generateResponsiveClasses('col-start', colStart),
			colEnd && generateResponsiveClasses('col-end', colEnd),
			
			// Row start/end
			rowStart && generateResponsiveClasses('row-start', rowStart),
			rowEnd && generateResponsiveClasses('row-end', rowEnd),
			
			// Self alignment
			justifySelf && `justify-self-${justifySelf}`,
			alignSelf && `self-${alignSelf}`,
			
			// Custom classes
			className
		)
	);
</script>

<svelte:element this={as} class={gridItemClasses}>
	{@render children?.()}
</svelte:element>