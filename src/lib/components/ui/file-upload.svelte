<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { cn } from '$lib/utils.js';
	import type { FileUploadResult } from '$lib/server/storage/file-utils.js';
	
	interface Props {
		accept?: string;
		multiple?: boolean;
		maxSize?: number; // in bytes
		maxFiles?: number;
		disabled?: boolean;
		class?: string;
		generateThumbnail?: boolean;
		allowedTypes?: string[];
		dragDropText?: string;
		browseText?: string;
		uploadingText?: string;
		errorText?: string;
	}
	
	let {
		accept = 'image/*,application/pdf,.doc,.docx',
		multiple = false,
		maxSize = 10 * 1024 * 1024, // 10MB
		maxFiles = 5,
		disabled = false,
		class: className = '',
		generateThumbnail = false,
		allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'],
		dragDropText = 'Drag and drop files here, or click to browse',
		browseText = 'Browse Files',
		uploadingText = 'Uploading...',
		errorText = 'Upload failed'
	}: Props = $props();
	
	const dispatch = createEventDispatcher<{
		upload: { files: FileUploadResult[] };
		progress: { completed: number; total: number };
		error: { error: string };
	}>();
	
	let fileInput: HTMLInputElement;
	let isDragOver = $state(false);
	let isUploading = $state(false);
	let uploadProgress = $state(0);
	let uploadTotal = $state(0);
	let selectedFiles: File[] = $state([]);
	let error = $state<string | null>(null);
	let previewUrls: string[] = $state([]);
	
	function validateFile(file: File): string | null {
		if (file.size > maxSize) {
			return `File "${file.name}" is too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB`;
		}
		
		if (!allowedTypes.includes(file.type)) {
			return `File type "${file.type}" is not allowed`;
		}
		
		return null;
	}
	
	function handleFiles(files: FileList | null) {
		if (!files) return;
		
		error = null;
		const fileArray = Array.from(files);
		
		// Validate file count
		if (multiple && fileArray.length > maxFiles) {
			error = `Too many files selected. Maximum is ${maxFiles}`;
			return;
		}
		
		if (!multiple && fileArray.length > 1) {
			error = 'Only one file is allowed';
			return;
		}
		
		// Validate each file
		for (const file of fileArray) {
			const validationError = validateFile(file);
			if (validationError) {
				error = validationError;
				return;
			}
		}
		
		selectedFiles = fileArray;
		generatePreviews();
	}
	
	function generatePreviews() {
		// Clean up existing preview URLs
		previewUrls.forEach(url => URL.revokeObjectURL(url));
		previewUrls = [];
		
		selectedFiles.forEach(file => {
			if (file.type.startsWith('image/')) {
				const url = URL.createObjectURL(file);
				previewUrls.push(url);
			} else {
				previewUrls.push(''); // Non-image files don't get previews
			}
		});
	}
	
	async function uploadFiles() {
		if (selectedFiles.length === 0) return;
		
		isUploading = true;
		uploadProgress = 0;
		uploadTotal = selectedFiles.length;
		error = null;
		
		try {
			const formData = new FormData();
			selectedFiles.forEach((file, index) => {
				formData.append(`file_${index}`, file);
			});
			
			formData.append('generateThumbnail', generateThumbnail.toString());
			formData.append('maxSize', maxSize.toString());
			formData.append('allowedTypes', JSON.stringify(allowedTypes));
			
			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});
			
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Upload failed');
			}
			
			const results: FileUploadResult[] = await response.json();
			
			dispatch('upload', { files: results });
			
			// Reset state
			selectedFiles = [];
			previewUrls.forEach(url => URL.revokeObjectURL(url));
			previewUrls = [];
			if (fileInput) fileInput.value = '';
			
		} catch (err) {
			error = err instanceof Error ? err.message : 'Upload failed';
			dispatch('error', { error: error });
		} finally {
			isUploading = false;
			uploadProgress = 0;
			uploadTotal = 0;
		}
	}
	
	function removeFile(index: number) {
		selectedFiles = selectedFiles.filter((_, i) => i !== index);
		if (previewUrls[index]) {
			URL.revokeObjectURL(previewUrls[index]);
		}
		previewUrls = previewUrls.filter((_, i) => i !== index);
		
		if (fileInput) fileInput.value = '';
	}
	
	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		if (!disabled) {
			isDragOver = true;
		}
	}
	
	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		isDragOver = false;
	}
	
	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragOver = false;
		
		if (disabled) return;
		
		const files = e.dataTransfer?.files || null;
		handleFiles(files);
	}
	
	function handleInputChange(e: Event) {
		const target = e.target as HTMLInputElement;
		handleFiles(target.files);
	}
	
	function formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}
