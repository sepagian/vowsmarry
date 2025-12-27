<script lang="ts">
	import { filesProxy, superForm } from "sveltekit-superforms";
	import { valibot } from "sveltekit-superforms/adapters";

	import { Button } from "$lib/components/ui/button/index";
	import {
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle,
	} from "$lib/components/ui/dialog/index";
	import {
		displaySize,
		FileDropZone,
		type FileDropZoneProps,
		MEGABYTE,
	} from "$lib/components/ui/file-drop-zone";
	import {
		FormButton,
		FormControl,
		FormField,
		FormFieldErrors,
		FormLabel,
	} from "$lib/components/ui/form/index";
	import { Input } from "$lib/components/ui/input/index";
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
	} from "$lib/components/ui/select/index";

	import toastService, { CrudToasts, FormToasts } from "$lib/utils/toasts";
	import {
		documentCategoryEnum,
		documentSchema,
	} from "$lib/validation/planner";

	import { TOAST_CONFIG } from "$lib/constants/config";
	import type { Document } from "$lib/types";

	let {
		data,
		document,
		open = $bindable(),
	}: { data: any; document: Document; open: boolean } = $props();

	let formSubmissionPromise: Promise<any> | null = null;

	const form = superForm(data.documentForm, {
		validators: valibot(documentSchema),
		dataType: "form",
		resetForm: false,
		onSubmit: ({ formData, cancel }) => {
			// Add document ID to form data
			formData.append("id", document.id || "");

			const file = formData.get("file") as File;
			const documentName =
				(formData.get("documentName") as string) ||
				(file ? file.name : "Document");

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
						loading: "Updating document...",
						success: `${documentName} updated successfully!`,
						error: "Failed to update document",
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

				// Invalidate document list to refresh data
				await import("$app/navigation").then(({ invalidate }) => {
					invalidate("document:list");
				});

				open = false;
			} else {
				FormToasts.emptyFormError({
					formName: "document",
					requiredFields: ["name", "category", "date"],
				});

				if (reject) {
					reject(new Error("Form validation failed"));
					delete (window as any).__documentEditFormResolve;
					delete (window as any).__documentEditFormReject;
				}
			}
		},
		onError: ({ result }) => {
			const reject = (window as any).__documentEditFormReject;

			// Use CRUD toast for server errors
			CrudToasts.error(
				"update",
				"An error occurred while updating the document",
				"document",
			);

			// Reject promise for toast
			if (reject) {
				reject(new Error("Server error occurred"));
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
			? documentCategoryEnum.find((c) => c.value === $formData.documentCategory)
					?.label
			: "Choose category",
	);

	const onUpload: FileDropZoneProps["onUpload"] = async (uploadedFiles) => {
		// we use set instead of an assignment since it accepts a File[]
		files.set([...Array.from($files), ...uploadedFiles]);
	};

	const onFileRejected: FileDropZoneProps["onFileRejected"] = async ({
		reason,
		file,
	}) => {
		// Use form toast for file rejection with enhanced messaging
		FormToasts.submitError(reason, {
			formName: "document upload",
			duration: TOAST_CONFIG.ERROR_DURATION,
		});
	};

	const files = filesProxy(form, "file");
</script>

<DialogContent class="w-full sm:w-[120rem]">
	<DialogHeader>
		<DialogTitle>Edit Document</DialogTitle>
		<DialogDescription>
			<p>Update document information and optionally replace the file.</p>
		</DialogDescription>
	</DialogHeader>
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
		<FormField {form} name="documentName">
			<FormControl>
				{#snippet children({ props })}
					<FormLabel>Description</FormLabel>
					<Input {...props} type="text" bind:value={$formData.documentName} />
				{/snippet}
			</FormControl>
			<FormFieldErrors class="text-xs text-red-500" />
		</FormField>
		<FormField {form} name="documentCategory">
			<FormControl>
				{#snippet children({ props })}
					<FormLabel>Category</FormLabel>
					<Select
						type="single"
						bind:value={$formData.documentCategory}
						name={props.name}
					>
						<SelectTrigger {...props} class="w-full">
							{selectedCategory}
						</SelectTrigger>
						<SelectContent>
							{#each documentCategoryEnum as option (option.value)}
								<SelectItem value={option.value}>
									{option.label}
								</SelectItem>
							{/each}
						</SelectContent>
					</Select>
				{/snippet}
			</FormControl>
			<FormFieldErrors />
		</FormField>
		<FormField {form} name="documentDate">
			<FormControl>
				{#snippet children({ props })}
					<FormLabel>Document Date</FormLabel>
					<Input {...props} type="date" bind:value={$formData.documentDate} />
				{/snippet}
			</FormControl>
			<FormFieldErrors class="text-xs text-red-500" />
		</FormField>

		<!-- Display current file info -->
		{#if document.fileName && $files.length === 0}
			<div class="flex flex-col gap-2 p-3 bg-gray-50 rounded-md border">
				<div class="text-sm font-medium text-gray-700">Current File</div>
				<div class="flex items-center justify-between gap-2">
					<div class="flex flex-col">
						<span class="text-sm">{document.fileName}</span>
						<span class="text-muted-foreground text-xs"
							>{document.fileSize
								? displaySize(document.fileSize)
								: "Unknown size"}</span
						>
					</div>
				</div>
				<div class="text-xs text-gray-500">
					Upload a new file below to replace the current one
				</div>
			</div>
		{/if}

		<FormField {form} name="file">
			<FormControl>
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
							<div
								class="flex flex-col w-full gap-0 items-center justify-center"
							>
								<h2 class="text-base font-bold text-neutral-500">
									{$files.length > 0
										? "Replace file"
										: "Upload new file (optional)"}
								</h2>
								<span class="text-sm text-neutral-500"
									>You can upload PDF, JPEG, or PNG files up to 10 MB</span
								>
							</div>
						</div>
					</FileDropZone>
					<input name="file" type="file" bind:files={$files} class="hidden" />
					<div class="flex flex-col gap-2">
						{#each Array.from($files) as file, i (file.name)}
							<div class="flex place-items-center justify-between gap-2">
								<div class="flex flex-col">
									<span>{file.name}</span>
									<span class="text-muted-foreground text-xs"
										>{displaySize(file.size)}</span
									>
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
			</FormControl>
			<FormFieldErrors class="text-xs text-red-500" />
		</FormField>

		<DialogFooter>
			<FormButton type="submit">Update Document</FormButton>
		</DialogFooter>
	</form>
</DialogContent>
