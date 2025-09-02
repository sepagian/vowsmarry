import { redirect, fail } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'
import { db } from '$lib/server/db'
import { weddings, documents, documentReminders } from '$lib/server/db/schema'
import { eq, desc, and } from 'drizzle-orm'
import { documentSchema, documentUpdateSchema } from '$lib/validation/schemas'
import { FormValidator } from '$lib/validation/form-validator'
import { uploadFile, deleteFile } from '$lib/server/storage/file-utils'
import { ValidationError } from '$lib/errors'
import { ReminderService } from '$lib/server/services/reminder-service'

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: { user }, error } = await supabase.auth.getUser()
	
	if (error || !user) {
		redirect(302, '/login')
	}

	// Get user's wedding data
	const userWedding = await db.query.weddings.findFirst({
		where: eq(weddings.userId, user.id)
	})

	if (!userWedding) {
		// No wedding data yet, return empty state
		return {
			wedding: null,
			documents: [],
			documentStats: {
				total: 0,
				pending: 0,
				approved: 0,
				rejected: 0
			},
			upcomingDeadlines: []
		}
	}

	// Get all documents for this wedding
	const allDocuments = await db.query.documents.findMany({
		where: eq(documents.weddingId, userWedding.id),
		orderBy: [desc(documents.updatedAt)]
	})

	// Calculate document statistics
	const documentStats = {
		total: allDocuments.length,
		pending: allDocuments.filter(d => d.status === 'pending').length,
		approved: allDocuments.filter(d => d.status === 'approved').length,
		rejected: allDocuments.filter(d => d.status === 'rejected').length
	}

	// Get upcoming deadlines (next 30 days)
	const today = new Date().toISOString().split('T')[0]
	const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
	
	const upcomingDeadlines = allDocuments.filter(doc => 
		doc.dueDate && 
		doc.status !== 'approved' && 
		new Date(doc.dueDate).toISOString().split('T')[0] >= today && 
		new Date(doc.dueDate).toISOString().split('T')[0] <= thirtyDaysFromNow
	).sort((a, b) => (a.dueDate! < b.dueDate!) ? -1 : 1)

	return {
		wedding: userWedding,
		documents: allDocuments,
		documentStats,
		upcomingDeadlines
	}
}

