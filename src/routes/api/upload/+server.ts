import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { uploadFiles, type FileUploadOptions } from '$lib/server/storage/file-utils.js';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();

		// Extract files from form data
		const files: File[] = [];
		for (const [key, value] of formData.entries()) {
			if (key.startsWith('file_') && value instanceof File) {
				files.push(value);
			}
		}

		if (files.length === 0) {
			return error(400, { message: 'No files provided' });
		}

		// Extract upload options
		const generateThumbnail = formData.get('generateThumbnail') === 'true';
		const maxSize = parseInt(formData.get('maxSize') as string) || 10 * 1024 * 1024;
		const allowedTypesStr = formData.get('allowedTypes') as string;
		const allowedTypes = allowedTypesStr ? JSON.parse(allowedTypesStr) : undefined;

		const options: FileUploadOptions = {
			generateThumbnail,
			maxFileSize: maxSize,
			allowedMimeTypes: allowedTypes,
		};

		const results = await uploadFiles(files, options, (completed, total) => {
			// Progress tracking could be implemented with WebSockets or Server-Sent Events
			// For now, we'll just log the progress
			console.log(`Upload progress: ${completed}/${total}`);
		});

		return json(results);
	} catch (err) {
		console.error('File upload error:', err);

		if (err instanceof Error) {
			return error(400, { message: err.message });
		}

		return error(500, { message: 'Internal server error during file upload' });
	}
};

export const DELETE: RequestHandler = async ({ request }) => {
	try {
		const { keys } = await request.json();

		if (!Array.isArray(keys) || keys.length === 0) {
			return error(400, { message: 'No file keys provided' });
		}

		const { deleteFiles } = await import('$lib/server/storage/file-utils');
		await deleteFiles(keys);

		return json({ success: true, message: `${keys.length} files deleted successfully` });
	} catch (err) {
		console.error('File deletion error:', err);

		if (err instanceof Error) {
			return error(400, { message: err.message });
		}

		return error(500, { message: 'Internal server error during file deletion' });
	}
};
