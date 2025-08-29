<script lang="ts">
	import FileUpload from '$lib/components/ui/file-upload.svelte';
	import type { FileUploadResult } from '$lib/server/storage/file-utils.js';

	interface Props {
		accept?: string;
		multiple?: boolean;
		maxSize?: number;
		maxFiles?: number;
		generateThumbnail?: boolean;
		allowedTypes?: string[];
		label?: string;
		description?: string;
		required?: boolean;
		class?: string;
		onUpload?: (files: FileUploadResult[]) => void;
		onError?: (error: string) => void;
	}

	let {
		accept = 'image/*,application/pdf,.doc,.docx',
		multiple = false,
		maxSize = 10 * 1024 * 1024,
		maxFiles = 5,
		generateThumbnail = false,
		allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'],
		label = 'Upload Files',
		description,
		required = false,
		class: className = '',
		onUpload,
		onError
	}: Props = $props();

	let uploadedFiles: FileUploadResult[] = $state([]);
	let error = $state<string | null>(null);

	function handleUpload(event: CustomEvent<{ files: FileUploadResult[] }>) {
		uploadedFiles = [...uploadedFiles, ...event.detail.files];
		error = null;
		onUpload?.(event.detail.files);
	}

	function handleError(event: CustomEvent<{ error: string }>) {
		error = event.detail.error;
		onError?.(event.detail.error);
	}

	function removeUploadedFile(index: number) {
		uploadedFiles = uploadedFiles.filter((_, i) => i !== index);
	}

	function formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}
</script>

<div class={className}>
	{#if label}
		<div class="block text-sm font-medium text-gray-700 mb-2">
			{label}
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</div>
	{/if}

	{#if description}
		<p class="text-sm text-gray-600 mb-3">{description}</p>
	{/if}

	<FileUpload
		{accept}
		{multiple}
		{maxSize}
		{maxFiles}
		{generateThumbnail}
		{allowedTypes}
		on:upload={handleUpload}
		on:error={handleError}
	/>

	<!-- Uploaded Files List -->
	{#if uploadedFiles.length > 0}
		<div class="mt-4">
			<h4 class="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</h4>
			<div class="space-y-2">
				{#each uploadedFiles as file, index}
					<div
						class="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md"
					>
						<div class="flex items-center space-x-3">
							{#if file.thumbnailUrl}
								<img
									src={file.thumbnailUrl}
									alt="Thumbnail"
									class="w-10 h-10 object-cover rounded"
								/>
							{:else if file.mimeType.startsWith('image/')}
								<img src={file.url} alt="Preview" class="w-10 h-10 object-cover rounded" />
							{:else}
								<div class="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
									<svg
										class="w-6 h-6 text-gray-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/>
									</svg>
								</div>
							{/if}
							<div>
								<p class="text-sm font-medium text-gray-900">{file.originalName}</p>
								<p class="text-xs text-gray-500">{formatFileSize(file.size)} • {file.mimeType}</p>
								<a
									href={file.url}
									target="_blank"
									rel="noopener noreferrer"
									class="text-xs text-blue-600 hover:text-blue-800"
								>
									View File
								</a>
							</div>
						</div>
						<button
							type="button"
							onclick={() => removeUploadedFile(index)}
							class="text-red-500 hover:text-red-700 p-1"
							title="Remove file"
							aria-label="Remove uploaded file"
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Error Display -->
	{#if error}
		<div class="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
			<p class="text-sm text-red-600">{error}</p>
		</div>
	{/if}
</div>
