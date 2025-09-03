<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	interface TypographyProps {
		/**
		 * The HTML element to render
		 */
		as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'label' | 'code';
		
		/**
		 * Typography variant to apply
		 */
		variant?: 
			| 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
			| 'body-large' | 'body' | 'body-small'
			| 'button' | 'label' | 'caption' | 'code';
		
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
		variant = 'body',
		responsive = false,
		class: className,
		children
	}: TypographyProps = $props();

	// Map variants to CSS classes
	const variantClasses = {
		h1: responsive ? 'text-responsive-h1' : 'text-h1',
		h2: responsive ? 'text-responsive-h2' : 'text-h2',
		h3: responsive ? 'text-responsive-h3' : 'text-h3',
		h4: 'text-h4',
		h5: 'text-h5',
		h6: 'text-h6',
		'body-large': 'text-body-large',
		body: responsive ? 'text-responsive-body' : 'text-body',
		'body-small': 'text-body-small',
		button: 'text-button',
		label: 'text-label',
		caption: 'text-caption',
		code: 'text-code'
	};

	// Get the appropriate class for the variant
	const variantClass = variantClasses[variant] || 'text-body';
	
	// Combine classes
	const classes = cn(variantClass, className);
</script>

<!-- Dynamic element rendering based on 'as' prop -->
{#if as === 'h1'}
	<h1 class={classes}>{@render children()}</h1>
{:else if as === 'h2'}
	<h2 class={classes}>{@render children()}</h2>
{:else if as === 'h3'}
	<h3 class={classes}>{@render children()}</h3>
{:else if as === 'h4'}
	<h4 class={classes}>{@render children()}</h4>
{:else if as === 'h5'}
	<h5 class={classes}>{@render children()}</h5>
{:else if as === 'h6'}
	<h6 class={classes}>{@render children()}</h6>
{:else if as === 'span'}
	<span class={classes}>{@render children()}</span>
{:else if as === 'div'}
	<div class={classes}>{@render children()}</div>
{:else if as === 'label'}
	<label class={classes}>{@render children()}</label>
{:else if as === 'code'}
	<code class={classes}>{@render children()}</code>
{:else}
	<p class={classes}>{@render children()}</p>
{/if}