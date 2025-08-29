<script lang="ts">
	import FormField from './form-field.svelte';

	export let label: string;
	export let name: string;
	export let value: string = '';
	export let options: Array<{ value: string; label: string; disabled?: boolean }> = [];
	export let placeholder: string = 'Select an option';
	export let error: string | undefined = undefined;
	export let required: boolean = false;
	export let disabled: boolean = false;
	export let description: string | undefined = undefined;

	// Handle change events
	function handleChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		value = target.value;
	}
</script>

<FormField {label} {name} {error} {required} {description} {disabled}>
	<select
		slot="default"
		let:fieldId
		let:ariaDescribedBy
		let:hasError
		id={fieldId}
		{name}
		{value}
		{disabled}
		aria-describedby={ariaDescribedBy}
		aria-invalid={hasError}
		class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 {hasError ? 'border-destructive focus:ring-destructive' : ''}"
		on:change={handleChange}
		on:blur
		on:focus
	>
		{#if placeholder}
			<option value="" disabled selected={!value}>
				{placeholder}
			</option>
		{/if}
		{#each options as option}
			<option value={option.value} disabled={option.disabled}>
				{option.label}
			</option>
		{/each}
	</select>
</FormField>