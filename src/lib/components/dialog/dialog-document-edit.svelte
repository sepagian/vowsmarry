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
	import { valibot } from 'sveltekit-superforms/adapters';
	import { CrudToasts, FormToasts } from '$lib/utils/toasts';
	import toastService from '$lib/utils/toasts';
	import { documentSchema, documentCategoryEnum } from '$lib/validation/planner';
	import { TOAST_CONFIG } from '$lib/constants/config';
	import type { Document } from '$lib/types';

	let { data, document, open = $bindable() }: { data: any; document: Document; open: boolean } = $props();

	let formSubmissionPromise: Promise<any> | null = null;

	const form = superForm(data.documentForm, {
		validators: valibot(documentSchema),
		dataType: 'form',
		resetForm: false,
		onSubmit: ({ formData, cancel }) => {
			// Add document ID to form data
			formData.append('id', document.id || '');

			const file = formData.get('file') as File;
			const documentName =
				(formData.get('documentName') as string) || (file ? file.name : 'Document');

			formSubmissionPromise = new Promise((resolve, reject) => {
				(window as any).__documentEditFormResolve = resolve;
				(window as any).__documentEditFormReject = reject;
			});

			// Use promise-based toast for document update with file information
			if (file && file.size > 0) {
				toastService.form.promise(formSubmissionPromise, {
					messages: {
						loading: `Updating ${documentName}...`,
						success: `${documentName} updated successfully!`,
						error: `Failed to update ${documentName}`,
					},
				});
			} else {
				toastService.form.promise(formSubmissionPromise, {
					messages: {
						loading: 'Updating document...',
						success: `${documentName} updated successfully!`,
						error: 'Failed to update document',
					},
				});
			}
		},
		onUpdate: async ({ form: f }) => {
			const resolve = (window as any).__documentEditFormResolve;
			const reject = (window as any).__documentEditFormReject;

			if (f.valid) {
				if (resolve) {
					resolve({ success: true, data: f.data });
					delete (window as any).__documentEditFormResolve;
					delete (window as any).__documentEditFormReject;
				}
				// Close dialog on success
				open = false;
				
				// Invalidate document list to refresh data
				await import('$app/navigation').then(({ invalidate }) => {
					invalidate('document:list');
				});
			} else {
				FormToasts.emptyFormError({
					formName: 'document',
					requiredFields: ['name', 'category', 'date'],
				});

				if (reject) {
					reject(new Error('Form validation failed'));
					delete (window as any).__documentEditFormResolve;
					delete (window as any).__documentEditFormReject;
				}
			}
		},
		onError: ({ result }) => {
			const reject = (window as any).__documentEditFormReject;

			// Use CRUD toast for server errors
			CrudToasts.error('update', 'An error occurred while updating the document', 'document');

			// Reject promise for toast
			if (reject) {
				reject(new Error('Server error occurred'));
				delete (window as any).__documentEditFormResolve;
				delete (window as any).__documentEditFormReject;
			}
		},
	});
	const { form: formData, enhance } = form;

	// Pre-fill form with existing document data
	$effect(() => {
		if (document && open) {
			$formData.documentName = document.documentName;
			$formData.documentCategory = document.documentCategory;
			$formData.documentDate = document.documentDate;
		}
	});

	const selectedCategory = $derived(
		$formData.documentCategory
			? documentCategoryEnum.find((c) => c.value === $formData.documentCategory)?.label
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
			duration: TOAST_CONFIG.ERROR_DURATION,
		});
	};

	const files = filesProxy(form, 'file');
</script>

<Dialog.Content class="w-full sm:w-[120rem]">
	<Dialog.Header>
		<Dialog.Title>Edit Document</Dialog.Title>
		<Dialog.Description>
			<p>Update document information and optionally replace the file.</p>
		</Dialog.Description>
	</Dialog.Header>
	<form
		use:enhance
		method="POST"
		action="?/updateDocument"
		enctype="multipart/form-data"
		class="flex flex-col gap-2"
		onsubmit={(e) => {
			if (!$formData.valid) {
				e.preventDefault();
			}
		}}
	>
		<Form.Field
			{form}
			name="documentName"
		>
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Description</Form.Label>
					<Input
						{...props}
						type="text"
						bind:value={$formData.documentName}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500" />
		</Form.Field>
		<Form.Field
			{form}
			name="documentCategory"
		>
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Category</Form.Label>
					<Select.Root
						type="single"
						bind:value={$formData.documentCategory}
						name={props.name}
					>
						<Select.Trigger
							{...props}
							class="w-full"
						>
							{selectedCategory}
						</Select.Trigger>
						<Select.Content>
							{#each documentCategoryEnum as option (option.value)}
								<Select.Item value={option.value}>
									{option.label}
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
			name="documentDate"
		>
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Document Date</Form.Label>
					<Input
						{...props}
						type="date"
						bind:value={$formData.documentDate}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500" />
		</Form.Field>

		<!-- Display current file info -->
		{#if document.fileName && $files.length === 0}
			<div class="flex flex-col gap-2 p-3 bg-gray-50 rounded-md border">
				<div class="text-sm font-medium text-gray-700">Current File</div>
				<div class="flex items-center justify-between gap-2">
					<div class="flex flex-col">
						<span class="text-sm">{document.fileName}</span>
						<span class="text-muted-foreground text-xs">{document.fileSize ? displaySize(document.fileSize) : 'Unknown size'}</span>
					</div>
				</div>
				<div class="text-xs text-gray-500">Upload a new file below to replace the current one</div>
			</div>
		{/if}

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
									{$files.length > 0 ? 'Replace file' : 'Upload new file (optional)'}
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
			<Form.Button type="submit">Update Document</Form.Button>
		</Dialog.Footer>
	</form>
</Dialog.Content>
