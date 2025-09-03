<script lang="ts">
	import type { SpacingValue } from '$lib/design-tokens/spacing';
	import { Flex } from '$lib/components/layout/index';
	import { cn } from '$lib/utils/index';

	interface Props {
		/**
		 * Button group orientation
		 */
		orientation?: 'horizontal' | 'vertical';
		/**
		 * Alignment of buttons
		 */
		align?: 'start' | 'center' | 'end' | 'stretch';
		/**
		 * Justification of buttons
		 */
		justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
		/**
		 * Spacing between buttons
		 */
		spacing?: SpacingValue;
		/**
		 * Whether buttons should wrap on smaller screens
		 */
		wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
		/**
		 * Whether to make buttons full width on mobile
		 */
		fullWidthMobile?: boolean;
		/**
		 * Additional CSS classes
		 */
		class?: string;
		/**
		 * Children content (Button components)
		 */
		children?: import('svelte').Snippet;
	}

	let {
		orientation = 'horizontal',
		align = 'center',
		justify = 'start',
		spacing = 3,
		wrap = 'wrap',
		fullWidthMobile = false,
		class: className = '',
		children
	}: Props = $props();

	const direction = orientation === 'horizontal' ? 'row' : 'col';
	
	const buttonGroupClasses = $derived(
		cn(
			fullWidthMobile && 'w-full [&>*]:w-full sm:[&>*]:w-auto',
			className
		)
	);
</script>

<Flex
	{direction}
	{align}
	{justify}
	gap={spacing}
	{wrap}
	class={buttonGroupClasses}
>
	{@render children?.()}
</Flex>