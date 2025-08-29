<script lang="ts">
	import FileUploadForm from '$lib/components/forms/file-upload-form.svelte';
	import type { FileUploadResult } from '$lib/server/storage/file-utils.js';
	
	let uploadResults: FileUploadResult[] = $state([]);
	let errorMessage = $state<string | null>(null);
	
	function handleUpload(files: FileUploadResult[]) {
		uploadResults = [...uploadResults, ...files];
		console.log('Files uploaded:', files);
	}
	
	function handleError(error: string) {
		errorMessage = error;
		console.error('Upload error:', error);
	}
</script>

<svelte:head>
	<title>File Upload Test - VowsMarry</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-4xl">
	<h1 class="text-3xl font-bold text-gray-900 mb-8">File Upload Test</h1>
	
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
		<!-- Single File Upload -->
		<div class="space-y-6">
			<h2 class="text-xl font-semibold text-gray-800">Single File Upload</h2>
			
			<FileUploadForm
				label="Upload Document"
				description="Upload a single document (PDF, DOC, DOCX, or image)"
				accept="image/*,application/pdf,.doc,.docx"
				multiple={false}
				maxSize={10 * 1024 * 1024}
				generateThumbnail={false}
				allowedTypes={['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
				onUpload={handleUpload}
				onError={handleError}
			/>
		</div>
		
		<!-- Multiple Image Upload with Thumbnails -->
		<div class="space-y-6">
			<h2 class="text-xl font-semibold text-gray-800">Multiple Image Upload</h2>
			
			<FileUploadForm
				label="Upload Gallery Images"
				description="Upload multiple images with automatic thumbnail generation"
				accept="image/*"
				multiple={true}
				maxFiles={10}
				maxSize={5 * 1024 * 1024}
				generateThumbnail={true}
				allowedTypes={['image/jpeg', 'image/png', 'image/webp', 'image/gif']}
				onUpload={handleUpload}
				onError={handleError}
			/>
		</div>
	</div>
	
	<!-- Upload Results -->
	{#if uploadResults.length > 0}
		<div class="mt-12">
			<h2 class="text-xl font-semibold text-gray-800 mb-4">Upload Results</h2>
			<div class="bg-gray-50 rounded-lg p-6">
				<pre class="text-sm text-gray-700 overflow-x-auto">{JSON.stringify(uploadResults, null, 2)}</pre>
			</div>
		</div>
	{/if}
	
	<!-- Error Display -->
	{#if errorMessage}
		<div class="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
			<h3 class="text-sm font-medium text-red-800">Upload Error</h3>
			<p class="text-sm text-red-600 mt-1">{errorMessage}</p>
		</div>
	{/if}
	
	<!-- Instructions -->
	<div class="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
		<h3 class="text-lg font-medium text-blue-900 mb-2">Setup Instructions</h3>
		<div class="text-sm text-blue-800 space-y-2">
			<p>To test file uploads, you need to configure Cloudflare R2 credentials in your .env file:</p>
			<ul class="list-disc list-inside space-y-1 ml-4">
				<li><code>CLOUDFLARE_R2_ACCOUNT_ID</code> - Your Cloudflare account ID</li>
				<li><code>CLOUDFLARE_R2_ACCESS_KEY_ID</code> - R2 access key ID</li>
				<li><code>CLOUDFLARE_R2_SECRET_ACCESS_KEY</code> - R2 secret access key</li>
				<li><code>CLOUDFLARE_R2_BUCKET_NAME</code> - R2 bucket name</li>
				<li><code>CLOUDFLARE_R2_PUBLIC_URL</code> - (Optional) Public URL for the bucket</li>
			</ul>
		</div>
	</div>
</div>