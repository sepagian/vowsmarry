import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from './r2-client.js';
import sharp from 'sharp';
import crypto from 'crypto';

import {
	FileValidationError,
	FileSizeError,
	FileTypeError,
	FileStorageError,
	FileProcessingError,
	FileNotFoundError,
	FileErrorHandler,
	FileRetryHandler
} from './file-errors.js';

export interface FileUploadResult {
	key: string;
	url: string;
	thumbnailUrl?: string;
	size: number;
	mimeType: string;
	originalName: string;
}

export interface FileUploadOptions {
	generateThumbnail?: boolean;
	thumbnailWidth?: number;
	thumbnailHeight?: number;
	maxFileSize?: number; // in bytes
	allowedMimeTypes?: string[];
}

export interface FileValidationResult {
	isValid: boolean;
	error?: string;
}

/**
 * Validates file based on size and mime type restrictions
 */
export function validateFile(
	file: File,
	options: FileUploadOptions = {}
): FileValidationResult {
	const {
		maxFileSize = 10 * 1024 * 1024, // 10MB default
		allowedMimeTypes = [
			'image/jpeg',
			'image/png',
			'image/webp',
			'image/gif',
			'application/pdf',
			'application/msword',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
		]
	} = options;

	try {
		// Check file size
		if (file.size > maxFileSize) {
			throw new FileSizeError(file.name, file.size, maxFileSize);
		}

		// Check mime type
		if (!allowedMimeTypes.includes(file.type)) {
			throw new FileTypeError(file.name, file.type, allowedMimeTypes);
		}

		return { isValid: true };
	} catch (error) {
		if (error instanceof FileValidationError) {
			return {
				isValid: false,
				error: error.message
			};
		}
		throw error;
	}
}

/**
 * Generates a unique file key for storage
 */
export function generateFileKey(originalName: string, prefix?: string): string {
	const timestamp = Date.now();
	const randomId = crypto.randomBytes(4).toString('hex');
	const extension = originalName.split('.').pop() || '';
	const baseName = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '-');
	
	const fileName = `${baseName}-${timestamp}-${randomId}${extension ? '.' + extension : ''}`;
	
	return prefix ? `${prefix}/${fileName}` : fileName;
}

/**
 * Optimizes image and generates thumbnail if needed
 */
export async function processImage(
	buffer: ArrayBuffer,
	options: FileUploadOptions = {}
): Promise<{ optimized: Buffer; thumbnail?: Buffer }> {
	const {
		generateThumbnail = false,
		thumbnailWidth = 300,
		thumbnailHeight = 300
	} = options;

	const image = sharp(Buffer.from(buffer));
	const metadata = await image.metadata();

	// Optimize main image
	let optimized = image;
	
	// Resize if too large (max 2048px on longest side)
	if (metadata.width && metadata.height) {
		const maxDimension = Math.max(metadata.width, metadata.height);
		if (maxDimension > 2048) {
			optimized = optimized.resize(2048, 2048, { 
				fit: 'inside',
				withoutEnlargement: true 
			});
		}
	}

	// Convert to WebP for better compression
	const optimizedBuffer = await optimized
		.webp({ quality: 85 })
		.toBuffer();

	let thumbnailBuffer: Buffer | undefined;
	
	if (generateThumbnail) {
		thumbnailBuffer = await sharp(Buffer.from(buffer))
			.resize(thumbnailWidth, thumbnailHeight, { 
				fit: 'cover',
				position: 'center'
			})
			.webp({ quality: 80 })
			.toBuffer();
	}

	return {
		optimized: optimizedBuffer,
		thumbnail: thumbnailBuffer
	};
}

/**
 * Uploads file to Cloudflare R2
 */
