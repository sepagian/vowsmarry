<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { FieldSetTitleProps } from './types';

	let {
		ref = $bindable(null),
		class: className,
		level = 3,
		children,
		...rest
	}: FieldSetTitleProps = $props();
</script>

<div
	bind:this={ref}
	role="heading"
	aria-level={level}
	bind:this={ref}
	class={cn('border-b leading-none tracking-tight', className)}
	{...rest}
>
	{@render children?.()}
</div>
