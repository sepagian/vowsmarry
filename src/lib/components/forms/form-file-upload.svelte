<script lang="ts">
	import { Upload, X, File, CircleAlert } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import FormField from './form-field.svelte';

	interface Props {
		label: string;
		name: string;
		files?: FileList | null;
		accept?: string;
		multiple?: boolean;
		maxSize?: number;
		error?: string;
		required?: boolean;
		disabled?: boolean;
		description?: string;
	}

	let {
		label,
		name,
		files = $bindable(null),
		accept = '',
		multiple = false,
		maxSize = 10 * 1024 * 1024, // 10MB default
		error,
		required = false,
		disabled = false,
		description
	}: Props = $props();

	let dragOver = $state(false);
	let fileInput: HTMLInputElement;

	// Convert FileList to Array for easier manipulation
	const fileArray = $derived(files ? Array.from(files) : []);

	// Format file size for display
	function formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}

	// Handle file selection
	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		files = target.files;
	}

	// Handle drag and drop
	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		dragOver = true;
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		dragOver = false;
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragOver = false;
		
		if (disabled) return;
		
		const droppedFiles = event.dataTransfer?.files;
		if (droppedFiles) {
			files = droppedFiles;
			// Update the input element
			if (fileInput) {
				fileInput.files = droppedFiles;
			}
		}
	}

	// Remove a specific file
	function removeFile(index: number) {
		if (!files) return;
		
		const dt = new DataTransfer();
		const fileArray = Array.from(files);
		
		fileArray.forEach((file, i) => {
			if (i !== index) {
				dt.items.add(file);
			}
		});
		
		files = dt.files;
		if (fileInput) {
			fileInput.files = dt.files;
		}
	}

	// Clear all files
	function clearFiles() {
		files = null;
		if (fileInput) {
			fileInput.value = '';
		}
	}

	// Open file picker
	function openFilePicker() {
		if (!disabled && fileInput) {
			fileInput.click();
		}
	}
</script>

<FormField {label} {name} {error} {required} {description} {disabled}>
	{#snippet children(fieldId, ariaDescribedBy, hasError)}
		<div class="space-y-4">
		<!-- Hidden file input -->
		<input
			bind:this={fileInput}
			id={fieldId}
			type="file"
			{name}
			{accept}
			{multiple}
			{disabled}
			aria-describedby={ariaDescribedBy}
			aria-invalid={hasError}
			class="sr-only"
			onchange={handleFileSelect}
		/>

		<!-- Drop zone -->
		<div
			class="relative rounded-lg border-2 border-dashed p-6 transition-colors {dragOver
				? 'border-primary bg-primary/5'
				: hasError
				? 'border-destructive'
				: 'border-muted-foreground/25'} {disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-muted/50'}"
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
			ondrop={handleDrop}
			onclick={openFilePicker}
			onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					openFilePicker();
				}
			}}
			role="button"
			tabindex={disabled ? -1 : 0}
			aria-label="Upload files"
		>
			<div class="flex flex-col items-center justify-center space-y-2 text-center">
				<Upload class="h-8 w-8 text-muted-foreground" />
				<div class="space-y-1">
					<p class="text-sm font-medium">
						{dragOver ? 'Drop files here' : 'Click to upload or drag and drop'}
					</p>
					<p class="text-xs text-muted-foreground">
						{accept ? `Accepted formats: ${accept}` : 'All file types accepted'}
						{maxSize ? ` • Max size: ${formatFileSize(maxSize)}` : ''}
					</p>
				</div>
			</div>
		</div>

		<!-- Selected files -->
		{#if fileArray.length > 0}
			<div class="space-y-2">
				<h4 class="text-sm font-medium">Selected Files</h4>
				<div class="space-y-2">
					{#each fileArray as file, index}
						<div class="flex items-center justify-between rounded-md border p-2">
							<div class="flex items-center space-x-2">
								<File class="h-4 w-4 text-muted-foreground" />
								<div class="min-w-0 flex-1">
									<p class="truncate text-sm font-medium">{file.name}</p>
									<p class="text-xs text-muted-foreground">
										{formatFileSize(file.size)}
									</p>
								</div>
							</div>
							<Button
								variant="ghost"
								size="sm"
								onclick={(e) => {
									e.stopPropagation();
									removeFile(index);
								}}
								disabled={disabled}
								aria-label="Remove file"
							>
								<X class="h-4 w-4" />
							</Button>
						</div>
					{/each}
				</div>
				<Button
					variant="outline"
					size="sm"
					onclick={(e) => {
						e.stopPropagation();
						clearFiles();
					}}
					disabled={disabled}
				>
					Clear All
				</Button>
			</div>
		{/if}
		</div>
	{/snippet}
</FormField>