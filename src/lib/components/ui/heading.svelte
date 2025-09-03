<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	interface HeadingProps {
		/**
		 * The heading level (1-6)
		 */
		level: 1 | 2 | 3 | 4 | 5 | 6;
		
		/**
		 * Whether to use responsive typography
		 */
		responsive?: boolean;
		
		/**
		 * Additional CSS classes
		 */
		class?: string;
		
		/**
		 * Content to render
		 */
		children: Snippet;
	}

	let {
		level,
		responsive = true,
		class: className,
		children
	}: HeadingProps = $props();

	// Map heading levels to CSS classes
	const headingClasses = {
		1: responsive ? 'text-responsive-h1' : 'text-h1',
		2: responsive ? 'text-responsive-h2' : 'text-h2',
		3: responsive ? 'text-responsive-h3' : 'text-h3',
		4: 'text-h4',
		5: 'text-h5',
		6: 'text-h6'
	};

	// Get the appropriate class for the heading level
	const headingClass = headingClasses[level];
	
	// Combine classes
	const classes = cn(headingClass, className);
</script>

<!-- Dynamic heading element rendering based on level -->
{#if level === 1}
	<h1 class={classes}>{@render children()}</h1>
{:else if level === 2}
	<h2 class={classes}>{@render children()}</h2>
{:else if level === 3}
	<h3 class={classes}>{@render children()}</h3>
{:else if level === 4}
	<h4 class={classes}>{@render children()}</h4>
{:else if level === 5}
	<h5 class={classes}>{@render children()}</h5>
{:else if level === 6}
	<h6 class={classes}>{@render children()}</h6>
{/if}