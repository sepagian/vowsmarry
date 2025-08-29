<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import { AlertCircle } from 'lucide-svelte';

	export let label: string;
	export let name: string;
	export let checked: boolean = false;
	export let value: string = '';
	export let error: string | undefined = undefined;
	export let required: boolean = false;
	export let disabled: boolean = false;
	export let description: string | undefined = undefined;

	// Generate unique ID for accessibility
	const fieldId = `checkbox-${name}-${Math.random().toString(36).substr(2, 9)}`;
	const errorId = error ? `${fieldId}-error` : undefined;
	const descriptionId = description ? `${fieldId}-description` : undefined;

	// Build aria-describedby attribute
	$: ariaDescribedBy = [errorId, descriptionId].filter(Boolean).join(' ') || undefined;

	// Handle checkbox change
	function handleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		checked = target.checked;
	}
</script>

<div class="space-y-2">
	<div class="flex items-start space-x-2">
		<Checkbox
			id={fieldId}
			{name}
			{value}
			{checked}
			{disabled}
			aria-describedby={ariaDescribedBy}
			aria-invalid={!!error}
			class={error ? 'border-destructive' : ''}
			on:change={handleChange}
		/>
		<div class="grid gap-1.5 leading-none">
			<Label
				for={fieldId}
				class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 {disabled ? 'text-muted-foreground' : ''}"
			>
				{label}
				{#if required}
					<span class="text-destructive ml-1" aria-label="required">*</span>
				{/if}
			</Label>
			{#if description}
				<p id={descriptionId} class="text-xs text-muted-foreground">
					{description}
				</p>
			{/if}
		</div>
	</div>

	<!-- Error message -->
	{#if error}
		<div id={errorId} class="flex items-center gap-2 text-sm text-destructive" role="alert">
			<AlertCircle class="h-4 w-4 flex-shrink-0" />
			<span>{error}</span>
		</div>
	{/if}
</div>