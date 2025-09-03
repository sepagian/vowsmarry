<script lang="ts">
	import { Container, Grid, GridItem, Stack } from '$lib/components/layout/index';
	import { cn } from '$lib/utils/index';

	interface Props {
		/**
		 * Dashboard layout variant
		 */
		variant?: 'default' | 'sidebar' | 'full-width';
		/**
		 * Whether to show header
		 */
		showHeader?: boolean;
		/**
		 * Whether to show footer
		 */
		showFooter?: boolean;
		/**
		 * Container size for content
		 */
		containerSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
		/**
		 * Additional CSS classes
		 */
		class?: string;
		/**
		 * Header content
		 */
		header?: import('svelte').Snippet;
		/**
		 * Sidebar content (for sidebar variant)
		 */
		sidebar?: import('svelte').Snippet;
		/**
		 * Main content
		 */
		children?: import('svelte').Snippet;
		/**
		 * Footer content
		 */
		footer?: import('svelte').Snippet;
	}

	let {
		variant = 'default',
		showHeader = true,
		showFooter = false,
		containerSize = '7xl',
		class: className = '',
		header,
		sidebar,
		children,
		footer
	}: Props = $props();

	const layoutClasses = $derived(
		cn(
			'min-h-screen flex flex-col',
			className
		)
	);
</script>

<div class={layoutClasses}>
	<!-- Header -->
	{#if showHeader && header}
		<header class="sticky top-0 z-50 border-b bg-base-100/95 backdrop-blur supports-[backdrop-filter]:bg-base-100/60">
			<Container size={containerSize} padding="md">
				{@render header()}
			</Container>
		</header>
	{/if}

	<!-- Main Content Area -->
	<main class="flex-1">
		{#if variant === 'sidebar' && sidebar}
			<!-- Sidebar Layout -->
			<div class="flex h-full">
				<!-- Sidebar -->
				<aside class="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:bg-base-50">
					<div class="flex-1 overflow-y-auto py-section px-4">
						{@render sidebar()}
					</div>
				</aside>

				<!-- Main Content with Sidebar -->
				<div class="flex-1 overflow-hidden">
					<Container size={containerSize} padding="md" class="py-section">
						{@render children?.()}
					</Container>
				</div>
			</div>
		{:else if variant === 'full-width'}
			<!-- Full Width Layout -->
			<div class="py-section">
				{@render children?.()}
			</div>
		{:else}
			<!-- Default Container Layout -->
			<Container size={containerSize} padding="md" class="py-section">
				{@render children?.()}
			</Container>
		{/if}
	</main>

	<!-- Footer -->
	{#if showFooter && footer}
		<footer class="border-t bg-base-50">
			<Container size={containerSize} padding="md" class="py-6">
				{@render footer()}
			</Container>
		</footer>
	{/if}
</div>