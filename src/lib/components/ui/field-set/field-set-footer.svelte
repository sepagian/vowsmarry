<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { FieldSetFooterProps } from './types';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...rest
	}: FieldSetFooterProps = $props();
</script>

<div
	bind:this={ref}
	class={cn('border-t border-inherit ', className)}
	{...rest}
>
	{@render children?.()}
</div>
