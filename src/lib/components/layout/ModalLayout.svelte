<script lang="ts">
	import { Stack, Flex } from '$lib/components/layout/index';
	import { cn } from '$lib/utils/index';

	interface Props {
		/**
		 * Modal size
		 */
		size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
		/**
		 * Whether to show close button
		 */
		showClose?: boolean;
		/**
		 * Whether to show header divider
		 */
		showHeaderDivider?: boolean;
		/**
		 * Whether to show footer divider
		 */
		showFooterDivider?: boolean;
		/**
		 * Additional CSS classes
		 */
		class?: string;
		/**
		 * Modal header content
		 */
		header?: import('svelte').Snippet;
		/**
		 * Modal body content
		 */
		children?: import('svelte').Snippet;
		/**
		 * Modal footer content
		 */
		footer?: import('svelte').Snippet;
		/**
		 * Close button click handler
		 */
		onClose?: () => void;
	}

	let {
		size = 'md',
		showClose = true,
		showHeaderDivider = true,
		showFooterDivider = true,
		class: className = '',
		header,
		children,
		footer,
		onClose
	}: Props = $props();

	const sizeClasses = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl',
		'2xl': 'max-w-2xl',
		full: 'max-w-full'
	};

	const modalClasses = $derived(
		cn(
			'w-full mx-4',
			sizeClasses[size],
			'bg-base-100 rounded-lg shadow-lg',
			'flex flex-col max-h-[90vh]',
			className
		)
	);
</script>

<div class={modalClasses}>
	<!-- Header -->
	{#if header}
		<div class={cn('px-6 py-4', showHeaderDivider && 'border-b border-base-300')}>
			<Flex justify="between" align="center" gap={4}>
				<div class="flex-1 min-w-0">
					{@render header()}
				</div>
				
				{#if showClose && onClose}
					<button
						type="button"
						class="flex-shrink-0 p-1 rounded-md hover:bg-base-200 transition-colors"
						onclick={onClose}
						aria-label="Close modal"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				{/if}
			</Flex>
		</div>
	{/if}

	<!-- Body -->
	{#if children}
		<div class="flex-1 overflow-y-auto px-6 py-4">
			{@render children()}
		</div>
	{/if}

	<!-- Footer -->
	{#if footer}
		<div class={cn('px-6 py-4', showFooterDivider && 'border-t border-base-300')}>
			{@render footer()}
		</div>
	{/if}
</div>