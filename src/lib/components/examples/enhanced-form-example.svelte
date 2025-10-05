<!--
Enhanced Form Example
Demonstrates proper usage of focus management and keyboard navigation for validation errors
-->

<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';
	import { 
		FormWrapperEnhanced, 
		FormFieldEnhanced, 
		FormControlEnhanced, 
		FormLabel, 
		FormDescription,
		Button 
	} from '$lib/components/ui/form/index.js';
	import { autoFocusOnError } from '$lib/actions/focus-management.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '$lib/components/ui/select/index.js';

	// Props
	interface Props {
		data: any; // Form data from load function
		onSubmit?: (data: any) => void;
	}

	let { data, onSubmit }: Props = $props();

	// Category options for the example
	const categoryOptions = {
		venue: 'Venue',
		catering: 'Catering',
		decoration: 'Decoration',
		entertainment: 'Entertainment',
		'makeup-attire': 'Makeup & Attire',
		paperwork: 'Paperwork',
		'photo-video': 'Photo & Video',
		accommodation: 'Accommodation',
		miscellaneous: 'Miscellaneous'
	};

	// Payment status options
	const paymentStatusOptions = {
		pending: 'Pending',
		paid: 'Paid'
	};

	// Simple schema for client-side validation (matching server schema)
	const clientSchema = z.object({
		description: z.string().min(5, 'Description must be at least 5 characters').max(500, 'Description is too long'),
		amount: z.coerce.number().min(0.01, 'Amount must be greater than 0').max(1000000000, 'Amount is too large'),
		category: z.enum(['venue', 'catering', 'decoration', 'entertainment', 'makeup-attire', 'paperwork', 'photo-video', 'accommodation', 'miscellaneous'], {
			message: 'Please select a category'
		}),
		status: z.enum(['pending', 'paid']).default('pending'),
		date: z.string().min(1, 'Date is required'),
		notes: z.string().max(1000, 'Notes are too long').optional().or(z.literal(''))
	});

	// Initialize superform with enhanced error handling
	const { form, errors, enhance, constraints, delayed } = superForm(data.form, {
		validators: zodClient(clientSchema),
		onUpdated: ({ form }) => {
			if (form.valid && onSubmit) {
				onSubmit(form.data);
			}
		},
		// Enhanced error handling options
		clearOnSubmit: 'errors-and-message',
		multipleSubmits: 'prevent',
		scrollToError: 'smooth',
		errorSelector: '[aria-invalid="true"],[data-fs-error]',
		selectErrorText: true,
	});

	// Handle validation events
	function handleValidationError(event: CustomEvent) {
		console.log('Validation errors detected:', event.detail.errors);
	}

	function handleValidationSuccess() {
		console.log('Form validation successful');
	}

	function handleErrorNavigation(event: CustomEvent) {
		console.log('Navigated to error:', event.detail);
	}
</script>