export async function uploadFile(
	file: File,
	options: FileUploadOptions = {}
): Promise<FileUploadResult> {
	return await FileRetryHandler.retry(async () => {
		try {
			// Validate file
			const validation = validateFile(file, options);
			if (!validation.isValid) {
				throw new FileValidationError(validation.error || 'File validation failed', file.name);
			}

			const buffer = await file.arrayBuffer();
			const fileKey = generateFileKey(file.name, 'uploads');
			
			let uploadBuffer = Buffer.from(new Uint8Array(buffer));
			let thumbnailKey: string | undefined;
			let mimeType = file.type;

			// Process image if it's an image file
			if (file.type.startsWith('image/') && options.generateThumbnail) {
				try {
					const processed = await processImage(buffer, options);
					uploadBuffer = Buffer.from(processed.optimized);
					mimeType = 'image/webp'; // After optimization
					
					if (processed.thumbnail) {
						thumbnailKey = generateFileKey(file.name, 'thumbnails');
						
						// Upload thumbnail
						await r2Client.send(new PutObjectCommand({
							Bucket: R2_BUCKET_NAME,
							Key: thumbnailKey,
							Body: processed.thumbnail,
							ContentType: 'image/webp',
							CacheControl: 'public, max-age=31536000' // 1 year
						}));
					}
				} catch (error) {
					console.warn('Image processing failed, uploading original:', error);
					throw new FileProcessingError(
						`Failed to process image: ${file.name}`,
						file.name,
						error instanceof Error ? error : undefined
					);
				}
			}

			// Upload main file
			await r2Client.send(new PutObjectCommand({
				Bucket: R2_BUCKET_NAME,
				Key: fileKey,
				Body: uploadBuffer,
				ContentType: mimeType,
				CacheControl: 'public, max-age=31536000' // 1 year
			}));

			const url = R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${fileKey}` : await getSignedUrl(
				r2Client,
				new GetObjectCommand({
					Bucket: R2_BUCKET_NAME,
					Key: fileKey
				}),
				{ expiresIn: 3600 } // 1 hour for signed URLs
			);

			const thumbnailUrl = thumbnailKey 
				? (R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${thumbnailKey}` : await getSignedUrl(
					r2Client,
					new GetObjectCommand({
						Bucket: R2_BUCKET_NAME,
						Key: thumbnailKey
					}),
					{ expiresIn: 3600 }
				))
				: undefined;

			return {
				key: fileKey,
				url,
				thumbnailUrl,
				size: uploadBuffer.length,
				mimeType,
				originalName: file.name
			};
		} catch (error) {
			throw FileErrorHandler.handle(error, `Upload file: ${file.name}`);
		}
	});
}

/**
 * Uploads multiple files with progress tracking
 */
export async function uploadFiles(
	files: File[],
	options: FileUploadOptions = {},
	onProgress?: (completed: number, total: number) => void
): Promise<FileUploadResult[]> {
	const results: FileUploadResult[] = [];
	
	for (let i = 0; i < files.length; i++) {
		try {
			const result = await uploadFile(files[i], options);
			results.push(result);
			
			if (onProgress) {
				onProgress(i + 1, files.length);
			}
		} catch (error) {
			console.error(`Failed to upload file ${files[i].name}:`, error);
			throw error;
		}
	}
	
	return results;
}

/**
 * Deletes file from Cloudflare R2
 */
export async function deleteFile(key: string): Promise<void> {
	return await FileRetryHandler.retry(async () => {
		try {
			await r2Client.send(new DeleteObjectCommand({
				Bucket: R2_BUCKET_NAME,
				Key: key
			}));
		} catch (error) {
			throw FileErrorHandler.handle(error, `Delete file: ${key}`);
		}
	});
}

/**
 * Deletes multiple files
 */
export async function deleteFiles(keys: string[]): Promise<void> {
	const deletePromises = keys.map(key => deleteFile(key));
	await Promise.all(deletePromises);
}

/**
 * Generates a presigned URL for direct upload from client
 */
export async function generatePresignedUploadUrl(
	key: string,
	contentType: string,
	expiresIn: number = 3600
): Promise<string> {
	return await getSignedUrl(
		r2Client,
		new PutObjectCommand({
			Bucket: R2_BUCKET_NAME,
			Key: key,
			ContentType: contentType
		}),
		{ expiresIn }
	);
}

/**
 * Cleanup orphaned files (files that exist in storage but not in database)
 */
export async function cleanupOrphanedFiles(validKeys: string[]): Promise<void> {
	// This would require listing all objects in the bucket and comparing
	// with the validKeys array. Implementation depends on specific cleanup needs.
	// For now, we'll leave this as a placeholder for future implementation.
	console.log('Cleanup orphaned files - to be implemented based on specific needs');
}