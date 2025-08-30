import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { db } from '$lib/server/db'
import { weddings, documents } from '$lib/server/db/schema'
import { eq, desc } from 'drizzle-orm'

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
		doc.dueDate >= today && 
		doc.dueDate <= thirtyDaysFromNow
	).sort((a, b) => (a.dueDate! < b.dueDate!) ? -1 : 1)

	return {
		wedding: userWedding,
		documents: allDocuments,
		documentStats,
		upcomingDeadlines
	}
}