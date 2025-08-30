import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { db } from '$lib/server/db'
import { weddings, souvenirs } from '$lib/server/db/schema'
import { eq, sum } from 'drizzle-orm'

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
			souvenirs: [],
			souvenirStats: {
				totalItems: 0,
				totalQuantity: 0,
				totalCost: 0,
				planned: 0,
				ordered: 0,
				received: 0,
				distributed: 0,
				byCategory: {},
				byStatus: {},
				averageCost: 0
			}
		}
	}

	// Get all souvenirs
	const allSouvenirs = await db.query.souvenirs.findMany({
		where: eq(souvenirs.weddingId, userWedding.id)
	})

	// Calculate statistics
	const totalItems = allSouvenirs.length
	const totalQuantity = allSouvenirs.reduce((sum, item) => sum + (item.quantity || 0), 0)
	const totalCost = allSouvenirs.reduce((sum, item) => sum + Number(item.totalCost || 0), 0)
	const averageCost = totalItems > 0 ? totalCost / totalItems : 0

	const souvenirStats = {
		totalItems,
		totalQuantity,
		totalCost,
		planned: allSouvenirs.filter(item => item.status === 'planned').length,
		ordered: allSouvenirs.filter(item => item.status === 'ordered').length,
		received: allSouvenirs.filter(item => item.status === 'received').length,
		distributed: allSouvenirs.filter(item => item.status === 'distributed').length,
		byCategory: allSouvenirs.reduce((acc, item) => {
			const category = item.category || 'custom'
			acc[category] = (acc[category] || 0) + 1
			return acc
		}, {} as Record<string, number>),
		byStatus: allSouvenirs.reduce((acc, item) => {
			const status = item.status || 'planned'
			acc[status] = (acc[status] || 0) + 1
			return acc
		}, {} as Record<string, number>),
		averageCost
	}

	return {
		souvenirs: allSouvenirs,
		souvenirStats
	}
}