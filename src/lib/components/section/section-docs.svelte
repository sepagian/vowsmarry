<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index';
	import { buttonVariants } from '$lib/components/ui/button/index';
	import * as Card from '$lib/components/ui/card/index';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index';
	import type { DocumentCategory, Document } from '$lib/types';
	import { docTypeOptions } from '$lib/constants/constants';
	import DialogDocument from '../dialog/dialog-document.svelte';
	import DialogDocumentEdit from '../dialog/dialog-document-edit.svelte';
	import { documentsStore } from '$lib/stores/documents';
	import { CrudToasts } from '$lib/utils/crud-toasts';
	import { invalidate } from '$app/navigation';

	let { docsCards, data }: { docsCards: Document[]; data: any } = $props();

	let editDialogOpen = $state(false);
	let deleteDialogOpen = $state(false);
	let isDeleting = $state(false);
	let selectedDocument = $state<Document | null>(null);

	const dropdownItem: {
		label: string;
		icon: string;
		color?: string;
	}[] = [
		{
			label: 'View',
			icon: 'i-lucide:eye',
		},
		{
			label: 'Download',
			icon: 'i-lucide:download',
		},
		{
			label: 'Edit',
			icon: 'i-lucide:edit',
		},
		{
			label: 'Delete',
			icon: 'i-lucide:trash2',
			color: 'hover:bg-red-100 text-red-800',
		},
	];

	function getTypeInfo(type: DocumentCategory) {
		return docTypeOptions.find((s) => s.value === type);
	}

	function getTypeColor(type: DocumentCategory): string {
		const colors = {
			legal_formal: 'bg-green-50 text-green-700 border-green-200',
			vendor_finance: 'bg-yellow-50 text-yellow-700 border-yellow-200',
			guest_ceremony: 'bg-blue-50 text-blue-700 border-blue-200',
			personal_keepsake: 'bg-red-50 text-red-700 border-red-200',
		};
		return colors[type] || 'bg-gray-50 text-gray-700 border-gray-200';
	}

	function getFileIcon(mimeType: string): string {
		if (mimeType === 'application/pdf') {
			return 'i-lucide:file-text';
		} else if (mimeType.startsWith('image/')) {
			return 'i-lucide:image';
		} else if (
			mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
		) {
			return 'i-lucide:file-text';
		}
		return 'i-lucide:file';
	}

	function formatFileSize(bytes: number): string {
		if (bytes < 1024) return bytes + ' B';
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
		return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
	}

	function isImage(mimeType: string): boolean {
		return mimeType.startsWith('image/');
	}

	function handleDownload(fileUrl: string, fileName: string) {
		// Create a temporary anchor element to trigger download
		const link = document.createElement('a');
		link.href = fileUrl;
		link.download = fileName;
		link.target = '_blank';
		link.rel = 'noopener noreferrer';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	async function handleDelete(documentId: string, documentName: string) {
		isDeleting = true;

		// Optimistic update - remove from store immediately
		const originalDocuments = $documentsStore;
		documentsStore.update((docs) => docs.filter((doc) => doc.id !== documentId));

		try {
			const formData = new FormData();
			formData.append('id', documentId);

			const response = await fetch('?/delete', {
				method: 'POST',
				body: formData,
			});

			const result = await response.json();

			if (result.type === 'success') {
				CrudToasts.success('delete', 'document', { itemName: documentName });
				// Invalidate to refetch all document data
				await invalidate('document:list');
				deleteDialogOpen = false;
			} else {
				throw new Error(result.error || 'Failed to delete document');
			}
		} catch (error) {
			// Revert optimistic update on error
			documentsStore.set(originalDocuments);
			CrudToasts.error(
				'delete',
				error instanceof Error ? error.message : 'Failed to delete document',
				'document',
			);
		} finally {
			isDeleting = false;
		}
	}

	function openDeleteDialog(doc: Document) {
		selectedDocument = doc;
		deleteDialogOpen = true;
	}

	function handleDropdownAction(action: string, doc: Document) {
		switch (action) {
			case 'Download':
				if (doc.fileUrl && doc.fileName) {
					handleDownload(doc.fileUrl, doc.fileName);
				}
				break;
			case 'View':
				// View functionality - open in new tab
				if (doc.fileUrl) {
					window.open(doc.fileUrl, '_blank', 'noopener,noreferrer');
				}
				break;
			case 'Edit':
				// Open edit dialog with document data
				selectedDocument = doc;
				editDialogOpen = true;
				break;
			case 'Delete':
				// Open delete confirmation dialog
				openDeleteDialog(doc);
				break;
		}
	}
</script>

<div class="flex flex-col gap-2 px-4">
	<div class="flex justify-between items-center">
		<h2 class="text-base font-bold text-neutral-600">Uploaded Documents</h2>
		<div class="flex flex-1 items-center justify-end gap-4">
			<Dialog.Root>
				<Dialog.Trigger class={buttonVariants({ variant: 'outline', size: 'default' })}>
					<div class="i-lucide:plus p-2"></div>
					<span class="hidden lg:inline">Upload New Document</span>
				</Dialog.Trigger>
				<DialogDocument {data} />
			</Dialog.Root>
		</div>
	</div>

	<!-- Edit Dialog -->
	{#if selectedDocument}
		<Dialog.Root bind:open={editDialogOpen}>
			<DialogDocumentEdit
				{data}
				document={selectedDocument}
				bind:open={editDialogOpen}
			/>
		</Dialog.Root>
	{/if}

	<!-- Delete Confirmation Dialog -->
	<AlertDialog.Root bind:open={deleteDialogOpen}>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>Delete Document</AlertDialog.Title>
				<AlertDialog.Description>
					Are you sure you want to delete "{selectedDocument?.documentName}"? This action cannot be
					undone and will permanently remove the file from storage.
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
				<AlertDialog.Action
					onclick={() =>
						selectedDocument &&
						handleDelete(selectedDocument.id as string, selectedDocument.documentName)}
					disabled={isDeleting}
					class="bg-red-600 hover:bg-red-700"
				>
					{isDeleting ? 'Deleting...' : 'Delete'}
				</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>

	<div class="flex gap-4 flex-col sm:grid md:grid lg:grid-cols-3 xl:grid-cols-4">
		{#each docsCards as doc (doc.id)}
			<Card.Root
				class="@container/card shrink-0 w-full sm:w-auto gap-2 flex flex-col p-2 shadow-none "
			>
				<Card.Header class="flex flex-col gap-3 px-0">
					{#if isImage(doc.mimeType)}
						<div
							class="inline-flex min-h-[12rem] sm:min-h-[6rem] rounded-lg w-full bg-gray-100 overflow-hidden"
						>
							<img
								src={doc.fileUrl}
								alt={doc.fileName}
								class="w-full h-24 object-cover"
							/>
						</div>
					{:else}
						<div
							class="inline-flex min-h-[8rem] sm:min-h-[6rem] rounded-lg w-full bg-gray-100 items-center justify-center"
						>
							<div class={`${getFileIcon(doc.mimeType)} w-12 h-12 text-red-400`}></div>
						</div>
					{/if}
				</Card.Header>
				<Card.Footer class="flex-col items-start text-sm justify-start p-0 gap-2.5">
					<div class="flex justify-between w-full items-center">
						<div class="inline-flex gap-1 items-center text-xs truncate text-gray-600">
							<Badge
								variant="outline"
								class={`${getTypeColor(doc.documentCategory)} text-xs px-1 py-1 w-fit flex items-center gap-1`}
							>
								<div class={`${getTypeInfo(doc.documentCategory)?.icon} w-3 h-3`}></div>
							</Badge>
							<Card.Description class="text-sm font-semibold truncate overflow-hidden">
								{doc.documentName}
							</Card.Description>
						</div>
						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								<div class="i-lucide:more-vertical bg-gray-500"></div>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content>
								<DropdownMenu.Group>
									{#each dropdownItem as item (item.label)}
										<DropdownMenu.Item
											class={item.color}
											onclick={() => handleDropdownAction(item.label, doc)}
										>
											<div class={item.icon}></div>
											{item.label}
										</DropdownMenu.Item>
									{/each}
								</DropdownMenu.Group>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</div>
					<div class="flex flex-col gap-1 w-full text-xs text-gray-500">
						<div class="flex items-center gap-1.5">
							<div class={`${getFileIcon(doc.mimeType)} w-3 h-3`}></div>
							<span class="truncate">{doc.fileName}</span>
						</div>
						<div class="flex items-center gap-1.5">
							<div class="i-lucide:hard-drive w-3 h-3"></div>
							<span>{formatFileSize(doc.fileSize)}</span>
						</div>
					</div>
				</Card.Footer>
			</Card.Root>
		{/each}
	</div>
</div>
