<script lang="ts">
	import { Flex } from '$lib/components/layout/index';
	import { cn } from '$lib/utils/index';

	interface Props {
		/**
		 * Whether to show on mobile
		 */
		showOnMobile?: boolean;
		/**
		 * Alignment of breadcrumb
		 */
		align?: 'start' | 'center' | 'end';
		/**
		 * Additional CSS classes
		 */
		class?: string;
		/**
		 * Children content (Breadcrumb component)
		 */
		children?: import('svelte').Snippet;
	}

	let {
		showOnMobile = false,
		align = 'start',
		class: className = '',
		children
	}: Props = $props();

	const alignClasses = {
		start: 'justify-start',
		center: 'justify-center',
		end: 'justify-end'
	};

	const breadcrumbClasses = $derived(
		cn(
			'w-full',
			!showOnMobile && 'hidden sm:flex',
			showOnMobile && 'flex',
			alignClasses[align],
			className
		)
	);
</script>

<div class={breadcrumbClasses}>
	{@render children?.()}
</div>