<div class="max-w-2xl mx-auto p-6">
	<div class="mb-8">
		<h1 class="text-2xl font-bold mb-2">Enhanced Form Example</h1>
		<p class="text-muted-foreground">
			This form demonstrates comprehensive accessibility features including keyboard navigation, 
			focus management, and screen reader support for validation errors.
		</p>
	</div>

	<!-- Accessibility Instructions -->
	<div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
		<h2 class="font-semibold text-blue-900 mb-2">Accessibility Features</h2>
		<ul class="text-sm text-blue-800 space-y-1">
			<li>• <kbd class="px-1 py-0.5 bg-blue-100 rounded text-xs">F8</kbd> - Navigate to next validation error</li>
			<li>• <kbd class="px-1 py-0.5 bg-blue-100 rounded text-xs">Shift+F8</kbd> - Navigate to previous validation error</li>
			<li>• <kbd class="px-1 py-0.5 bg-blue-100 rounded text-xs">Ctrl+Shift+E</kbd> - Focus error summary</li>
			<li>• <kbd class="px-1 py-0.5 bg-blue-100 rounded text-xs">Escape</kbd> - Clear error focus</li>
			<li>• Validation errors are announced to screen readers</li>
			<li>• Form fields are properly linked to error messages via ARIA</li>
		</ul>
	</div>

	<FormWrapperEnhanced
		method="POST"
		use:enhance
		focusOptions={{
			announceErrors: true,
			focusDelay: 150,
			scrollIntoView: true,
			scrollBehavior: 'smooth'
		}}
		showErrorSummary={true}
		showKeyboardHints={true}
		errorSummaryTitle="Please correct the following validation errors:"
		autoScrollToError={true}
		trapFocusOnErrors={false}
		onvalidationerror={handleValidationError}
		onvalidationsuccess={handleValidationSuccess}
		onerrornavigation={handleErrorNavigation}
	>
		<!-- Description Field -->
		<FormFieldEnhanced 
			form={form} 
			name="description"
			autoFocus={true}
			showErrorCount={true}
			highlightErrors={true}
		>
			{#snippet children({ constraints, errors, tainted, value, ariaDescribedBy, hasErrors })}
				<FormLabel for="description">
					Expense Description *
				</FormLabel>
				
				<FormDescription>
					Provide a clear description of what this expense is for (minimum 5 characters)
				</FormDescription>

				<FormControlEnhanced
					showValidationState={true}
				>
					{#snippet child({ props, attrs, enhancedProps })}
						<Input
							{...enhancedProps}
							id="description"
							name="description"
							type="text"
							placeholder="e.g., Wedding venue deposit"
							bind:value={$form.description}
							aria-describedby={ariaDescribedBy}
							aria-invalid={hasErrors}
							data-fs-error={hasErrors ? '' : undefined}
							use:autoFocusOnError
						/>
					{/snippet}
				</FormControlEnhanced>
			{/snippet}
		</FormFieldEnhanced>

		<!-- Amount Field -->
		<FormFieldEnhanced 
			form={form} 
			name="amount"
			autoFocus={true}
			showErrorCount={true}
			highlightErrors={true}
		>
			{#snippet children({ constraints, errors, tainted, value, ariaDescribedBy, hasErrors })}
				<FormLabel for="amount">
					Amount *
				</FormLabel>
				
				<FormDescription>
					Enter the expense amount in your local currency
				</FormDescription>

				<FormControlEnhanced
					showValidationState={true}
				>
					{#snippet child({ props, attrs, enhancedProps })}
						<Input
							{...enhancedProps}
							id="amount"
							name="amount"
							type="number"
							step="0.01"
							min="0.01"
							placeholder="0.00"
							bind:value={$form.amount}
							aria-describedby={ariaDescribedBy}
							aria-invalid={hasErrors}
							data-fs-error={hasErrors ? '' : undefined}
							use:autoFocusOnError
						/>
					{/snippet}
				</FormControlEnhanced>
			{/snippet}
		</FormFieldEnhanced>

		<!-- Category Field -->
		<FormFieldEnhanced 
			form={form} 
			name="category"
			autoFocus={true}
			showErrorCount={true}
			highlightErrors={true}
		>
			{#snippet children({ constraints, errors, tainted, value, ariaDescribedBy, hasErrors })}
				<FormLabel for="category">
					Category *
				</FormLabel>
				
				<FormDescription>
					Select the category that best describes this expense
				</FormDescription>

				<Select 
					bind:selected={$form.category}
					name="category"
				>
					<SelectTrigger
						id="category"
						aria-describedby={ariaDescribedBy}
						aria-invalid={hasErrors}
						data-fs-error={hasErrors ? '' : undefined}
						class={hasErrors ? 'border-destructive ring-destructive/20' : ''}
					>
						<SelectValue placeholder="Select a category" />
					</SelectTrigger>
					<SelectContent>
						{#each Object.entries(categoryOptions) as [key, label]}
							<SelectItem value={key}>{label}</SelectItem>
						{/each}
					</SelectContent>
				</Select>
			{/snippet}
		</FormFieldEnhanced>

		<!-- Payment Status Field -->
		<FormFieldEnhanced 
			form={form} 
			name="status"
			autoFocus={true}
			showErrorCount={true}
			highlightErrors={true}
		>
			{#snippet children({ constraints, errors, tainted, value, ariaDescribedBy, hasErrors })}
				<FormLabel for="status">
					Payment Status
				</FormLabel>
				
				<FormDescription>
					Current payment status of this expense
				</FormDescription>

				<Select 
					bind:selected={$form.status}
					name="status"
				>
					<SelectTrigger
						id="status"
						aria-describedby={ariaDescribedBy}
						aria-invalid={hasErrors}
						data-fs-error={hasErrors ? '' : undefined}
						class={hasErrors ? 'border-destructive ring-destructive/20' : ''}
					>
						<SelectValue placeholder="Select payment status" />
					</SelectTrigger>
					<SelectContent>
						{#each Object.entries(paymentStatusOptions) as [key, label]}
							<SelectItem value={key}>{label}</SelectItem>
						{/each}
					</SelectContent>
				</Select>
			{/snippet}
		</FormFieldEnhanced>

		<!-- Date Field -->
		<FormFieldEnhanced 
			form={form} 
			name="date"
			autoFocus={true}
			showErrorCount={true}
			highlightErrors={true}
		>
			{#snippet children({ constraints, errors, tainted, value, ariaDescribedBy, hasErrors })}
				<FormLabel for="date">
					Expense Date *
				</FormLabel>
				
				<FormDescription>
					When did this expense occur or when is it due?
				</FormDescription>

				<FormControlEnhanced
					showValidationState={true}
				>
					{#snippet child({ props, attrs, enhancedProps })}
						<Input
							{...enhancedProps}
							id="date"
							name="date"
							type="date"
							bind:value={$form.date}
							aria-describedby={ariaDescribedBy}
							aria-invalid={hasErrors}
							data-fs-error={hasErrors ? '' : undefined}
							use:autoFocusOnError
						/>
					{/snippet}
				</FormControlEnhanced>
			{/snippet}
		</FormFieldEnhanced>

		<!-- Notes Field (Optional) -->
		<FormFieldEnhanced 
			form={form} 
			name="notes"
			autoFocus={true}
			showErrorCount={true}
			highlightErrors={true}
		>
			{#snippet children({ constraints, errors, tainted, value, ariaDescribedBy, hasErrors })}
				<FormLabel for="notes">
					Additional Notes
				</FormLabel>
				
				<FormDescription>
					Any additional information about this expense (optional)
				</FormDescription>

				<FormControlEnhanced
					showValidationState={true}
				>
					{#snippet child({ props, attrs, enhancedProps })}
						<Textarea
							{...enhancedProps}
							id="notes"
							name="notes"
							placeholder="Additional details, vendor information, etc."
							rows={3}
							bind:value={$form.notes}
							aria-describedby={ariaDescribedBy}
							aria-invalid={hasErrors}
							data-fs-error={hasErrors ? '' : undefined}
							use:autoFocusOnError
						/>
					{/snippet}
				</FormControlEnhanced>
			{/snippet}
		</FormFieldEnhanced>

		<!-- Submit Button -->
		<div class="flex gap-4 pt-4">
			<Button 
				type="submit" 
				disabled={$delayed}
				class="min-w-32"
			>
				{#if $delayed}
					Saving...
				{:else}
					Save Expense
				{/if}
			</Button>

			<Button 
				type="button" 
				variant="outline"
				onclick={() => {
					// Reset form
					$form = {
						description: '',
						amount: 0,
						category: '',
						status: 'pending',
						date: '',
						notes: ''
					};
				}}
			>
				Reset Form
			</Button>
		</div>

		<!-- Debug Information (Development Only) -->
		{#if import.meta.env.DEV}
			<details class="mt-8 p-4 bg-gray-50 rounded-lg">
				<summary class="cursor-pointer font-medium">Debug Information</summary>
				<div class="mt-4 space-y-2 text-sm">
					<div>
						<strong>Form Data:</strong>
						<pre class="mt-1 p-2 bg-white rounded text-xs overflow-auto">{JSON.stringify($form, null, 2)}</pre>
					</div>
					<div>
						<strong>Validation Errors:</strong>
						<pre class="mt-1 p-2 bg-white rounded text-xs overflow-auto">{JSON.stringify($errors, null, 2)}</pre>
					</div>
				</div>
			</details>
		{/if}
	</FormWrapperEnhanced>
</div>

<style>
	/* Enhanced keyboard shortcut styling */
	kbd {
		font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
		font-size: 0.75rem;
		font-weight: 500;
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
	}

	/* Focus indicators for better visibility */
	:global(.form-field:focus-within) {
		outline: 2px solid hsl(var(--ring));
		outline-offset: 2px;
		border-radius: 0.375rem;
	}

	/* High contrast mode support */
	@media (prefers-contrast: high) {
		:global([aria-invalid="true"]) {
			border-width: 2px !important;
			border-style: solid !important;
		}
	}
</style>