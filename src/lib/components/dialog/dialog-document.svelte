<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as Form from '$lib/components/ui/form/index';
	import * as Select from '$lib/components/ui/select/index';
	import {
		displaySize,
		MEGABYTE,
		FileDropZone,
		type FileDropZoneProps,
	} from '$lib/components/ui/file-drop-zone';
	import { Input } from '$lib/components/ui/input/index';
	import { Button } from '$lib/components/ui/button/index';
	import { superForm, filesProxy } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { CrudToasts } from '$lib/utils/crud-toasts';
	import FormToasts from '$lib/utils/form-toasts';
	import { toastService } from '$lib/utils/toast-service';
	import { documentFormSchema, documentCategoryEnum } from '$lib/validation/index';

	let { data } = $props();

	// Create form submission promise for toast integration
	let formSubmissionPromise: Promise<any> | null = null;

	const form = superForm(data.documentForm, {
		validators: zod4(documentFormSchema as any),
		onSubmit: ({ formData, cancel }) => {
			// Get file information for enhanced toast messaging from the form data
			const file = formData.get('file') as File;
			const documentName = (formData.get('name') as string) || (file ? file.name : 'Document');

			// Create a promise for the form submission to use with toast.promise()
			formSubmissionPromise = new Promise((resolve, reject) => {
				// Store resolve/reject functions to call them in onUpdate/onError
				(window as any).__documentFormResolve = resolve;
				(window as any).__documentFormReject = reject;
			});

			// Use promise-based toast for document upload with file information
			if (file && file.size > 0) {
				toastService.form.promise(formSubmissionPromise, {
					loading: `Uploading ${file.name}...`,
					success: `${documentName} uploaded successfully!`,
					error: `Failed to upload ${file.name}`,
				});
			} else {
				toastService.form.promise(formSubmissionPromise, {
					loading: 'Creating document...',
					success: `${documentName} created successfully!`,
					error: 'Failed to create document',
				});
			}
		},
		onUpdate: ({ form: f }) => {
			const resolve = (window as any).__documentFormResolve;
			const reject = (window as any).__documentFormReject;

			if (f.valid) {
				// Success - resolve promise for toast
				if (resolve) {
					resolve({ success: true, data: f.data });
					delete (window as any).__documentFormResolve;
					delete (window as any).__documentFormReject;
				}
			} else {
				// Validation errors - show form validation error and reject promise
				FormToasts.emptyFormError({
					formName: 'document',
					requiredFields: ['name', 'category', 'date'],
				});

				if (reject) {
					reject(new Error('Form validation failed'));
					delete (window as any).__documentFormResolve;
					delete (window as any).__documentFormReject;
				}
			}
		},
		onError: ({ result }) => {
			const reject = (window as any).__documentFormReject;

			// Use CRUD toast for server errors
			CrudToasts.error('create', 'An error occurred while uploading the document', 'document');

			// Reject promise for toast
			if (reject) {
				reject(new Error('Server error occurred'));
				delete (window as any).__documentFormResolve;
				delete (window as any).__documentFormReject;
			}
		},
	});
	const { form: formData, enhance } = form;

	const selectedCategory = $derived(
		$formData.category
			? documentCategoryEnum[$formData.category as keyof typeof documentCategoryEnum]
			: 'Choose category',
	);

	const onUpload: FileDropZoneProps['onUpload'] = async (uploadedFiles) => {
		// we use set instead of an assignment since it accepts a File[]
		files.set([...Array.from($files), ...uploadedFiles]);
	};

	const onFileRejected: FileDropZoneProps['onFileRejected'] = async ({ reason, file }) => {
		// Use form toast for file rejection with enhanced messaging
		FormToasts.submitError(reason, {
			formName: 'document upload',
			duration: 6000,
		});
	};

	const files = filesProxy(form, 'file');
</script>

<Dialog.Content class="w-full sm:w-[120rem]">
	<Dialog.Header>
		<Dialog.Title>Add New Document</Dialog.Title>
		<Dialog.Description>
			<p>Add a new document to track your wedding paperwork.</p>
		</Dialog.Description>
	</Dialog.Header>
	<form
		use:enhance
		method="POST"
		enctype="multipart/form-data"
		class="flex flex-col gap-2 py-4"
	>
		<Form.Field
			{form}
			name="name"
		>
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Description</Form.Label>
					<Input
						{...props}
						type="text"
						bind:value={$formData.name}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500" />
		</Form.Field>
		<Form.Field
			{form}
			name="category"
		>
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Category</Form.Label>
					<Select.Root
						type="single"
						bind:value={$formData.category}
						name={props.name}
					>
						<Select.Trigger
							{...props}
							class="w-full"
						>
							{selectedCategory}
						</Select.Trigger>
						<Select.Content>
							{#each Object.entries(documentCategoryEnum) as [value, label] (label)}
								<Select.Item {value}>
									{label}
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field
			{form}
			name="date"
		>
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Document Date</Form.Label>
					<Input
						{...props}
						type="date"
						bind:value={$formData.date}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500" />
		</Form.Field>

		<Form.Field
			{form}
			name="file"
		>
			<Form.Control>
				{#snippet children({ props })}
					<FileDropZone
						{...props}
						{onUpload}
						{onFileRejected}
						maxFileSize={10 * MEGABYTE}
						accept="image/*, application/pdf"
						maxFiles={1}
						fileCount={$files.length}
					>
						<div class="flex flex-col gap-2 w-full items-center justify-center">
							<div class="i-lucide:upload h-12 w-12 bg-neutral-500"></div>
							<div class="flex flex-col w-full gap-0 items-center justify-center">
								<h2 class="text-base font-bold text-neutral-500">
									Drag 'n' drop files here, or click to select files
								</h2>
								<span class="text-sm text-neutral-500"
									>You can upload PDF, JPEG, or PNG files up to 10 MB</span
								>
							</div>
						</div>
					</FileDropZone>
					<input
						name="file"
						type="file"
						bind:files={$files}
						class="hidden"
					/>
					<div class="flex flex-col gap-2">
						{#each Array.from($files) as file, i (file.name)}
							<div class="flex place-items-center justify-between gap-2">
								<div class="flex flex-col">
									<span>{file.name}</span>
									<span class="text-muted-foreground text-xs">{displaySize(file.size)}</span>
								</div>
								<Button
									variant="outline"
									size="icon"
									onclick={() => {
										// we use set instead of an assignment since it accepts a File[]
										files.set([
											...Array.from($files).slice(0, i),
											...Array.from($files).slice(i + 1),
										]);
									}}
								>
									<div class="i-lucide:x"></div>
								</Button>
							</div>
						{/each}
					</div>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500" />
		</Form.Field>

		<Dialog.Footer>
			<Form.Button type="submit">Add Document</Form.Button>
		</Dialog.Footer>
	</form>
</Dialog.Content>
