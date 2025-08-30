import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { db } from '$lib/server/db'
import { weddings, rundownEvents } from '$lib/server/db/schema'
import { eq, asc, count } from 'drizzle-orm'

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: { user }, error } = await supabase.auth.getUser()
	
	if (error || !user) {
		redirect(302, '/login')
	}

	// Get user's wedding
	const userWedding = await db.query.weddings.findFirst({
		where: eq(weddings.userId, user.id)
	})

	if (!userWedding) {
		return {
			rundownEvents: [],
			rundownStats: {
				total: 0,
				planned: 0,
				confirmed: 0,
				inProgress: 0,
				completed: 0,
				cancelled: 0,
				duration: 0,
				byType: {},
				byStatus: {}
			}
		}
	}

	// Get all rundown events
	const allRundownEvents = await db.query.rundownEvents.findMany({
		where: eq(rundownEvents.weddingId, userWedding.id),
		orderBy: [asc(rundownEvents.startTime)]
	})

	// Calculate statistics
	const rundownStats = {
		total: allRundownEvents.length,
		planned: allRundownEvents.filter(event => event.status === 'planned').length,
		confirmed: allRundownEvents.filter(event => event.status === 'confirmed').length,
		inProgress: allRundownEvents.filter(event => event.status === 'in_progress').length,
		completed: allRundownEvents.filter(event => event.status === 'completed').length,
		cancelled: allRundownEvents.filter(event => event.status === 'cancelled').length,
		duration: allRundownEvents.reduce((total, event) => total + (event.duration || 0), 0),
		byType: allRundownEvents.reduce((acc, event) => {
			const type = event.eventType || 'other'
			acc[type] = (acc[type] || 0) + 1
			return acc
		}, {} as Record<string, number>),
		byStatus: allRundownEvents.reduce((acc, event) => {
			const status = event.status || 'planned'
			acc[status] = (acc[status] || 0) + 1
			return acc
		}, {} as Record<string, number>)
	}

	return {
		rundownEvents: allRundownEvents,
		rundownStats
	}
}