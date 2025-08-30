import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { db } from '$lib/server/db'
import { weddings, vendors } from '$lib/server/db/schema'
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
			vendors: [],
			vendorStats: {
				total: 0,
				booked: 0,
				negotiating: 0,
				contacted: 0,
				completed: 0
			}
		}
	}

	// Get all vendors for this wedding
	const allVendors = await db.query.vendors.findMany({
		where: eq(vendors.weddingId, userWedding.id),
		orderBy: [desc(vendors.updatedAt)]
	})

	// Calculate vendor statistics
	const vendorStats = {
		total: allVendors.length,
		booked: allVendors.filter(v => v.status === 'booked').length,
		negotiating: allVendors.filter(v => v.status === 'negotiating').length,
		contacted: allVendors.filter(v => v.status === 'contacted').length,
		completed: allVendors.filter(v => v.status === 'completed').length
	}

	return {
		wedding: userWedding,
		vendors: allVendors,
		vendorStats
	}
}