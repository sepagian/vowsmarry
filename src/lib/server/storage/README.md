# File Upload System

This directory contains the complete file upload system for the VowsMarry wedding planner dashboard, built with Cloudflare R2 integration.

## Features

- **Cloudflare R2 Integration**: Secure file storage with global CDN
- **Image Optimization**: Automatic image compression and WebP conversion
- **Thumbnail Generation**: Automatic thumbnail creation for gallery features
- **File Validation**: Size and type validation with custom error handling
- **Progress Tracking**: Upload progress monitoring
- **Error Handling**: Comprehensive error handling with retry logic
- **Reusable Components**: Drop-in file upload components for forms

## Files Overview

### Core Files

- `r2-client.ts` - Cloudflare R2 client configuration
- `file-utils.ts` - Main file upload utilities and functions
- `file-errors.ts` - Custom error classes and error handling
- `index.ts` - Exports for easy importing

### Components

- `src/lib/components/ui/file-upload.svelte` - Reusable file upload component
- `src/lib/components/forms/file-upload-form.svelte` - Form wrapper component

### Client Utilities

- `src/lib/utils/file-upload-client.ts` - Client-side upload utilities

### API Endpoints

- `src/routes/api/upload/+server.ts` - File upload API endpoint

## Setup

### 1. Environment Variables

Add these variables to your `.env` file:

```env
CLOUDFLARE_R2_ACCOUNT_ID="your-account-id"
CLOUDFLARE_R2_ACCESS_KEY_ID="your-access-key"
CLOUDFLARE_R2_SECRET_ACCESS_KEY="your-secret-key"
CLOUDFLARE_R2_BUCKET_NAME="your-bucket-name"
CLOUDFLARE_R2_PUBLIC_URL="https://your-bucket.r2.dev" # Optional
```

### 2. Cloudflare R2 Setup

1. Create a Cloudflare R2 bucket
2. Generate API tokens with R2 permissions
3. Configure CORS if needed for direct uploads
4. Set up custom domain (optional) for public URLs

## Usage

### Basic File Upload Component

```svelte
<script>
  import FileUpload from '$lib/components/ui/file-upload.svelte';
  
  function handleUpload(event) {
    const files = event.detail.files;
    console.log('Uploaded files:', files);
  }
</script>

<FileUpload
  accept="image/*"
  multiple={true}
  maxSize={5 * 1024 * 1024}
  generateThumbnail={true}
  onupload={handleUpload}
/>
```

### Form Integration

```svelte
<script>
  import FileUploadForm from '$lib/components/forms/file-upload-form.svelte';
</script>

<FileUploadForm
  label="Upload Documents"
  description="Upload wedding documents (PDF, DOC, images)"
  accept="image/*,application/pdf,.doc,.docx"
  multiple={false}
  maxSize={10 * 1024 * 1024}
  onUpload={(files) => console.log('Files:', files)}
/>
```

### Server-Side Usage

```typescript
import { uploadFile, deleteFile } from '$lib/server/storage';

// Upload a file
const result = await uploadFile(file, {
  generateThumbnail: true,
  maxFileSize: 5 * 1024 * 1024,
  allowedMimeTypes: ['image/jpeg', 'image/png']
});

// Delete a file
await deleteFile(result.key);
```

### Client-Side Usage

```typescript
import { uploadFilesClient } from '$lib/utils/file-upload-client';

const response = await uploadFilesClient(files, {
  generateThumbnail: true,
  maxSize: 5 * 1024 * 1024,
  onProgress: (completed, total) => {
    console.log(`Progress: ${completed}/${total}`);
  }
});
```

## Configuration Options

### FileUploadOptions

```typescript
interface FileUploadOptions {
  generateThumbnail?: boolean;     // Generate thumbnails for images
  thumbnailWidth?: number;         // Thumbnail width (default: 300)
  thumbnailHeight?: number;        // Thumbnail height (default: 300)
  maxFileSize?: number;           // Max file size in bytes
  allowedMimeTypes?: string[];    // Allowed MIME types
}
```

### Component Props

```typescript
interface FileUploadProps {
  accept?: string;                // HTML accept attribute
  multiple?: boolean;             // Allow multiple files
  maxSize?: number;              // Max file size in bytes
  maxFiles?: number;             // Max number of files
  disabled?: boolean;            // Disable upload
  generateThumbnail?: boolean;   // Generate thumbnails
  allowedTypes?: string[];       // Allowed MIME types
  dragDropText?: string;         // Drag & drop text
  browseText?: string;           // Browse button text
}
```

## Error Handling

The system includes comprehensive error handling:

- `FileValidationError` - File validation failures
- `FileSizeError` - File size exceeded
- `FileTypeError` - Invalid file type
- `FileStorageError` - Storage operation failures
- `FileProcessingError` - Image processing failures
- `FileNotFoundError` - File not found
- `FileAccessError` - Access denied

### Error Recovery

- Automatic retry for transient errors
- Graceful fallback for image processing failures
- User-friendly error messages
- Detailed logging for debugging

## Security Features

- File type validation based on MIME type
- File size limits to prevent abuse
- Secure file key generation
- Access control through Cloudflare R2
- Input sanitization and validation

## Performance Optimizations

- Image compression and WebP conversion
- Thumbnail generation for faster loading
- CDN delivery through Cloudflare
- Lazy loading support
- Progress tracking for large uploads

## Testing

Visit `/test-upload` to test the file upload functionality with different configurations.

## Requirements Satisfied

This implementation satisfies the following requirements:

- **Requirement 2.5**: Document file upload and storage
- **Requirement 13.4**: Gallery media optimization and storage
- **Requirement 15.3**: Secure file storage and access controls

## Integration Points

The file upload system integrates with:

- **Paperwork Module**: Document uploads and storage
- **Gallery Module**: Photo and video uploads with thumbnails
- **Vendor Module**: Contract and document uploads
- **Dowry Module**: Proof and receipt uploads
- **Love Story Module**: Media uploads for timeline
- **Dresscode Module**: Inspiration photo uploads

## Future Enhancements

- Direct browser-to-R2 uploads with presigned URLs
- Video processing and thumbnail generation
- Batch upload optimization
- Upload resumption for large files
- Advanced image editing capabilities
- Virus scanning integration