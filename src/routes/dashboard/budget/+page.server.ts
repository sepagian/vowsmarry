import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { db } from '$lib/server/db'
import { weddings, budgetItems } from '$lib/server/db/schema'
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
			budgetItems: [],
			budgetSummary: {
				totalPlanned: 0,
				totalActual: 0,
				remaining: 0,
				categories: []
			},
			recentExpenses: []
		}
	}

	// Get all budget items for this wedding
	const allBudgetItems = await db.query.budgetItems.findMany({
		where: eq(budgetItems.weddingId, userWedding.id),
		orderBy: [desc(budgetItems.updatedAt)]
	})

	// Calculate budget summary by category
	const categoryMap = new Map<string, { planned: number, actual: number, items: typeof allBudgetItems }>()
	
	for (const item of allBudgetItems) {
		const category = item.category
		if (!categoryMap.has(category)) {
			categoryMap.set(category, { planned: 0, actual: 0, items: [] })
		}
		
		const categoryData = categoryMap.get(category)!
		categoryData.planned += Number(item.plannedAmount || 0)
		categoryData.actual += Number(item.actualAmount || 0)
		categoryData.items.push(item)
	}

	// Convert to array format for UI
	const categories = Array.from(categoryMap.entries()).map(([name, data]) => ({
		name,
		planned: data.planned,
		actual: data.actual,
		percentage: 0, // Will be calculated below
		itemCount: data.items.length
	}))

	// Calculate totals
	const totalPlanned = categories.reduce((sum, cat) => sum + cat.planned, 0)
	const totalActual = categories.reduce((sum, cat) => sum + cat.actual, 0)

	// Calculate percentages
	categories.forEach(cat => {
		cat.percentage = totalPlanned > 0 ? Math.round((cat.planned / totalPlanned) * 100) : 0
	})

	// Get recent expenses (last 10 items with actual amounts)
	const recentExpenses = allBudgetItems
		.filter(item => item.actualAmount && Number(item.actualAmount) > 0)
		.slice(0, 10)

	return {
		wedding: userWedding,
		budgetItems: allBudgetItems,
		budgetSummary: {
			totalPlanned,
			totalActual,
			remaining: totalPlanned - totalActual,
			categories: categories.sort((a, b) => b.planned - a.planned) // Sort by planned amount desc
		},
		recentExpenses
	}
}