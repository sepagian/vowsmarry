<script lang="ts">
	import type { SpacingValue } from '$lib/design-tokens/spacing';
	import { Stack, Grid, GridItem } from '$lib/components/layout/index';
	import { cn } from '$lib/utils/index';

	interface Props {
		/**
		 * Form layout type
		 */
		layout?: 'single' | 'two-column' | 'three-column' | 'mixed';
		/**
		 * Spacing between form fields
		 */
		spacing?: SpacingValue;
		/**
		 * Maximum width of the form
		 */
		maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
		/**
		 * Whether to center the form
		 */
		centered?: boolean;
		/**
		 * Additional CSS classes
		 */
		class?: string;
		/**
		 * Children content (form fields)
		 */
		children?: import('svelte').Snippet;
	}

	let {
		layout = 'single',
		spacing = 6,
		maxWidth = 'lg',
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

	const formClasses = $derived(
		cn(
			'w-full',
			maxWidthClasses[maxWidth],
			centered && 'mx-auto',
			className
		)
	);
</script>

<div class={formClasses}>
	{#if layout === 'single'}
		<Stack direction="vertical" {spacing}>
			{@render children?.()}
		</Stack>
	{:else if layout === 'two-column'}
		<Stack direction="vertical" {spacing}>
			<Grid cols={{ default: 1, md: 2 }} gap={4}>
				{@render children?.()}
			</Grid>
		</Stack>
	{:else if layout === 'three-column'}
		<Stack direction="vertical" {spacing}>
			<Grid cols={{ default: 1, md: 2, lg: 3 }} gap={4}>
				{@render children?.()}
			</Grid>
		</Stack>
	{:else if layout === 'mixed'}
		<!-- Mixed layout allows for custom grid spans -->
		<Grid cols={{ default: 1, md: 2, lg: 3 }} gap={4}>
			{@render children?.()}
		</Grid>
	{/if}
</div>