</script>

<div class={cn('w-full', className)}>
	<!-- Drop Zone -->
	<div
		class={cn(
			'relative border-2 border-dashed rounded-lg p-6 transition-colors',
			isDragOver ? 'border-primary bg-primary/5' : 'border-gray-300',
			disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary/50',
			error ? 'border-red-300 bg-red-50' : ''
		)}
		role="button"
		tabindex="0"
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
		ondrop={handleDrop}
		onclick={() => !disabled && fileInput?.click()}
		onkeydown={(e) => {
			if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
				e.preventDefault();
				fileInput?.click();
			}
		}}
	>
		<input
			bind:this={fileInput}
			type="file"
			{accept}
			{multiple}
			{disabled}
			class="hidden"
			onchange={handleInputChange}
		/>
		
		<div class="text-center">
			{#if isUploading}
				<div class="space-y-2">
					<div class="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
					<p class="text-sm text-gray-600">{uploadingText}</p>
					<div class="w-full bg-gray-200 rounded-full h-2">
						<div 
							class="bg-primary h-2 rounded-full transition-all duration-300"
							style="width: {uploadTotal > 0 ? (uploadProgress / uploadTotal) * 100 : 0}%"
						></div>
					</div>
					<p class="text-xs text-gray-500">{uploadProgress} of {uploadTotal} files</p>
				</div>
			{:else}
				<svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
				</svg>
				<p class="text-sm text-gray-600 mb-2">{dragDropText}</p>
				<button
					type="button"
					class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
					{disabled}
				>
					{browseText}
				</button>
				<p class="text-xs text-gray-500 mt-2">
					Max size: {Math.round(maxSize / 1024 / 1024)}MB
					{#if multiple}
						• Max files: {maxFiles}
					{/if}
				</p>
			{/if}
		</div>
	</div>
	
	<!-- Error Message -->
	{#if error}
		<div class="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
			<p class="text-sm text-red-600">{error}</p>
		</div>
	{/if}
	
	<!-- Selected Files Preview -->
	{#if selectedFiles.length > 0}
		<div class="mt-4 space-y-2">
			<h4 class="text-sm font-medium text-gray-700">Selected Files:</h4>
			{#each selectedFiles as file, index}
				<div class="flex items-center justify-between p-3 bg-gray-50 rounded-md">
					<div class="flex items-center space-x-3">
						{#if previewUrls[index]}
							<img 
								src={previewUrls[index]} 
								alt="Preview" 
								class="w-10 h-10 object-cover rounded"
							/>
						{:else}
							<div class="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
								<svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
							</div>
						{/if}
						<div>
							<p class="text-sm font-medium text-gray-900">{file.name}</p>
							<p class="text-xs text-gray-500">{formatFileSize(file.size)} • {file.type}</p>
						</div>
					</div>
					<button
						type="button"
						onclick={() => removeFile(index)}
						class="text-red-500 hover:text-red-700 p-1"
						disabled={isUploading}
						aria-label="Remove file"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
			{/each}
			
			{#if !isUploading}
				<button
					type="button"
					onclick={uploadFiles}
					class="w-full mt-3 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
				>
					Upload {selectedFiles.length} {selectedFiles.length === 1 ? 'File' : 'Files'}
				</button>
			{/if}
		</div>
	{/if}
</div>