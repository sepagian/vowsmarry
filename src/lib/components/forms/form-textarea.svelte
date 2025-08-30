<script lang="ts">
	import FormField from './form-field.svelte';

	export let label: string;
	export let name: string;
	export let value: string = '';
	export let placeholder: string = '';
	export let error: string | undefined = undefined;
	export let required: boolean = false;
	export let disabled: boolean = false;
	export let readonly: boolean = false;
	export let description: string | undefined = undefined;
	export let rows: number = 3;
	export let maxlength: number | undefined = undefined;
	export let minlength: number | undefined = undefined;

	// Handle input events
	function handleInput(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		value = target.value;
	}
</script>

<FormField {label} {name} {error} {required} {description} {disabled}>
	{#snippet children(fieldId: string, ariaDescribedBy: string | undefined, hasError: boolean)}
		<textarea
			id={fieldId}
			{name}
			{value}
			{placeholder}
			{disabled}
			{readonly}
			{rows}
			{maxlength}
			{minlength}
			aria-describedby={ariaDescribedBy}
			aria-invalid={hasError}
			class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 {hasError ? 'border-destructive focus-visible:ring-destructive' : ''}"
			on:input={handleInput}
			on:blur
			on:focus
			on:change
		></textarea>
	{/snippet}
</FormField>