<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	interface TextProps {
		/**
		 * The HTML element to render
		 */
		as?: 'p' | 'span' | 'div';
		
		/**
		 * Text size variant
		 */
		size?: 'large' | 'base' | 'small';
		
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
		as = 'p',
		size = 'base',
		responsive = false,
		class: className,
		children
	}: TextProps = $props();

	// Map text sizes to CSS classes
	const sizeClasses = {
		large: 'text-body-large',
		base: responsive ? 'text-responsive-body' : 'text-body',
		small: 'text-body-small'
	};

	// Get the appropriate class for the text size
	const sizeClass = sizeClasses[size];
	
	// Combine classes
	const classes = cn(sizeClass, className);
</script>

<!-- Dynamic element rendering based on 'as' prop -->
{#if as === 'span'}
	<span class={classes}>{@render children()}</span>
{:else if as === 'div'}
	<div class={classes}>{@render children()}</div>
{:else}
	<p class={classes}>{@render children()}</p>
{/if}