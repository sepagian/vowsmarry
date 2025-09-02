<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { CircleAlert, Eye, EyeOff } from 'lucide-svelte';

	interface Props {
		label: string;
		name: string;
		value?: string;
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
	}

	let {
		label,
		name,
		value = $bindable(''),
		placeholder = '',
		error,
		required = false,
		disabled = false,
		readonly = false,
		description,
		autocomplete,
		maxlength,
		minlength,
		pattern
	}: Props = $props();

	// Password visibility state
	let showPassword = $state(false);

	// Generate unique ID for accessibility
	const fieldId = `field-${name}-${Math.random().toString(36).substr(2, 9)}`;
	const errorId = error ? `${fieldId}-error` : undefined;
	const descriptionId = description ? `${fieldId}-description` : undefined;

	// Build aria-describedby attribute
	const ariaDescribedBy = $derived([errorId, descriptionId].filter(Boolean).join(' ') || undefined);

	// Toggle password visibility
	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}
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

	<!-- Password Input with Toggle -->
	<div class="relative">
		<Input
			id={fieldId}
			{name}
			type={showPassword ? 'text' : 'password'}
			bind:value
			{placeholder}
			{disabled}
			{readonly}
			autocomplete={autocomplete as any}
			{maxlength}
			{minlength}
			{pattern}
			aria-describedby={ariaDescribedBy}
			aria-invalid={!!error}
			class={error ? 'border-destructive focus-visible:ring-destructive pr-10' : 'pr-10'}
		/>
		
		<!-- Password visibility toggle button -->
		<Button
			type="button"
			variant="ghost"
			size="sm"
			class="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
			onclick={togglePasswordVisibility}
			disabled={disabled || readonly}
			aria-label={showPassword ? 'Hide password' : 'Show password'}
		>
			{#if showPassword}
				<EyeOff class="h-4 w-4 text-muted-foreground" />
			{:else}
				<Eye class="h-4 w-4 text-muted-foreground" />
			{/if}
		</Button>
	</div>

	<!-- Error message -->
	{#if error}
		<div id={errorId} class="flex items-center gap-2 text-sm text-destructive" role="alert">
			<CircleAlert class="h-4 w-4 flex-shrink-0" />
			<span>{error}</span>
		</div>
	{/if}
</div>