import { db } from '$lib/server/db';
import { documentReminders, documents, notifications } from '$lib/server/db/schema';
import { eq, lte, and } from 'drizzle-orm';

export class ReminderService {
	/**
	 * Process due document reminders and create notifications
	 */
	static async processDueReminders(): Promise<void> {
		try {
			const now = new Date();
			
			// Get all unsent reminders that are due
			const dueReminders = await db.query.documentReminders.findMany({
				where: and(
					eq(documentReminders.sent, false),
					lte(documentReminders.reminderDate, now)
				),
				with: {
					document: {
						with: {
							wedding: true
						}
					}
				}
			});

			for (const reminder of dueReminders) {
				if (!reminder.document) continue;

				// Create notification
				await db.insert(notifications).values({
					userId: reminder.document.wedding.userId,
					weddingId: reminder.document.weddingId,
					type: 'deadline_alert',
					title: 'Document Deadline Approaching',
					message: `Your document "${reminder.document.title}" is due soon. Due date: ${reminder.document.dueDate?.toLocaleDateString()}`,
					priority: 'high',
					isRead: false,
					actionUrl: `/dashboard/paperwork`,
					metadata: {
						documentId: reminder.document.id,
						documentTitle: reminder.document.title,
						dueDate: reminder.document.dueDate
					}
				});

				// Mark reminder as sent
				await db.update(documentReminders)
					.set({ sent: true })
					.where(eq(documentReminders.id, reminder.id));
			}

			console.log(`Processed ${dueReminders.length} document reminders`);
		} catch (error) {
			console.error('Error processing document reminders:', error);
		}
	}

	/**
	 * Create a reminder for a document
	 */
	static async createDocumentReminder(
		documentId: string,
		dueDate: Date,
		reminderDaysBefore: number = 7
	): Promise<void> {
		const reminderDate = new Date(dueDate.getTime() - reminderDaysBefore * 24 * 60 * 60 * 1000);
		
		// Only create reminder if it's in the future
		if (reminderDate > new Date()) {
			await db.insert(documentReminders).values({
				documentId,
				reminderDate,
				sent: false
			});
		}
	}

	/**
	 * Update reminders for a document (delete old ones and create new if needed)
	 */
	static async updateDocumentReminders(
		documentId: string,
		newDueDate?: Date,
		reminderDaysBefore: number = 7
	): Promise<void> {
		// Delete existing reminders
		await db.delete(documentReminders)
			.where(eq(documentReminders.documentId, documentId));

		// Create new reminder if due date is provided
		if (newDueDate) {
			await this.createDocumentReminder(documentId, newDueDate, reminderDaysBefore);
		}
	}

	/**
	 * Delete all reminders for a document
	 */
	static async deleteDocumentReminders(documentId: string): Promise<void> {
		await db.delete(documentReminders)
			.where(eq(documentReminders.documentId, documentId));
	}

	/**
	 * Get overdue documents for a wedding
	 */
	static async getOverdueDocuments(weddingId: string): Promise<any[]> {
		const now = new Date();
		
		return await db.query.documents.findMany({
			where: and(
				eq(documents.weddingId, weddingId),
				lte(documents.dueDate, now),
				eq(documents.status, 'pending')
			),
			orderBy: documents.dueDate
		});
	}

	/**
	 * Get upcoming deadlines for a wedding (next 30 days)
	 */
	static async getUpcomingDeadlines(weddingId: string, days: number = 30): Promise<any[]> {
		const now = new Date();
		const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
		
		return await db.query.documents.findMany({
			where: and(
				eq(documents.weddingId, weddingId),
				lte(documents.dueDate, futureDate),
				eq(documents.status, 'pending')
			),
			orderBy: documents.dueDate
		});
	}
}