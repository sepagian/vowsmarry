import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { db } from '$lib/server/db'
import { weddings, dresscodes } from '$lib/server/db/schema'
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
			dresscodes: [],
			dresscodeStats: {
				total: 0,
				byType: {},
				byEvent: {}
			}
		}
	}

	// Get all dresscodes for this wedding
	const allDresscodes = await db.query.dresscodes.findMany({
		where: eq(dresscodes.weddingId, userWedding.id),
		orderBy: [desc(dresscodes.updatedAt)]
	})

	// Calculate dresscode statistics
	const dresscodeStats = {
		total: allDresscodes.length,
		byType: allDresscodes.reduce((acc, dresscode) => {
			const type = dresscode.dresscodeType || 'custom'
			acc[type] = (acc[type] || 0) + 1
			return acc
		}, {} as Record<string, number>),
		byEvent: allDresscodes.reduce((acc, dresscode) => {
			const event = dresscode.eventName || 'Unknown Event'
			acc[event] = (acc[event] || 0) + 1
			return acc
		}, {} as Record<string, number>)
	}

	return {
		wedding: userWedding,
		dresscodes: allDresscodes,
		dresscodeStats
	}
}