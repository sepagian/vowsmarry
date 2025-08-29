<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { FormInput } from '$lib/components/forms';
	import { Button } from '$lib/components/ui/button';
	import { documentSchema } from '$lib/validation/schemas';
	import { FormValidator } from '$lib/validation/form-validator';
	import { toast } from '$lib/stores/toast';

	// Form state
	let formData = $state({
		title: '',
		type: '',
		dueDate: '',
		notes: ''
	});

	let errors = $state<Record<string, string>>({});
	let isSubmitting = $state(false);

	// Document type options
	const documentTypeOptions = [
		{ value: 'permit', label: 'Permit' },
		{ value: 'license', label: 'License' },
		{ value: 'contract', label: 'Contract' },
		{ value: 'other', label: 'Other' }
	];

	// Handle form submission
	function handleSubmit(event: Event) {
		event.preventDefault();
		isSubmitting = true;

		try {
			const result = FormValidator.validateForm(documentSchema, formData);
			
			if (!result.success) {
				errors = result.errors || {};
				toast.error('Validation Error', 'Please fix the errors below and try again.');
				return;
			}

			console.log('Form submitted with data:', result.data);
			toast.success('Document Created', 'Your document has been successfully created.');
			
			// Reset form
			formData = { title: '', type: '', dueDate: '', notes: '' };
			errors = {};
		} catch (error) {
			console.error('Form submission error:', error);
			toast.error('Submission Error', 'An error occurred while submitting the form.');
		} finally {
			isSubmitting = false;
		}
	}

	function handleCancel() {
		toast.info('Cancelled', 'Form submission was cancelled.');
		formData = { title: '', type: '', dueDate: '', notes: '' };
		errors = {};
	}
</script>

<div class="container mx-auto py-8">
	<Card class="max-w-2xl mx-auto">
		<CardHeader>
			<CardTitle>Test Validation System</CardTitle>
			<CardDescription>
				This form demonstrates the comprehensive validation system with real-time validation, error
				handling, and toast notifications.
			</CardDescription>
		</CardHeader>
		<CardContent>
			<form onsubmit={handleSubmit} class="space-y-6">
				<div class="space-y-6">
					<FormInput
						label="Document Title"
						name="title"
						placeholder="Enter document title"
						bind:value={formData.title}
						error={errors.title}
						required
						disabled={isSubmitting}
						description="A descriptive title for your document"
					/>

					<div class="space-y-2">
						<label for="type" class="text-sm font-medium">
							Document Type
							<span class="text-destructive ml-1" aria-label="required">*</span>
						</label>
						<select
							id="type"
							name="type"
							bind:value={formData.type}
							disabled={isSubmitting}
							class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 {errors.type ? 'border-destructive focus:ring-destructive' : ''}"
						>
							<option value="">Select document type</option>
							{#each documentTypeOptions as option}
								<option value={option.value}>{option.label}</option>
							{/each}
						</select>
						{#if errors.type}
							<div class="flex items-center gap-2 text-sm text-destructive" role="alert">
								<span>{errors.type}</span>
							</div>
						{/if}
						<p class="text-sm text-muted-foreground">Choose the type of document you're uploading</p>
					</div>

					<FormInput
						label="Due Date"
						name="dueDate"
						type="date"
						bind:value={formData.dueDate}
						error={errors.dueDate}
						disabled={isSubmitting}
						description="When is this document due? (Optional)"
					/>

					<div class="space-y-2">
						<label for="notes" class="text-sm font-medium">Notes</label>
						<textarea
							id="notes"
							name="notes"
							bind:value={formData.notes}
							placeholder="Add any additional notes about this document"
							disabled={isSubmitting}
							rows={4}
							class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 {errors.notes ? 'border-destructive focus-visible:ring-destructive' : ''}"
						></textarea>
						{#if errors.notes}
							<div class="flex items-center gap-2 text-sm text-destructive" role="alert">
								<span>{errors.notes}</span>
							</div>
						{/if}
						<p class="text-sm text-muted-foreground">Optional notes or comments about the document</p>
					</div>
				</div>

				<!-- Form actions -->
				<div class="flex items-center justify-end space-x-4">
					<Button
						type="button"
						variant="outline"
						onclick={handleCancel}
						disabled={isSubmitting}
					>
						Cancel
					</Button>
					
					<Button type="submit" disabled={isSubmitting}>
						{#if isSubmitting}
							Loading...
						{/if}
						Create Document
					</Button>
				</div>
			</form>
		</CardContent>
	</Card>

	<!-- Additional examples -->
	<div class="mt-8 max-w-2xl mx-auto">
		<Card>
			<CardHeader>
				<CardTitle>Toast Examples</CardTitle>
				<CardDescription>Test different types of toast notifications</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="flex flex-wrap gap-2">
					<button
						class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
						onclick={() => toast.success('Success!', 'This is a success message.')}
					>
						Success Toast
					</button>
					<button
						class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
						onclick={() => toast.error('Error!', 'This is an error message.')}
					>
						Error Toast
					</button>
					<button
						class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
						onclick={() => toast.warning('Warning!', 'This is a warning message.')}
					>
						Warning Toast
					</button>
					<button
						class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
						onclick={() => toast.info('Info!', 'This is an info message.')}
					>
						Info Toast
					</button>
					<button
						class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
						onclick={() => toast.handleFormError({ errors: { email: 'Invalid email format' } })}
					>
						Validation Error
					</button>
				</div>
			</CardContent>
		</Card>
	</div>
</div>