export const actions: Actions = {
	create: async ({ request, locals: { supabase } }) => {
		const { data: { user }, error: authError } = await supabase.auth.getUser()
		
		if (authError || !user) {
			return fail(401, { error: 'Unauthorized' })
		}

		try {
			const formData = await request.formData()
			
			// Get user's wedding
			const userWedding = await db.query.weddings.findFirst({
				where: eq(weddings.userId, user.id)
			})

			if (!userWedding) {
				return fail(400, { error: 'No wedding found. Please create a wedding first.' })
			}

			// Extract form data
			const title = formData.get('title') as string
			const type = formData.get('type') as string
			const status = formData.get('status') as string
			const dueDate = formData.get('dueDate') as string
			const notes = formData.get('notes') as string
			const file = formData.get('file') as File

			// Prepare data for validation
			const documentData = {
				title,
				type,
				status: status || 'pending',
				dueDate: dueDate || undefined,
				notes: notes || undefined
			}

			// Validate document data
			const validation = FormValidator.validateForm(documentSchema, documentData)
			if (!validation.success) {
				return fail(400, {
					error: 'Validation failed',
					errors: validation.errors,
					...documentData
				})
			}

			// Handle file upload if provided
			let fileUrl: string | undefined
			let fileName: string | undefined
			let fileSize: number | undefined
			let mimeType: string | undefined

			if (file && file.size > 0) {
				// Validate file
				const fileValidation = FormValidator.validateFile(file, {
					maxSize: 10 * 1024 * 1024, // 10MB
					allowedTypes: [
						'application/pdf',
						'application/msword',
						'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
						'image/jpeg',
						'image/png',
						'image/webp'
					],
					required: false
				})

				if (!fileValidation.isValid) {
					return fail(400, {
						error: fileValidation.error,
						...documentData
					})
				}

				try {
					const uploadResult = await uploadFile(file, {
						maxFileSize: 10 * 1024 * 1024,
						allowedMimeTypes: [
							'application/pdf',
							'application/msword',
							'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
							'image/jpeg',
							'image/png',
							'image/webp'
						]
					})

					fileUrl = uploadResult.url
					fileName = uploadResult.originalName
					fileSize = uploadResult.size
					mimeType = uploadResult.mimeType
				} catch (error) {
					console.error('File upload error:', error)
					return fail(500, {
						error: 'Failed to upload file. Please try again.',
						...documentData
					})
				}
			}

			// Insert document into database
			const [newDocument] = await db.insert(documents).values({
				weddingId: userWedding.id,
				title: validation.data.title,
				type: validation.data.type as 'permit' | 'license' | 'contract' | 'other',
				status: validation.data.status as 'pending' | 'approved' | 'rejected',
				dueDate: validation.data.dueDate ? new Date(validation.data.dueDate) : null,
				fileUrl,
				fileName,
				fileSize,
				mimeType,
				notes: validation.data.notes,
				reminderSent: false
			}).returning()

			// Create reminder if due date is set
			if (validation.data.dueDate) {
				await ReminderService.createDocumentReminder(
					newDocument.id,
					new Date(validation.data.dueDate),
					7 // 7 days before due date
				)
			}

			return {
				success: 'Document created successfully',
				document: newDocument
			}

		} catch (error) {
			console.error('Document creation error:', error)
			return fail(500, { error: 'Failed to create document. Please try again.' })
		}
	},

	update: async ({ request, locals: { supabase } }) => {
		const { data: { user }, error: authError } = await supabase.auth.getUser()
		
		if (authError || !user) {
			return fail(401, { error: 'Unauthorized' })
		}

		try {
			const formData = await request.formData()
			
			// Get user's wedding
			const userWedding = await db.query.weddings.findFirst({
				where: eq(weddings.userId, user.id)
			})

			if (!userWedding) {
				return fail(400, { error: 'No wedding found. Please create a wedding first.' })
			}

			// Extract form data
			const documentId = formData.get('documentId') as string
			const title = formData.get('title') as string
			const type = formData.get('type') as string
			const status = formData.get('status') as string
			const dueDate = formData.get('dueDate') as string
			const notes = formData.get('notes') as string
			const file = formData.get('file') as File

			if (!documentId) {
				return fail(400, { error: 'Document ID is required' })
			}

			// Get existing document
			const existingDocument = await db.query.documents.findFirst({
				where: and(
					eq(documents.id, documentId),
					eq(documents.weddingId, userWedding.id)
				)
			})

			if (!existingDocument) {
				return fail(404, { error: 'Document not found' })
			}

			// Prepare data for validation (only include non-empty fields)
			const documentData: any = {}
			if (title) documentData.title = title
			if (type) documentData.type = type
			if (status) documentData.status = status
			if (dueDate) documentData.dueDate = dueDate
			if (notes !== undefined) documentData.notes = notes || null

			// Validate document data
			const validation = FormValidator.validateForm(documentUpdateSchema, documentData)
			if (!validation.success) {
				return fail(400, {
					error: 'Validation failed',
					errors: validation.errors,
					documentId,
					...documentData
				})
			}

			// Handle file upload if provided
			let fileUrl = existingDocument.fileUrl
			let fileName = existingDocument.fileName
			let fileSize = existingDocument.fileSize
			let mimeType = existingDocument.mimeType

			if (file && file.size > 0) {
				// Validate file
				const fileValidation = FormValidator.validateFile(file, {
					maxSize: 10 * 1024 * 1024, // 10MB
					allowedTypes: [
						'application/pdf',
						'application/msword',
						'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
						'image/jpeg',
						'image/png',
						'image/webp'
					],
					required: false
				})

				if (!fileValidation.isValid) {
					return fail(400, {
						error: fileValidation.error,
						documentId,
						...documentData
					})
				}

				try {
					// Delete old file if exists
					if (existingDocument.fileUrl) {
						// Extract key from URL for deletion
						const urlParts = existingDocument.fileUrl.split('/')
						const oldKey = urlParts[urlParts.length - 1]
						if (oldKey) {
							try {
								await deleteFile(oldKey)
							} catch (deleteError) {
								console.warn('Failed to delete old file:', deleteError)
							}
						}
					}

					// Upload new file
					const uploadResult = await uploadFile(file, {
						maxFileSize: 10 * 1024 * 1024,
						allowedMimeTypes: [
							'application/pdf',
							'application/msword',
							'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
							'image/jpeg',
							'image/png',
							'image/webp'
						]
					})

					fileUrl = uploadResult.url
					fileName = uploadResult.originalName
					fileSize = uploadResult.size
					mimeType = uploadResult.mimeType
				} catch (error) {
					console.error('File upload error:', error)
					return fail(500, {
						error: 'Failed to upload file. Please try again.',
						documentId,
						...documentData
					})
				}
			}

			// Update document in database
			const [updatedDocument] = await db.update(documents)
				.set({
					...validation.data,
					fileUrl,
					fileName,
					fileSize,
					mimeType,
					updatedAt: new Date()
				})
				.where(eq(documents.id, documentId))
				.returning()

			// Update reminders if due date changed
			await ReminderService.updateDocumentReminders(
				documentId,
				validation.data.dueDate ? new Date(validation.data.dueDate) : undefined,
				7 // 7 days before due date
			)

			return {
				success: 'Document updated successfully',
				document: updatedDocument
			}

		} catch (error) {
			console.error('Document update error:', error)
			return fail(500, { error: 'Failed to update document. Please try again.' })
		}
	},

	delete: async ({ request, locals: { supabase } }) => {
		const { data: { user }, error: authError } = await supabase.auth.getUser()
		
		if (authError || !user) {
			return fail(401, { error: 'Unauthorized' })
		}

		try {
			const formData = await request.formData()
			const documentId = formData.get('documentId') as string

			if (!documentId) {
				return fail(400, { error: 'Document ID is required' })
			}

			// Get user's wedding
			const userWedding = await db.query.weddings.findFirst({
				where: eq(weddings.userId, user.id)
			})

			if (!userWedding) {
				return fail(400, { error: 'No wedding found. Please create a wedding first.' })
			}

			// Get existing document
			const existingDocument = await db.query.documents.findFirst({
				where: and(
					eq(documents.id, documentId),
					eq(documents.weddingId, userWedding.id)
				)
			})

			if (!existingDocument) {
				return fail(404, { error: 'Document not found' })
			}

			// Delete file from storage if exists
			if (existingDocument.fileUrl) {
				try {
					// Extract key from URL for deletion
					const urlParts = existingDocument.fileUrl.split('/')
					const fileKey = urlParts[urlParts.length - 1]
					if (fileKey) {
						await deleteFile(fileKey)
					}
				} catch (deleteError) {
					console.warn('Failed to delete file from storage:', deleteError)
					// Continue with database deletion even if file deletion fails
				}
			}

			// Delete reminders first (due to foreign key constraint)
			await ReminderService.deleteDocumentReminders(documentId)

			// Delete document from database
			await db.delete(documents)
				.where(eq(documents.id, documentId))

			return {
				success: 'Document deleted successfully'
			}

		} catch (error) {
			console.error('Document deletion error:', error)
			return fail(500, { error: 'Failed to delete document. Please try again.' })
		}
	},

	updateStatus: async ({ request, locals: { supabase } }) => {
		const { data: { user }, error: authError } = await supabase.auth.getUser()
		
		if (authError || !user) {
			return fail(401, { error: 'Unauthorized' })
		}

		try {
			const formData = await request.formData()
			const documentId = formData.get('documentId') as string
			const status = formData.get('status') as string

			if (!documentId || !status) {
				return fail(400, { error: 'Document ID and status are required' })
			}

			// Validate status
			if (!['pending', 'approved', 'rejected'].includes(status)) {
				return fail(400, { error: 'Invalid status' })
			}

			// Get user's wedding
			const userWedding = await db.query.weddings.findFirst({
				where: eq(weddings.userId, user.id)
			})

			if (!userWedding) {
				return fail(400, { error: 'No wedding found. Please create a wedding first.' })
			}

			// Check if document exists and belongs to user
			const existingDocument = await db.query.documents.findFirst({
				where: and(
					eq(documents.id, documentId),
					eq(documents.weddingId, userWedding.id)
				)
			})

			if (!existingDocument) {
				return fail(404, { error: 'Document not found' })
			}

			// Update document status
			const [updatedDocument] = await db.update(documents)
				.set({
					status: status as 'pending' | 'approved' | 'rejected',
					updatedAt: new Date()
				})
				.where(eq(documents.id, documentId))
				.returning()

			return {
				success: 'Document status updated successfully',
				document: updatedDocument
			}

		} catch (error) {
			console.error('Document status update error:', error)
			return fail(500, { error: 'Failed to update document status. Please try again.' })
		}
	}
}