<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import type { z } from 'zod';
	import { FormValidator, type ValidationResult } from '$lib/validation/form-validator';
	import { toast } from '$lib/stores/toast';
	import { Button } from '$lib/components/ui/button';
	import { Loader } from 'lucide-svelte';

	// Generic type for the schema
	type T = Record<string, any>;

	export let schema: z.ZodSchema<T>;
	export let initialData: Partial<T> = {};
	export let submitLabel: string = 'Submit';
	export let cancelLabel: string = 'Cancel';
	export let showCancel: boolean = false;
	export let loading: boolean = false;
	export let disabled: boolean = false;
	export let validateOnChange: boolean = true;
	export let validateOnBlur: boolean = true;
	export let resetOnSubmit: boolean = false;
	export let showSuccessToast: boolean = true;
	export let successMessage: string = 'Form submitted successfully';

	// Form state
	let formData: Partial<T> = { ...initialData };
	let errors: Record<string, string> = {};
	let touched: Record<string, boolean> = {};
	let isValid: boolean = false;
	let isSubmitting: boolean = false;

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		submit: { data: T; isValid: boolean };
		cancel: void;
		change: { data: Partial<T>; field: string; value: any };
		validate: { isValid: boolean; errors: Record<string, string> };
	}>();

	// Debounced validator for real-time validation
	let debouncedValidator: ((data: any) => void) | null = null;

	onMount(() => {
		if (validateOnChange) {
			debouncedValidator = FormValidator.createDebouncedValidator(
				schema,
				(result: ValidationResult) => {
					errors = result.errors || {};
					isValid = result.success;
					dispatch('validate', { isValid, errors });
				},
				300
			);
		}

		// Initial validation
		validateForm();
	});

	// Validate the entire form
	function validateForm() {
		const result = FormValidator.validatePartial(schema, formData);
		errors = result.errors || {};
		isValid = result.success;
		dispatch('validate', { isValid, errors });
	}

	// Validate a single field
	function validateField(fieldName: string, value: any) {
		const result = FormValidator.validateField(schema, fieldName, value);
		
		if (result.isValid) {
			// Remove error for this field
			const newErrors = { ...errors };
			delete newErrors[fieldName];
			errors = newErrors;
		} else {
			// Add error for this field
			errors = { ...errors, [fieldName]: result.error || 'Invalid input' };
		}

		// Update overall validity
		isValid = !FormValidator.hasErrors(errors);
		dispatch('validate', { isValid, errors });
	}

	// Handle field changes
	function handleFieldChange(fieldName: string, value: any) {
		formData = { ...formData, [fieldName]: value };
		
		dispatch('change', { data: formData, field: fieldName, value });

		if (validateOnChange) {
			if (debouncedValidator) {
				debouncedValidator(formData);
			} else {
				validateField(fieldName, value);
			}
		}
	}

	// Handle field blur
	function handleFieldBlur(fieldName: string) {
		touched = { ...touched, [fieldName]: true };
		
		if (validateOnBlur) {
			validateField(fieldName, formData[fieldName]);
		}
	}

	// Handle form submission
	async function handleSubmit(event: Event) {
		event.preventDefault();
		
		if (isSubmitting || disabled) return;

		isSubmitting = true;

		try {
			// Final validation
			const result = FormValidator.validateForm(schema, formData);
			
			if (!result.success) {
				errors = result.errors || {};
				isValid = false;
				
				// Mark all fields as touched to show errors
				const allFields = Object.keys(formData);
				touched = allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {});
				
				toast.error('Validation Error', 'Please fix the errors below and try again.');
				return;
			}

			// Dispatch submit event with validated data
			dispatch('submit', { data: result.data, isValid: true });

			if (showSuccessToast) {
				toast.success('Success', successMessage);
			}

			if (resetOnSubmit) {
				resetForm();
			}

		} catch (error) {
			console.error('Form submission error:', error);
			toast.error('Submission Error', 'An error occurred while submitting the form.');
		} finally {
			isSubmitting = false;
		}
	}

	// Handle form cancellation
	function handleCancel() {
		dispatch('cancel');
	}

	// Reset form to initial state
	function resetForm() {
		formData = { ...initialData };
		errors = {};
		touched = {};
		isValid = false;
		validateForm();
	}

	// Get error for a specific field (only show if touched)
	function getFieldError(fieldName: string): string | undefined {
		if (!touched[fieldName]) return undefined;
		return FormValidator.getFieldError(errors, fieldName);
	}

	// Check if field has error
	function hasFieldError(fieldName: string): boolean {
		return touched[fieldName] && !!FormValidator.getFieldError(errors, fieldName);
	}

	// Expose methods for parent components
	export function validate() {
		validateForm();
		return isValid;
	}

	export function reset() {
		resetForm();
	}

	export function setFieldValue(fieldName: string, value: any) {
		handleFieldChange(fieldName, value);
	}

	export function setFieldError(fieldName: string, error: string) {
		errors = { ...errors, [fieldName]: error };
		touched = { ...touched, [fieldName]: true };
	}

	export function clearFieldError(fieldName: string) {
		const newErrors = { ...errors };
		delete newErrors[fieldName];
		errors = newErrors;
	}

	export function getFormData() {
		return formData;
	}

	export function setFormData(data: Partial<T>) {
		formData = { ...data };
		validateForm();
	}

	// Reactive statements
	$: isFormDisabled = disabled || loading || isSubmitting;
</script>

<form on:submit={handleSubmit} class="space-y-6" novalidate>
	<!-- Form content slot -->
	<slot
		{formData}
		{errors}
		{touched}
		{isValid}
		{isSubmitting}
		{handleFieldChange}
		{handleFieldBlur}
		{getFieldError}
		{hasFieldError}
		{validateField}
		{setFieldValue}
		{setFieldError}
		{clearFieldError}
		disabled={isFormDisabled}
	/>

	<!-- Form actions -->
	<div class="flex items-center justify-end space-x-4">
		{#if showCancel}
			<Button
				type="button"
				variant="outline"
				onclick={handleCancel}
				disabled={isFormDisabled}
			>
				{cancelLabel}
			</Button>
		{/if}
		
		<Button
			type="submit"
			disabled={isFormDisabled || (!isValid && Object.keys(touched).length > 0)}
		>
			{#if isSubmitting}
				<Loader class="mr-2 h-4 w-4 animate-spin" />
			{/if}
			{submitLabel}
		</Button>
	</div>
</form>