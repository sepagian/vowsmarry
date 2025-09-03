<script lang="ts">
	import type { ContainerSize } from '$lib/design-tokens/layout';
	import { cn } from '$lib/utils/index';

	interface Props {
		/**
		 * Container size - controls max width
		 */
		size?: ContainerSize;
		/**
		 * Whether to center the container
		 */
		center?: boolean;
		/**
		 * Responsive padding
		 */
		padding?: 'none' | 'sm' | 'md' | 'lg';
		/**
		 * Additional CSS classes
		 */
		class?: string;
		/**
		 * HTML element type
		 */
		as?: 'div' | 'section' | 'article' | 'main' | 'aside' | 'header' | 'footer';
		/**
		 * Children content
		 */
		children?: import('svelte').Snippet;
	}

	let {
		size = '7xl',
		center = true,
		padding = 'md',
		class: className = '',
		as = 'div',
		children
	}: Props = $props();

	// Generate container classes based on props
	const containerClasses = $derived(
		cn(
			// Base container styles
			'w-full',
			
			// Max width based on size
			size === 'full' ? 'max-w-full' : `max-w-${size}`,
			
			// Centering
			center && 'mx-auto',
			
			// Responsive padding
			padding === 'sm' && 'px-4 sm:px-6',
			padding === 'md' && 'px-4 sm:px-6 lg:px-8',
			padding === 'lg' && 'px-6 sm:px-8 lg:px-12',
			
			// Custom classes
			className
		)
	);
</script>

<svelte:element this={as} class={containerClasses}>
	{@render children?.()}
</svelte:element>