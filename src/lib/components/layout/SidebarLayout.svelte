<script lang="ts">
	import { Flex, Stack } from '$lib/components/layout/index';
	import { cn } from '$lib/utils/index';

	interface Props {
		/**
		 * Sidebar width
		 */
		sidebarWidth?: 'sm' | 'md' | 'lg';
		/**
		 * Sidebar position
		 */
		position?: 'left' | 'right';
		/**
		 * Whether sidebar is collapsible
		 */
		collapsible?: boolean;
		/**
		 * Whether sidebar is collapsed (for collapsible sidebar)
		 */
		collapsed?: boolean;
		/**
		 * Whether to show sidebar on mobile
		 */
		showOnMobile?: boolean;
		/**
		 * Additional CSS classes
		 */
		class?: string;
		/**
		 * Sidebar content
		 */
		sidebar?: import('svelte').Snippet;
		/**
		 * Main content
		 */
		children?: import('svelte').Snippet;
	}

	let {
		sidebarWidth = 'md',
		position = 'left',
		collapsible = false,
		collapsed = false,
		showOnMobile = false,
		class: className = '',
		sidebar,
		children
	}: Props = $props();

	const widthClasses = {
		sm: collapsed ? 'w-16' : 'w-48',
		md: collapsed ? 'w-16' : 'w-64',
		lg: collapsed ? 'w-16' : 'w-80'
	};

	const sidebarClasses = $derived(
		cn(
			'flex-shrink-0 border-base-300 bg-base-50',
			widthClasses[sidebarWidth],
			position === 'left' ? 'border-r' : 'border-l',
			!showOnMobile && 'hidden lg:flex',
			showOnMobile && 'flex',
			'flex-col transition-all duration-200 ease-in-out'
		)
	);

	const containerClasses = $derived(
		cn(
			'flex h-full min-h-screen',
			position === 'right' && 'flex-row-reverse',
			className
		)
	);
</script>

<div class={containerClasses}>
	<!-- Sidebar -->
	{#if sidebar}
		<aside class={sidebarClasses}>
			<div class="flex-1 overflow-y-auto p-4">
				{@render sidebar()}
			</div>
		</aside>
	{/if}

	<!-- Main Content -->
	<main class="flex-1 overflow-hidden">
		<div class="h-full p-6">
			{@render children?.()}
		</div>
	</main>
</div>