<script lang="ts">
	import type { SpacingValue } from '$lib/design-tokens/spacing';
	import { Stack } from '$lib/components/layout/index';
	import { cn } from '$lib/utils/index';

	interface Props {
		/**
		 * Spacing between alerts
		 */
		spacing?: SpacingValue;
		/**
		 * Maximum width of alert stack
		 */
		maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
		/**
		 * Position of alert stack
		 */
		position?: 'top' | 'bottom' | 'center';
		/**
		 * Whether to center the stack horizontally
		 */
		centered?: boolean;
		/**
		 * Additional CSS classes
		 */
		class?: string;
		/**
		 * Children content (Alert components)
		 */
		children?: import('svelte').Snippet;
	}

	let {
		spacing = 4,
		maxWidth = 'lg',
		position = 'top',
		centered = true,
		class: className = '',
		children
	}: Props = $props();

	const maxWidthClasses = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl',
		'2xl': 'max-w-2xl',
		full: 'max-w-full'
	};

	const positionClasses = {
		top: 'justify-start',
		bottom: 'justify-end',
		center: 'justify-center'
	};

	const stackClasses = $derived(
		cn(
			'w-full',
			maxWidthClasses[maxWidth],
			centered && 'mx-auto',
			className
		)
	);
</script>

<div class={cn('flex flex-col', positionClasses[position])}>
	<Stack direction="vertical" {spacing} class={stackClasses}>
		{@render children?.()}
	</Stack>
</div>