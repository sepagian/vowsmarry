<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import { CircleAlert } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		label: string;
		name: string;
		error?: string;
		required?: boolean;
		description?: string;
		disabled?: boolean;
		children: Snippet<[string, string | undefined, boolean]>;
	}

	let { label, name, error, required = false, description, disabled = false, children }: Props = $props();

	// Generate unique ID for accessibility
	const fieldId = `field-${name}-${Math.random().toString(36).substr(2, 9)}`;
	const errorId = error ? `${fieldId}-error` : undefined;
	const descriptionId = description ? `${fieldId}-description` : undefined;

	// Build aria-describedby attribute
	const ariaDescribedBy = $derived([errorId, descriptionId].filter(Boolean).join(' ') || undefined);
</script>

<div class="space-y-2">
	<!-- Label -->
	<Label for={fieldId} class="text-sm font-medium {disabled ? 'text-muted-foreground' : ''}">
		{label}
		{#if required}
			<span class="text-destructive ml-1" aria-label="required">*</span>
		{/if}
	</Label>

	<!-- Description -->
	{#if description}
		<p id={descriptionId} class="text-sm text-muted-foreground">
			{description}
		</p>
	{/if}

	<!-- Input slot -->
	<div class="relative">
		{@render children(fieldId, ariaDescribedBy, !!error)}
	</div>

	<!-- Error message -->
	{#if error}
		<div id={errorId} class="flex items-center gap-2 text-sm text-destructive" role="alert">
			<CircleAlert class="h-4 w-4 flex-shrink-0" />
			<span>{error}</span>
		</div>
	{/if}
</div>