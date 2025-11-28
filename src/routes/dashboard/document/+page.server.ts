import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { documentSchema } from '$lib/validation/planner';
import { validateDocumentFile } from '$lib/server/storage/file-validation';
import { withAuth } from '$lib/server/auth-helpers';

export const load: PageServerLoad = async ({ locals, plannerDb, depends }) => {
	depends('document:list');

	const { user } = locals;

	if (!user) redirect(302, '/login');

	const [documentForm, wedding] = await Promise.all([
		superValidate(valibot(documentSchema)),

		plannerDb
			.selectFrom('weddings')
			.selectAll()
			.where('userId', '=', user.id)
			.executeTakeFirst(),
	]);

	if (!wedding) {
		return {
			documentForm,
			documents: [],
		};
	}

	const documentList = await plannerDb
		.selectFrom('documents')
		.selectAll()
		.where('weddingId', '=', wedding.id)
		.orderBy('documentDate', 'asc')
		.execute();

	return { documents: documentList, documentForm };
};

export const actions: Actions = {
	createDocument: withAuth(async ({ wedding, plannerDb }, { request }) => {
		try {
			const form = await superValidate(request, valibot(documentSchema));
		if (!form.valid) return fail(400, { form });

		const file = form.data.file?.[0];

		if (!file || !(file instanceof File)) {
			return fail(400, {
				form: {
					...form,
					errors: {
						...form.errors,
						file: ['Please select a file to upload'],
					},
				},
			});
		}

		// Validate the file
		const fileValidation = validateDocumentFile(file);
		if (!fileValidation.valid) {
			return fail(400, {
				form: {
					...form,
					errors: {
						...form.errors,
						file: [fileValidation.error || 'Invalid file'],
					},
				},
			});
		}

		
		let uploadResult;
		try {
			// Upload file to R2 storage
			const { uploadFile } = await import('$lib/server/storage');
			uploadResult = await uploadFile(file, {
				pathPrefix: 'documents',
				scopeId: wedding.id,
			});
		} catch (error) {
			console.error('File upload failed:', error);
			return fail(500, {
				form: {
					...form,
					errors: {
						...form.errors,
						file: ['Failed to upload file. Please try again.'],
					},
				},
			});
		}

		// Create document record in database with file metadata
		try {
			const newDocument = await plannerDb
				.insertInto('documents')
				.values({
					id: crypto.randomUUID(),
					weddingId: wedding.id,
					documentName: form.data.documentName,
					documentCategory: form.data.documentCategory,
					documentDate: String(form.data.documentDate),
					documentStatus: 'pending',
					documentDueDate: null,
					fileUrl: uploadResult.fileUrl,
					fileName: uploadResult.fileName,
					fileSize: uploadResult.fileSize,
					mimeType: uploadResult.mimeType,
					reminderSent: 0,
					createdAt: Date.now(),
					updatedAt: Date.now(),
				})
				.returningAll()
				.executeTakeFirstOrThrow();

			// Remove file from form data to avoid serialization error
			const { file: _, ...formDataWithoutFile } = form.data;
			return { form: { ...form, data: formDataWithoutFile }, success: true, document: newDocument };
		} catch (error) {
			// Database insertion failed - rollback by deleting uploaded file
			console.error('Document create - Database insertion failed:', error);
			try {
				const { deleteFileByUrl } = await import('$lib/server/storage');
				await deleteFileByUrl(uploadResult.fileUrl);
			} catch (deleteError) {
				console.error('Failed to delete file during rollback:', deleteError);
			}

			return fail(500, {
				form: {
					...form,
					errors: {
						...form.errors,
						_errors: ['Failed to save document. Please try again.'],
					},
				},
			});
		}
		} catch (error) {
			console.error('Document create - Unexpected error:', error);
			return fail(500, { error: 'An unexpected error occurred' });
		}
	}),
	updateDocument: withAuth(async ({ wedding, plannerDb }, { request }) => {
		try {
			const form = await superValidate(request, valibot(documentSchema));
		if (!form.valid) return fail(400, { form });

		// Extract document ID from form data
		const formData = await request.formData();
		const documentId = formData.get('id') as string;

		if (!documentId) {
			return fail(400, { error: 'Document ID is required' });
		}

		// Verify user owns the document being updated
		const existingDocument = await plannerDb
			.selectFrom('documents')
			.selectAll()
			.where('id', '=', documentId)
			.executeTakeFirst();

		if (!existingDocument) {
			return fail(404, { error: 'Document not found' });
		}

		// Return 403 error if authorization fails
		if (existingDocument.weddingId !== wedding.id) {
			return fail(403, { error: 'You do not have permission to update this document' });
		}

		// Implement conditional file replacement
		let fileMetadata = {
			fileUrl: existingDocument.fileUrl,
			fileName: existingDocument.fileName,
			fileSize: existingDocument.fileSize,
			mimeType: existingDocument.mimeType,
		};

		// Check if new file is provided in form data
		const file = form.data.file?.[0];
		if (file && file instanceof File) {
			// If new file exists, validate and upload to R2
			const fileValidation = validateDocumentFile(file);
			if (!fileValidation.valid) {
				return fail(400, {
					form: {
						...form,
						errors: {
							...form.errors,
							file: [fileValidation.error || 'Invalid file'],
						},
					},
				});
			}

			try {
				// Replace old file in R2 with new file
				const { replaceFile } = await import('$lib/server/storage');
				const uploadResult = await replaceFile(existingDocument.fileUrl, file, {
					pathPrefix: 'documents',
					scopeId: wedding.id,
				});

				// Update database record with new file metadata
				fileMetadata = {
					fileUrl: uploadResult.fileUrl,
					fileName: uploadResult.fileName,
					fileSize: uploadResult.fileSize,
					mimeType: uploadResult.mimeType,
				};
			} catch (error) {
				// Implement rollback on failure (retain old file)
				console.error('File replacement failed:', error);
				return fail(500, {
					form: {
						...form,
						errors: {
							...form.errors,
							file: ['Failed to upload new file. Please try again.'],
						},
					},
				});
			}
		}

		// Update document metadata
		try {
			// Update document name, category, dates, status, and notes
			// Preserve existing file metadata if no new file provided
			const updatedDocument = await plannerDb
				.updateTable('documents')
				.set({
					documentName: form.data.documentName,
					documentCategory: form.data.documentCategory,
					documentDate: String(form.data.documentDate),
					...fileMetadata,
					updatedAt: Date.now(),
				})
				.where('id', '=', documentId)
				.returningAll()
				.executeTakeFirstOrThrow();

			// Remove file from form data to avoid serialization error
			const { file: _, ...formDataWithoutFile } = form.data;
			return { form: { ...form, data: formDataWithoutFile }, success: true, document: updatedDocument };
		} catch (error) {
			console.error('Document update - Database update failed:', error);
			return fail(500, {
				form: {
					...form,
					errors: {
						...form.errors,
						_errors: ['Failed to update document. Please try again.'],
					},
				},
			});
		}
		} catch (error) {
			console.error('Document update - Unexpected error:', error);
			return fail(500, { error: 'An unexpected error occurred' });
		}
	}),
	deleteDocument: withAuth(async ({ wedding, plannerDb }, { request }) => {
		try {
			// Extract document ID from form data
		const formData = await request.formData();
		const documentId = formData.get('id') as string;

		if (!documentId) {
			return fail(400, { error: 'Document ID is required' });
		}

		// Retrieve document record to get file URL
		const existingDocument = await plannerDb
			.selectFrom('documents')
			.selectAll()
			.where('id', '=', documentId)
			.executeTakeFirst();

		if (!existingDocument) {
			return fail(404, { error: 'Document not found' });
		}

		// Verify the document belongs to the user's wedding
		if (existingDocument.weddingId !== wedding.id) {
			return fail(403, { error: 'You do not have permission to delete this document' });
		}

		// Delete file from R2 storage
		try {
			const { deleteFileByUrl } = await import('$lib/server/storage');
			await deleteFileByUrl(existingDocument.fileUrl);
		} catch (error) {
			// If R2 Storage deletion fails, log the error and proceed with database deletion
			console.error('Failed to delete file from R2 storage:', error);
		}

		// Delete document record from database
		try {
			await plannerDb
				.deleteFrom('documents')
				.where('id', '=', documentId)
				.execute();

			// Return success response
			return { success: true, message: 'Document deleted successfully' };
		} catch (error) {
			console.error('Document delete - Database deletion failed:', error);
			return fail(500, { error: 'Failed to delete document. Please try again.' });
		}
		} catch (error) {
			console.error('Document delete - Unexpected error:', error);
			return fail(500, { error: 'An unexpected error occurred' });
		}
	}),
};
