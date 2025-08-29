<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { AlertCircle } from 'lucide-svelte';

	interface Props {
		label: string;
		name: string;
		value?: string;
		type?: string;
		placeholder?: string;
		error?: string;
		required?: boolean;
		disabled?: boolean;
		readonly?: boolean;
		description?: string;
		autocomplete?: string;
		maxlength?: number;
		minlength?: number;
		pattern?: string;
		step?: string;
		min?: string;
		max?: string;
	}

	let {
		label,
		name,
		value = $bindable(''),
		type = 'text',
		placeholder = '',
		error,
		required = false,
		disabled = false,
		readonly = false,
		description,
		autocomplete,
		maxlength,
		minlength,
		pattern,
		step,
		min,
		max
	}: Props = $props();

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

	<!-- Input -->
	<div class="relative">
		<Input
			id={fieldId}
			{name}
			{type}
			bind:value
			{placeholder}
			{disabled}
			{readonly}
			autocomplete={autocomplete as any}
			{maxlength}
			{minlength}
			{pattern}
			{step}
			{min}
			{max}
			aria-describedby={ariaDescribedBy}
			aria-invalid={!!error}
			class={error ? 'border-destructive focus-visible:ring-destructive' : ''}
		/>
	</div>

	<!-- Error message -->
	{#if error}
		<div id={errorId} class="flex items-center gap-2 text-sm text-destructive" role="alert">
			<AlertCircle class="h-4 w-4 flex-shrink-0" />
			<span>{error}</span>
		</div>
	{/if}
</div>