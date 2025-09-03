<script lang="ts">
	import { Stack, Flex } from '$lib/components/layout/index';
	import { cn } from '$lib/utils/index';

	interface Props {
		/**
		 * Whether the table is responsive (scrollable on mobile)
		 */
		responsive?: boolean;
		/**
		 * Whether to show table border
		 */
		bordered?: boolean;
		/**
		 * Whether to show striped rows
		 */
		striped?: boolean;
		/**
		 * Table size
		 */
		size?: 'sm' | 'md' | 'lg';
		/**
		 * Additional CSS classes
		 */
		class?: string;
		/**
		 * Table header content
		 */
		header?: import('svelte').Snippet;
		/**
		 * Table body content
		 */
		children?: import('svelte').Snippet;
		/**
		 * Table footer content
		 */
		footer?: import('svelte').Snippet;
		/**
		 * Actions above table (search, filters, etc.)
		 */
		actions?: import('svelte').Snippet;
	}

	let {
		responsive = true,
		bordered = true,
		striped = true,
		size = 'md',
		class: className = '',
		header,
		children,
		footer,
		actions
	}: Props = $props();

	const sizeClasses = {
		sm: 'text-sm',
		md: 'text-base',
		lg: 'text-lg'
	};

	const tableClasses = $derived(
		cn(
			'w-full table-auto',
			sizeClasses[size],
			bordered && 'border border-base-300',
			striped && '[&_tbody_tr:nth-child(even)]:bg-base-50',
			className
		)
	);

	const containerClasses = $derived(
		cn(
			responsive && 'overflow-x-auto',
			'w-full'
		)
	);
</script>

<Stack direction="vertical" spacing={4} class="w-full">
	<!-- Actions Row -->
	{#if actions}
		<div class="w-full">
			{@render actions()}
		</div>
	{/if}

	<!-- Table Container -->
	<div class={containerClasses}>
		<table class={tableClasses}>
			{#if header}
				<thead class="bg-base-100 border-b border-base-300">
					{@render header()}
				</thead>
			{/if}

			{#if children}
				<tbody>
					{@render children()}
				</tbody>
			{/if}

			{#if footer}
				<tfoot class="bg-base-100 border-t border-base-300">
					{@render footer()}
				</tfoot>
			{/if}
		</table>
	</div>
</Stack>