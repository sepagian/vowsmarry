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
	import { CrudToasts } from '$lib/utils/crud-toasts';
	import FormToasts from '$lib/utils/form-toasts';
	import { toastService } from '$lib/utils/toast-service';
	import { documentSchema, documentCategoryEnum } from '$lib/validation/planner';

	let { data } = $props();

	let formSubmissionPromise: Promise<any> | null = null;

	const form = superForm(data.documentForm, {
		validators: valibot(documentSchema),
		onSubmit: ({ formData, cancel }) => {
			console.log('Form submission started');
			console.log('Form data entries:', Array.from(formData.entries()).map(([k, v]) => [k, v instanceof File ? `File: ${v.name}` : v]));
			
			const file = formData.get('file') as File;
			const documentName =
				(formData.get('documentName') as string) || (file ? file.name : 'Document');

			formSubmissionPromise = new Promise((resolve, reject) => {
				(window as any).__documentFormResolve = resolve;
				(window as any).__documentFormReject = reject;
			});

			// Use promise-based toast for document upload with file information
			if (file && file.size > 0) {
				console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);
				toastService.form.promise(formSubmissionPromise, {
					loading: `Uploading ${file.name}...`,
					success: `${documentName} uploaded successfully!`,
					error: `Failed to upload ${file.name}`,
				});
			} else {
				console.log('No file detected in form data');
				toastService.form.promise(formSubmissionPromise, {
					loading: 'Creating document...',
					success: `${documentName} created successfully!`,
					error: 'Failed to create document',
				});
			}
		},
		onUpdate: async ({ form: f }) => {
			console.log('Form update received:', { valid: f.valid, errors: f.errors });
			
			const resolve = (window as any).__documentFormResolve;
			const reject = (window as any).__documentFormReject;

			if (f.valid) {
				console.log('Form validation passed, document created successfully');
				if (resolve) {
					resolve({ success: true, data: f.data });
					delete (window as any).__documentFormResolve;
					delete (window as any).__documentFormReject;
				}

				// Invalidate document list to refresh data from server
				await import('$app/navigation').then(({ invalidate }) => {
					invalidate('document:list');
				});
			} else {
				console.error('Form validation failed:', f.errors);
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
			console.error('Form submission error:', result);
			
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
		action="?/createDocument"
		enctype="multipart/form-data"
		class="flex flex-col gap-2"
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
			<Form.Button>Add Document</Form.Button>
		</Dialog.Footer>
	</form>
</Dialog.Content>
