<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import FormFileUpload from '$lib/components/forms/form-file-upload.svelte';
	import { toast } from '$lib/stores/toast';

	let { data, form } = $props();

	const documents = data.documents;
	const documentStats = data.documentStats;
	const upcomingDeadlines = data.upcomingDeadlines;

	// Form states
	let showCreateForm = $state(false);
	let editingDocument = $state<any>(null);
	let deletingDocument = $state<any>(null);
	let isSubmitting = $state(false);

	// Form data
	let createFormData = $state({
		title: '',
		type: 'permit',
		status: 'pending',
		dueDate: '',
		notes: '',
		file: null as FileList | null
	});

	let editFormData = $state({
		title: '',
		type: 'permit',
		status: 'pending',
		dueDate: '',
		notes: '',
		file: null as FileList | null
	});

	// Reset create form
	function resetCreateForm() {
		createFormData = {
			title: '',
			type: 'permit',
			status: 'pending',
			dueDate: '',
			notes: '',
			file: null
		};
		showCreateForm = false;
	}

	// Start editing document
	function startEdit(doc: any) {
		editFormData = {
			title: doc.title || '',
			type: doc.type || 'permit',
			status: doc.status || 'pending',
			dueDate: doc.dueDate ? new Date(doc.dueDate).toISOString().split('T')[0] : '',
			notes: doc.notes || '',
			file: null
		};
		editingDocument = doc;
	}

	// Cancel editing
	function cancelEdit() {
		editingDocument = null;
		editFormData = {
			title: '',
			type: 'permit',
			status: 'pending',
			dueDate: '',
			notes: '',
			file: null
		};
	}

	// Handle form responses
	$effect(() => {
		if (form?.success) {
			toast.success(form.success);
			resetCreateForm();
			cancelEdit();
			deletingDocument = null;
			invalidateAll();
		} else if (form?.error) {
			toast.error(form.error);
		}
		isSubmitting = false;
	});

	function getStatusIcon(status: string | null) {
		switch (status) {
			case 'approved':
				return '✅';
			case 'rejected':
				return '❌';
			default:
				return '⏳';
		}
	}

	function getTypeIcon(type: string | null) {
		switch (type) {
			case 'license':
				return '📄';
			case 'contract':
				return '📋';
			case 'permit':
				return '📄';
			case 'other':
				return '📄';
			default:
				return '📄';
		}
	}

	function getStatusColor(status: string | null) {
		if (!status) return 'bg-gray-100 text-gray-800';
		switch (status) {
			case 'approved':
				return 'bg-green-100 text-green-800';
			case 'rejected':
				return 'bg-red-100 text-red-800';
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	function formatDate(dateString: string | null) {
		if (!dateString) return 'No date';
		return new Date(dateString).toLocaleDateString('id-ID');
	}
</script>

<div class="flex flex-1 flex-col gap-4 p-4">
	<!-- Header -->
	<div class="flex flex-col gap-2">
		<h1 class="text-2xl font-semibold">Paperwork & Documents</h1>
		<p class="text-muted-foreground">
			Track permits, licenses, contracts and important wedding documents.
		</p>
	</div>

	<!-- Document Statistics -->
	<div class="grid gap-4 md:grid-cols-4">
		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Total Documents</p>
				<svg class="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
						clip-rule="evenodd"
					/>
				</svg>
			</div>
			<p class="text-2xl font-bold">{documentStats.total}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Approved</p>
				<span class="text-lg">✅</span>
			</div>
			<p class="text-2xl font-bold">{documentStats.approved}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Rejected</p>
				<span class="text-lg">❌</span>
			</div>
			<p class="text-2xl font-bold">{documentStats.rejected}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Pending</p>
				<span class="text-lg">⏳</span>
			</div>
			<p class="text-2xl font-bold">{documentStats.pending}</p>
		</div>
	</div>

	<!-- Document List -->
	<div class="rounded-lg border bg-card p-4">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-lg font-semibold">All Documents</h2>
			<div class="flex gap-2">
				<button class="text-sm font-medium hover:underline">Filter</button>
				<Button 
					onclick={() => showCreateForm = !showCreateForm}
					variant="default"
					size="sm"
				>
					{showCreateForm ? 'Cancel' : 'Upload Document'}
				</Button>
			</div>
		</div>

		<div class="space-y-4">
			{#if documents.length > 0}
				{#each documents as doc}
					<div class="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
						<div class="flex items-start justify-between mb-3">
							<div class="flex items-start gap-3">
								<div class="flex items-center justify-center w-8 h-8 rounded border">
									<span class="text-sm">{getTypeIcon(doc.type)}</span>
								</div>
								<div>
									<h3 class="font-semibold">{doc.title}</h3>
									<p class="text-sm text-muted-foreground capitalize">{doc.type}</p>
								</div>
							</div>
							<div class="flex items-center gap-2">
								<span class="px-2 py-1 text-xs font-medium rounded {getStatusColor(doc.status)}">
									{(doc.status || 'pending').replace('_', ' ')}
								</span>
								<span class="text-lg">{getStatusIcon(doc.status)}</span>
								<div class="flex gap-1 ml-2">
									<Button
										variant="ghost"
										size="sm"
										onclick={() => startEdit(doc)}
									>
										Edit
									</Button>
									<Button
										variant="ghost"
										size="sm"
										onclick={() => deletingDocument = doc}
									>
										Delete
									</Button>
								</div>
							</div>
						</div>

						<div class="grid gap-2 md:grid-cols-3 text-sm text-muted-foreground mb-3">
							<div class="flex items-center gap-2">
								<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
										clip-rule="evenodd"
									/>
								</svg>
								<span>Due: {formatDate(doc.dueDate?.toISOString() || null)}</span>
							</div>
							{#if doc.createdAt}
								<div class="flex items-center gap-2">
									<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clip-rule="evenodd"
										/>
									</svg>
									<span>Created: {formatDate(doc.createdAt.toString())}</span>
								</div>
							{/if}
							{#if doc.fileUrl}
								<div class="flex items-center gap-2">
									<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
											clip-rule="evenodd"
										/>
									</svg>
									<a href={doc.fileUrl} class="hover:underline">Download File</a>
								</div>
							{/if}
						</div>

						{#if doc.notes}
							<div class="p-3 bg-muted rounded-lg">
								<p class="text-sm"><strong>Notes:</strong> {doc.notes}</p>
							</div>
						{/if}
					</div>
				{/each}
			{:else}
				<div class="text-center py-8 text-muted-foreground">
					<p>No documents yet. Start by adding your first document!</p>
				</div>
			{/if}
		</div>
	</div>

	<!-- Create Document Form -->
	{#if showCreateForm}
		<div class="rounded-lg border bg-card p-4">
			<h3 class="text-lg font-semibold mb-3">Upload New Document</h3>
			<form 
				method="POST" 
				action="?/create" 
				enctype="multipart/form-data"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						await update();
					};
				}}
			>
				<div class="grid gap-3 md:grid-cols-2">
					<div>
						<label for="create-title" class="text-sm font-medium text-muted-foreground">
							Document Title *
						</label>
						<input
							id="create-title"
							name="title"
							type="text"
							bind:value={createFormData.title}
							placeholder="Enter document title..."
							class="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
							required
						/>
						{#if form?.errors?.title}
							<p class="text-sm text-red-600 mt-1">{form.errors.title}</p>
						{/if}
					</div>
					<div>
						<label for="create-type" class="text-sm font-medium text-muted-foreground">
							Document Type *
						</label>
						<select 
							id="create-type" 
							name="type"
							bind:value={createFormData.type}
							class="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
							required
						>
							<option value="permit">Permit</option>
							<option value="license">License</option>
							<option value="contract">Contract</option>
							<option value="other">Other</option>
						</select>
						{#if form?.errors?.type}
							<p class="text-sm text-red-600 mt-1">{form.errors.type}</p>
						{/if}
					</div>
					<div>
						<label for="create-due-date" class="text-sm font-medium text-muted-foreground">
							Due Date
						</label>
						<input
							id="create-due-date"
							name="dueDate"
							type="date"
							bind:value={createFormData.dueDate}
							class="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
						/>
						{#if form?.errors?.dueDate}
							<p class="text-sm text-red-600 mt-1">{form.errors.dueDate}</p>
						{/if}
					</div>
					<div>
						<label for="create-status" class="text-sm font-medium text-muted-foreground">
							Status
						</label>
						<select 
							id="create-status" 
							name="status"
							bind:value={createFormData.status}
							class="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
						>
							<option value="pending">Pending</option>
							<option value="approved">Approved</option>
							<option value="rejected">Rejected</option>
						</select>
						{#if form?.errors?.status}
							<p class="text-sm text-red-600 mt-1">{form.errors.status}</p>
						{/if}
					</div>
				</div>
				<div class="mt-3">
					<FormFileUpload
						label="Upload File"
						name="file"
						bind:files={createFormData.file}
						accept=".pdf,.doc,.docx,.jpg,.png,.webp"
						maxSize={10 * 1024 * 1024}
						description="Supported formats: PDF, DOC, DOCX, JPG, PNG, WebP (Max 10MB)"
					/>
				</div>
				<div class="mt-3">
					<label for="create-notes" class="text-sm font-medium text-muted-foreground">
						Notes
					</label>
					<textarea
						id="create-notes"
						name="notes"
						bind:value={createFormData.notes}
						placeholder="Add any notes about this document..."
						class="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
						rows="3"
					></textarea>
					{#if form?.errors?.notes}
						<p class="text-sm text-red-600 mt-1">{form.errors.notes}</p>
					{/if}
				</div>
				<div class="flex gap-2 mt-4">
					<Button
						type="submit"
						disabled={isSubmitting}
					>
						{isSubmitting ? 'Uploading...' : 'Upload Document'}
					</Button>
					<Button
						type="button"
						variant="outline"
						onclick={resetCreateForm}
					>
						Cancel
					</Button>
				</div>
			</form>
		</div>
	{/if}

	<!-- Edit Document Form -->
	{#if editingDocument}
		<div class="rounded-lg border bg-card p-4">
			<h3 class="text-lg font-semibold mb-3">Edit Document</h3>
			<form 
				method="POST" 
				action="?/update" 
				enctype="multipart/form-data"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						await update();
					};
				}}
			>
				<input type="hidden" name="documentId" value={editingDocument.id} />
				<div class="grid gap-3 md:grid-cols-2">
					<div>
						<label for="edit-title" class="text-sm font-medium text-muted-foreground">
							Document Title *
						</label>
						<input
							id="edit-title"
							name="title"
							type="text"
							bind:value={editFormData.title}
							placeholder="Enter document title..."
							class="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
							required
						/>
						{#if form?.errors?.title}
							<p class="text-sm text-red-600 mt-1">{form.errors.title}</p>
						{/if}
					</div>
					<div>
						<label for="edit-type" class="text-sm font-medium text-muted-foreground">
							Document Type *
						</label>
						<select 
							id="edit-type" 
							name="type"
							bind:value={editFormData.type}
							class="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
							required
						>
							<option value="permit">Permit</option>
							<option value="license">License</option>
							<option value="contract">Contract</option>
							<option value="other">Other</option>
						</select>
						{#if form?.errors?.type}
							<p class="text-sm text-red-600 mt-1">{form.errors.type}</p>
						{/if}
					</div>
					<div>
						<label for="edit-due-date" class="text-sm font-medium text-muted-foreground">
							Due Date
						</label>
						<input
							id="edit-due-date"
							name="dueDate"
							type="date"
							bind:value={editFormData.dueDate}
							class="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
						/>
						{#if form?.errors?.dueDate}
							<p class="text-sm text-red-600 mt-1">{form.errors.dueDate}</p>
						{/if}
					</div>
					<div>
						<label for="edit-status" class="text-sm font-medium text-muted-foreground">
							Status
						</label>
						<select 
							id="edit-status" 
							name="status"
							bind:value={editFormData.status}
							class="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
						>
							<option value="pending">Pending</option>
							<option value="approved">Approved</option>
							<option value="rejected">Rejected</option>
						</select>
						{#if form?.errors?.status}
							<p class="text-sm text-red-600 mt-1">{form.errors.status}</p>
						{/if}
					</div>
				</div>
				<div class="mt-3">
					<FormFileUpload
						label="Replace File (optional)"
						name="file"
						bind:files={editFormData.file}
						accept=".pdf,.doc,.docx,.jpg,.png,.webp"
						maxSize={10 * 1024 * 1024}
						description="Leave empty to keep current file. Supported formats: PDF, DOC, DOCX, JPG, PNG, WebP (Max 10MB)"
					/>
				</div>
				<div class="mt-3">
					<label for="edit-notes" class="text-sm font-medium text-muted-foreground">
						Notes
					</label>
					<textarea
						id="edit-notes"
						name="notes"
						bind:value={editFormData.notes}
						placeholder="Add any notes about this document..."
						class="w-full mt-1 px-3 py-2 border rounded-lg bg-background"
						rows="3"
					></textarea>
					{#if form?.errors?.notes}
						<p class="text-sm text-red-600 mt-1">{form.errors.notes}</p>
					{/if}
				</div>
				<div class="flex gap-2 mt-4">
					<Button
						type="submit"
						disabled={isSubmitting}
					>
						{isSubmitting ? 'Updating...' : 'Update Document'}
					</Button>
					<Button
						type="button"
						variant="outline"
						onclick={cancelEdit}
					>
						Cancel
					</Button>
				</div>
			</form>
		</div>
	{/if}

	<!-- Delete Confirmation Modal -->
	{#if deletingDocument}
		<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
				<h3 class="text-lg font-semibold mb-2">Delete Document</h3>
				<p class="text-muted-foreground mb-4">
					Are you sure you want to delete "{deletingDocument.title}"? This action cannot be undone.
				</p>
				<div class="flex gap-2 justify-end">
					<Button
						variant="outline"
						onclick={() => deletingDocument = null}
					>
						Cancel
					</Button>
					<form 
						method="POST" 
						action="?/delete"
						use:enhance={() => {
							isSubmitting = true;
							return async ({ update }) => {
								await update();
							};
						}}
					>
						<input type="hidden" name="documentId" value={deletingDocument.id} />
						<Button
							type="submit"
							variant="destructive"
							disabled={isSubmitting}
						>
							{isSubmitting ? 'Deleting...' : 'Delete'}
						</Button>
					</form>
				</div>
			</div>
		</div>
	{/if}
</div>
