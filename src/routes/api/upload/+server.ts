import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { uploadFiles, type UploadOptions } from '$lib/server/storage/file-utils.js';

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
		const pathPrefix = (formData.get('pathPrefix') as string) || 'uploads';
		const scopeId = (formData.get('scopeId') as string) || 'default';
		const metadataStr = formData.get('metadata') as string;
		const metadata = metadataStr ? JSON.parse(metadataStr) : undefined;

		const options: UploadOptions = {
			pathPrefix,
			scopeId,
			metadata,
		};

		const results = await uploadFiles(files, options);

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
		const { keys } = (await request.json()) as { keys: string[] };

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
