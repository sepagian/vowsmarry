<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import FormFileUpload from '$lib/components/forms/form-file-upload.svelte';
	import { toast } from '$lib/stores/toast';

	// Extended document type for optimistic updates
	type ExtendedDocument = {
		id: string;
		createdAt: Date;
		type: string;
		title: string;
		status: string;
		updatedAt: Date;
		weddingId: string;
		dueDate: Date | null;
		fileUrl: string | null;
		fileName: string | null;
		fileSize: number | null;
		mimeType: string | null;
		notes: string | null;
		reminderSent: boolean;
		_isOptimistic?: boolean;
		_isUploading?: boolean;
	};

	let { data, form } = $props();

	// Create optimistic documents state that updates immediately
	let optimisticDocuments = $state([...data.documents] as ExtendedDocument[]);
	
	// Create optimistic document stats
	let optimisticDocumentStats = $state({ ...data.documentStats });
	const upcomingDeadlines = data.upcomingDeadlines;

	// Update optimistic documents when server data changes
	$effect(() => {
		optimisticDocuments = [...data.documents] as ExtendedDocument[];
		optimisticDocumentStats = { ...data.documentStats };
	});

	// Calculate optimistic stats based on current optimistic documents
	const optimisticStats = $derived(() => {
		const stats = {
			total: optimisticDocuments.length,
			approved: optimisticDocuments.filter(doc => doc.status === 'approved').length,
			rejected: optimisticDocuments.filter(doc => doc.status === 'rejected').length,
			pending: optimisticDocuments.filter(doc => doc.status === 'pending').length
		};
		return stats;
	});

	// Add optimistic document (for immediate UI feedback)
	function addOptimisticDocument(formData: any) {
		const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
		const fileName = formData.file && formData.file.length > 0 ? formData.file[0].name : null;
		const fileSize = formData.file && formData.file.length > 0 ? formData.file[0].size : null;
		
		const optimisticDoc: ExtendedDocument = {
			id: tempId,
			title: formData.title,
			type: formData.type,
			status: formData.status,
			dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
			notes: formData.notes || null,
			fileName,
			fileSize,
			fileUrl: null, // Will be set after server response
			createdAt: new Date(),
			updatedAt: new Date(),
			weddingId: data.documents[0]?.weddingId || '', // Use existing weddingId
			mimeType: null,
			reminderSent: false,
			_isOptimistic: true, // Flag to identify optimistic updates
			_isUploading: true // Flag to show uploading state
		};
		
		optimisticDocuments = [optimisticDoc, ...optimisticDocuments];
		return tempId;
	}

	// Update optimistic document (for edit operations)
	function updateOptimisticDocument(docId: string, updates: any) {
		optimisticDocuments = optimisticDocuments.map(doc => 
			doc.id === docId ? { ...doc, ...updates } : doc
		);
	}

	// Remove optimistic document (on error or rollback)
	function removeOptimisticDocument(tempId: string) {
		optimisticDocuments = optimisticDocuments.filter(doc => doc.id !== tempId);
	}

	// Replace optimistic document with real one (on success)
	function replaceOptimisticDocument(tempId: string, realDoc: any) {
		optimisticDocuments = optimisticDocuments.map(doc => 
			doc.id === tempId ? { ...realDoc, _isOptimistic: false, _isUploading: false } : doc
		);
	}



	// Form states
	let showCreateForm = $state(false);
	let editingDocument = $state<any>(null);
	let deletingDocument = $state<any>(null);
	let isSubmitting = $state(false);
	let showFilters = $state(false);
	let previewDocument = $state<any>(null);

	// Filter states
	let filters = $state({
		status: 'all',
		type: 'all',
		search: '',
		dueDateFilter: 'all'
	});

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

	// Handle remaining form responses for actions not using optimistic updates
	$effect(() => {
		if (form?.success && !isSubmitting) {
			// Only handle success for delete operations or other non-optimistic actions
			if (form.success.includes('deleted')) {
				toast.success(form.success);
				deletingDocument = null;
				invalidateAll();
			}
		} else if (form?.error) {
			toast.error(form.error);
		}
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

	// Filter documents based on current filters
	const filteredDocuments = $derived(optimisticDocuments.filter(doc => {
		// Status filter
		if (filters.status !== 'all' && doc.status !== filters.status) {
			return false;
		}

		// Type filter
		if (filters.type !== 'all' && doc.type !== filters.type) {
			return false;
		}

		// Search filter
		if (filters.search && !doc.title.toLowerCase().includes(filters.search.toLowerCase())) {
			return false;
		}

		// Due date filter
		if (filters.dueDateFilter !== 'all') {
			const now = new Date();
			const docDueDate = doc.dueDate ? new Date(doc.dueDate) : null;
			
			switch (filters.dueDateFilter) {
				case 'overdue':
					if (!docDueDate || docDueDate >= now || doc.status === 'approved') return false;
					break;
				case 'upcoming':
					if (!docDueDate || docDueDate < now || doc.status === 'approved') return false;
					const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
					if (docDueDate > thirtyDaysFromNow) return false;
					break;
				case 'no_date':
					if (docDueDate) return false;
					break;
			}
		}

		return true;
	}));

	// Reset filters
	function resetFilters() {
		filters = {
			status: 'all',
			type: 'all',
			search: '',
			dueDateFilter: 'all'
		};
		showFilters = false;
	}

	// Check if document is overdue
	function isOverdue(doc: any) {
		if (!doc.dueDate || doc.status === 'approved') return false;
		return new Date(doc.dueDate) < new Date();
	}

	// Check if document is due soon (within 7 days)
	function isDueSoon(doc: any) {
		if (!doc.dueDate || doc.status === 'approved') return false;
		const now = new Date();
		const dueDate = new Date(doc.dueDate);
		const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
		return dueDate >= now && dueDate <= sevenDaysFromNow;
	}

	// Get file extension for preview
	function getFileExtension(fileName: string | null) {
		if (!fileName) return '';
		return fileName.split('.').pop()?.toLowerCase() || '';
	}

	// Check if file can be previewed
	function canPreview(doc: any) {
		if (!doc.fileUrl || !doc.fileName) return false;
		const ext = getFileExtension(doc.fileName);
		return ['pdf', 'jpg', 'jpeg', 'png', 'webp'].includes(ext);
	}

	// Open document preview
	function openPreview(doc: any) {
		if (canPreview(doc)) {
			previewDocument = doc;
		}
	}

	// Close preview
	function closePreview() {
		previewDocument = null;
	}

		// Quick status update
		async function quickStatusUpdate(doc: any, newStatus: string) {
			isSubmitting = true;
			
			// Optimistic update
			const originalStatus = doc.status;
			updateOptimisticDocument(doc.id, { status: newStatus });
			
			const formData = new FormData();
			formData.append('documentId', doc.id);
			formData.append('status', newStatus);

			try {
				const response = await fetch('?/updateStatus', {
					method: 'POST',
					body: formData
				});

				const result = await response.json();
				
				if (result.type === 'success') {
					toast.success('Document status updated successfully');
					// Keep the optimistic update since it was successful
					updateOptimisticDocument(doc.id, { status: newStatus, _isOptimistic: false, _isUploading: false });
				} else {
					// Revert optimistic update on error
					updateOptimisticDocument(doc.id, { status: originalStatus, _isOptimistic: false, _isUploading: false });
					toast.error(result.data?.error || 'Failed to update status');
				}
			} catch (error) {
				// Revert optimistic update on error
				updateOptimisticDocument(doc.id, { status: originalStatus, _isOptimistic: false, _isUploading: false });
				toast.error('Failed to update status');
			} finally {
				isSubmitting = false;
			}
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

	<!-- Upcoming Deadlines Alert -->
	{#if upcomingDeadlines.length > 0}
		<div class="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
			<div class="flex items-start gap-3">
				<div class="flex-shrink-0">
					<span class="text-2xl">⚠️</span>
				</div>
				<div class="flex-1">
					<h3 class="font-semibold text-yellow-800 mb-2">Upcoming Deadlines</h3>
					<div class="space-y-2">
						{#each upcomingDeadlines.slice(0, 3) as deadline}
							<div class="flex items-center justify-between text-sm">
								<span class="font-medium">{deadline.title}</span>
								<span class="text-yellow-700">Due: {formatDate(deadline.dueDate?.toISOString() || null)}</span>
							</div>
						{/each}
						{#if upcomingDeadlines.length > 3}
							<p class="text-sm text-yellow-700">
								And {upcomingDeadlines.length - 3} more upcoming deadlines...
							</p>
						{/if}
					</div>
				</div>
			</div>
		</div>
	{/if}

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
			<p class="text-2xl font-bold">{optimisticStats().total}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Approved</p>
				<span class="text-lg">✅</span>
			</div>
			<p class="text-2xl font-bold">{optimisticStats().approved}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Rejected</p>
				<span class="text-lg">❌</span>
			</div>
			<p class="text-2xl font-bold">{optimisticStats().rejected}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Pending</p>
				<span class="text-lg">⏳</span>
			</div>
			<p class="text-2xl font-bold">{optimisticStats().pending}</p>
		</div>
	</div>

	<!-- Document List -->
	<div class="rounded-lg border bg-card p-4">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-lg font-semibold">All Documents</h2>
			<div class="flex gap-2">
				<Button 
					variant="outline"
					size="sm"
					onclick={() => showFilters = !showFilters}
				>
					{showFilters ? 'Hide Filters' : 'Filter'}
				</Button>
				<Button 
					onclick={() => showCreateForm = !showCreateForm}
					variant="default"
					size="sm"
				>
					{showCreateForm ? 'Cancel' : 'Upload Document'}
				</Button>
			</div>
		</div>

		<!-- Filter Panel -->
		{#if showFilters}
			<div class="mb-4 p-4 border rounded-lg bg-muted/50">
				<div class="grid gap-3 md:grid-cols-4">
					<div>
						<label for="filter-search" class="text-sm font-medium text-muted-foreground">Search</label>
						<input
							id="filter-search"
							type="text"
							bind:value={filters.search}
							placeholder="Search documents..."
							class="w-full mt-1 px-3 py-2 border rounded-lg bg-background text-sm"
						/>
					</div>
					<div>
						<label for="filter-status" class="text-sm font-medium text-muted-foreground">Status</label>
						<select 
							id="filter-status"
							bind:value={filters.status}
							class="w-full mt-1 px-3 py-2 border rounded-lg bg-background text-sm"
						>
							<option value="all">All Status</option>
							<option value="pending">Pending</option>
							<option value="approved">Approved</option>
							<option value="rejected">Rejected</option>
						</select>
					</div>
					<div>
						<label for="filter-type" class="text-sm font-medium text-muted-foreground">Type</label>
						<select 
							id="filter-type"
							bind:value={filters.type}
							class="w-full mt-1 px-3 py-2 border rounded-lg bg-background text-sm"
						>
							<option value="all">All Types</option>
							<option value="permit">Permit</option>
							<option value="license">License</option>
							<option value="contract">Contract</option>
							<option value="other">Other</option>
						</select>
					</div>
					<div>
						<label for="filter-due-date" class="text-sm font-medium text-muted-foreground">Due Date</label>
						<select 
							id="filter-due-date"
							bind:value={filters.dueDateFilter}
							class="w-full mt-1 px-3 py-2 border rounded-lg bg-background text-sm"
						>
							<option value="all">All Dates</option>
							<option value="overdue">Overdue</option>
							<option value="upcoming">Due Soon (30 days)</option>
							<option value="no_date">No Due Date</option>
						</select>
					</div>
				</div>
				<div class="flex gap-2 mt-3">
					<Button
						variant="outline"
						size="sm"
						onclick={resetFilters}
					>
						Clear Filters
					</Button>
					<span class="text-sm text-muted-foreground self-center">
						Showing {filteredDocuments.length} of {optimisticDocuments.length} documents
					</span>
				</div>
			</div>
		{/if}

		<div class="space-y-4">
			{#if filteredDocuments.length > 0}
				{#each filteredDocuments as doc}
					<div class="p-4 border rounded-lg hover:bg-muted/50 transition-colors {doc._isOptimistic ? 'border-blue-200 bg-blue-50/50' : isOverdue(doc) ? 'border-red-200 bg-red-50/50' : isDueSoon(doc) ? 'border-yellow-200 bg-yellow-50/50' : ''}">
						<!-- Optimistic/Uploading indicator -->
						{#if doc._isUploading}
							<div class="mb-2">
								<span class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
									<svg class="animate-spin -ml-1 mr-1 h-3 w-3 text-blue-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
										<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									{doc._isOptimistic ? 'Uploading...' : 'Updating...'}
								</span>
							</div>
						{:else if doc._isOptimistic}
							<div class="mb-2">
								<span class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
									✅ Recently Added
								</span>
							</div>
						{/if}
									
						<!-- Alert badges for overdue/due soon -->
						{#if !doc._isOptimistic && isOverdue(doc)}
							<div class="mb-2">
								<span class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
									⚠️ Overdue
								</span>
							</div>
						{:else if !doc._isOptimistic && isDueSoon(doc)}
							<div class="mb-2">
								<span class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
									⏰ Due Soon
								</span>
							</div>
						{/if}

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
								<!-- Quick status update dropdown -->
								<div class="relative">
									<select 
										value={doc.status}
										onchange={(e) => {
								const target = e.target as HTMLSelectElement;
								quickStatusUpdate(doc, target.value);
							}}
										class="px-2 py-1 text-xs font-medium rounded border bg-background {getStatusColor(doc.status)}"
										disabled={isSubmitting || doc._isUploading}
									>
										<option value="pending">Pending</option>
										<option value="approved">Approved</option>
										<option value="rejected">Rejected</option>
									</select>
								</div>
								<span class="text-lg">{getStatusIcon(doc.status)}</span>
								<div class="flex gap-1 ml-2">
									{#if doc.fileUrl && !doc._isUploading}
										{#if canPreview(doc)}
											<Button
												variant="ghost"
												size="sm"
												onclick={() => openPreview(doc)}
											>
												Preview
											</Button>
										{/if}
										<Button
											variant="ghost"
											size="sm"
											onclick={() => doc.fileUrl && window.open(doc.fileUrl, '_blank')}
										>
											Download
										</Button>
									{/if}
									{#if !doc._isUploading}
										<Button
											variant="ghost"
											size="sm"
											onclick={() => startEdit(doc)}
											disabled={doc._isOptimistic}
										>
											Edit
										</Button>
										<Button
											variant="ghost"
											size="sm"
											onclick={() => deletingDocument = doc}
											disabled={doc._isOptimistic}
										>
											Delete
										</Button>
									{/if}
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
							{#if doc.fileUrl || doc._isOptimistic}
								<div class="flex items-center gap-2">
									<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
											clip-rule="evenodd"
										/>
									</svg>
									<span class="text-sm">
									{doc.fileName || (doc._isOptimistic ? 'Uploading...' : 'File')} 
									({doc.fileSize ? Math.round(doc.fileSize / 1024) + ' KB' : (doc._isOptimistic ? 'Processing...' : 'Unknown size')})
								</span>
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
					{#if optimisticDocuments.length === 0}
						<p>No documents yet. Start by adding your first document!</p>
					{:else}
						<p>No documents match your current filters.</p>
						<Button
							variant="outline"
							size="sm"
							onclick={resetFilters}
							class="mt-2"
						>
							Clear Filters
						</Button>
					{/if}
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
					
					// Add optimistic document immediately
					const tempId = addOptimisticDocument(createFormData);
					
					return async ({ result, update }) => {
						if (result.type === 'success' && result.data?.document) {
							// Replace optimistic document with real one
							replaceOptimisticDocument(tempId, result.data.document);
							toast.success('Document uploaded successfully!');
							resetCreateForm();
						} else if (result.type === 'failure') {
							// Remove optimistic document on failure
							removeOptimisticDocument(tempId);
							toast.error('Failed to upload document');
						} else {
							// Remove optimistic document on other errors
							removeOptimisticDocument(tempId);
						}
						
						isSubmitting = false;
						await update({ reset: false }); // Don't reset form, we handle it manually
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
					
					// Update optimistic document immediately
					updateOptimisticDocument(editingDocument.id, {
						title: editFormData.title,
						type: editFormData.type,
						status: editFormData.status,
						dueDate: editFormData.dueDate ? new Date(editFormData.dueDate) : null,
						notes: editFormData.notes
					});
					
					return async ({ result, update }) => {
						if (result.type === 'success' && result.data?.document) {
							// Replace with updated document from server
							updateOptimisticDocument(editingDocument.id, {
								...result.data.document,
								_isOptimistic: false,
								_isUploading: false
							});
							toast.success('Document updated successfully!');
							cancelEdit();
						} else if (result.type === 'failure') {
							// Revert to original data on failure
							const originalDoc = data.documents.find(d => d.id === editingDocument.id);
							if (originalDoc) {
								updateOptimisticDocument(editingDocument.id, {
									...originalDoc,
									_isOptimistic: false,
									_isUploading: false
								});
							}
							toast.error('Failed to update document');
						}
						
						isSubmitting = false;
						await update({ reset: false });
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
								isSubmitting = false;
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

	<!-- Document Preview Modal -->
	{#if previewDocument}
		<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
				<div class="flex items-center justify-between p-4 border-b">
					<div>
						<h3 class="text-lg font-semibold">{previewDocument.title}</h3>
						<p class="text-sm text-muted-foreground">{previewDocument.fileName}</p>
					</div>
					<div class="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							onclick={() => window.open(previewDocument.fileUrl, '_blank')}
						>
							Open in New Tab
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onclick={closePreview}
						>
							✕
						</Button>
					</div>
				</div>
				<div class="flex-1 overflow-hidden">
					{#if getFileExtension(previewDocument.fileName) === 'pdf'}
						<iframe
							src={previewDocument.fileUrl}
							class="w-full h-full"
							title="Document Preview"
						></iframe>
					{:else}
						<div class="p-4 h-full flex items-center justify-center">
							<img
								src={previewDocument.fileUrl}
								alt={previewDocument.title}
								class="max-w-full max-h-full object-contain"
							/>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>
