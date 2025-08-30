import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { db } from '$lib/server/db'
import { weddings, dowryItems } from '$lib/server/db/schema'
import { eq, desc, sum } from 'drizzle-orm'

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
			dowryItems: [],
			dowryStats: {
				total: 0,
				totalValue: 0,
				promised: 0,
				received: 0,
				documented: 0,
				verified: 0,
				byType: {}
			}
		}
	}

	// Get all dowry items for this wedding
	const allDowryItems = await db.query.dowryItems.findMany({
		where: eq(dowryItems.weddingId, userWedding.id),
		orderBy: [desc(dowryItems.updatedAt)]
	})

	// Calculate dowry statistics
	const dowryStats = {
		total: allDowryItems.length,
		totalValue: allDowryItems.reduce((sum, item) => sum + Number(item.value || 0), 0),
		promised: allDowryItems.filter(item => item.status === 'promised').length,
		received: allDowryItems.filter(item => item.status === 'received').length,
		documented: allDowryItems.filter(item => item.status === 'documented').length,
		verified: allDowryItems.filter(item => item.status === 'verified').length,
		byType: allDowryItems.reduce((acc, item) => {
			const type = item.type || 'other'
			if (!acc[type]) {
				acc[type] = { count: 0, value: 0 }
			}
			acc[type].count += 1
			acc[type].value += Number(item.value || 0)
			return acc
		}, {} as Record<string, { count: number, value: number }>)
	}

	return {
		wedding: userWedding,
		dowryItems: allDowryItems,
		dowryStats
	}
}