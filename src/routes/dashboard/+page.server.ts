import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { db } from '$lib/server/db'
import { 
	weddings, 
	budgetItems, 
	todos, 
	vendors, 
	documents,
	savingsSummaries
} from '$lib/server/db/schema'
import { eq, desc, asc, and, gte, lte, sum, count } from 'drizzle-orm'

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: { user }, error } = await supabase.auth.getUser()
	
	if (error || !user) {
		redirect(302, '/login')
	}

	// Get user's wedding data
	const userWedding = await db.query.weddings.findFirst({
		where: eq(weddings.userId, user.id),
		with: {
			savingsSummaries: true
		}
	})

	if (!userWedding) {
		// No wedding data yet, return empty state
		return {
			user: {
				id: user.id,
				email: user.email || '',
				firstName: user.user_metadata?.first_name || '',
				lastName: user.user_metadata?.last_name || ''
			},
			wedding: null,
			savings: null,
			stats: {
				documents: { total: 0, pending: 0, approved: 0 },
				todos: { total: 0, todo: 0, inProgress: 0, done: 0 },
				budget: { total: 0, spent: 0, remaining: 0 },
				vendors: { total: 0, contacted: 0, booked: 0 }
			},
			recentTasks: [],
			upcomingDeadlines: []
		}
	}

	// Get aggregated stats for the wedding
	const [budgetStats, todoStats, vendorStats, documentStats] = await Promise.all([
		// Budget stats
		db.select({
			total: sum(budgetItems.plannedAmount),
			spent: sum(budgetItems.actualAmount)
		}).from(budgetItems).where(eq(budgetItems.weddingId, userWedding.id)),
		
		// Todo stats
		db.select({
			status: todos.status,
			count: count()
		}).from(todos)
			.where(eq(todos.weddingId, userWedding.id))
			.groupBy(todos.status),
		
		// Vendor stats
		db.select({
			status: vendors.status,
			count: count()
		}).from(vendors)
			.where(eq(vendors.weddingId, userWedding.id))
			.groupBy(vendors.status),
		
		// Document stats
		db.select({
			status: documents.status,
			count: count()
		}).from(documents)
			.where(eq(documents.weddingId, userWedding.id))
			.groupBy(documents.status)
	])

	// Process budget stats
	const budgetTotal = Number(budgetStats[0]?.total || 0)
	const budgetSpent = Number(budgetStats[0]?.spent || 0)
	const budgetRemaining = budgetTotal - budgetSpent

	// Process todo stats
	const todoStatsMap = todoStats.reduce((acc, stat) => {
		if (stat.status) {
			acc[stat.status] = stat.count
		}
		return acc
	}, {} as Record<string, number>)

	// Process vendor stats
	const vendorStatsMap = vendorStats.reduce((acc, stat) => {
		if (stat.status) {
			acc[stat.status] = stat.count
		}
		return acc
	}, {} as Record<string, number>)

	// Process document stats
	const documentStatsMap = documentStats.reduce((acc, stat) => {
		if (stat.status) {
			acc[stat.status] = stat.count
		}
		return acc
	}, {} as Record<string, number>)

	// Get recent tasks (last 5)
	const recentTasks = await db.query.todos.findMany({
		where: eq(todos.weddingId, userWedding.id),
		orderBy: [desc(todos.updatedAt)],
		limit: 5
	})

	// Get upcoming deadlines (next 30 days)
	const today = new Date()
	const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
	
	const upcomingTasks = await db.query.todos.findMany({
		where: and(
			eq(todos.weddingId, userWedding.id),
			gte(todos.dueDate, today),
			lte(todos.dueDate, thirtyDaysFromNow)
		),
		orderBy: [asc(todos.dueDate)],
		limit: 10
	})

	const upcomingDocuments = await db.query.documents.findMany({
		where: and(
			eq(documents.weddingId, userWedding.id),
			gte(documents.dueDate, today),
			lte(documents.dueDate, thirtyDaysFromNow)
		),
		orderBy: [asc(documents.dueDate)],
		limit: 5
	})

	// Combine and format upcoming deadlines
	const upcomingDeadlines = [
		...upcomingTasks.map(task => ({
			id: task.id,
			title: task.title,
			date: task.dueDate!,
			type: 'task',
			status: task.status
		})),
		...upcomingDocuments.map(doc => ({
			id: doc.id,
			title: doc.title,
			date: doc.dueDate!,
			type: 'document',
			status: doc.status
		}))
	].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

	return {
		user: {
			id: user.id,
			email: user.email || '',
			firstName: user.user_metadata?.first_name || '',
			lastName: user.user_metadata?.last_name || ''
		},
		wedding: userWedding,
		savings: userWedding.savingsSummaries[0] || null,
		stats: {
			documents: {
				total: documentStats.reduce((sum, stat) => sum + stat.count, 0),
				pending: documentStatsMap.pending || 0,
				approved: documentStatsMap.approved || 0
			},
			todos: {
				total: todoStats.reduce((sum, stat) => sum + stat.count, 0),
				todo: todoStatsMap.todo || 0,
				inProgress: todoStatsMap.in_progress || 0,
				done: todoStatsMap.done || 0
			},
			budget: {
				total: budgetTotal,
				spent: budgetSpent,
				remaining: budgetRemaining
			},
			vendors: {
				total: vendorStats.reduce((sum, stat) => sum + stat.count, 0),
				contacted: vendorStatsMap.contacted || 0,
				booked: vendorStatsMap.booked || 0
			}
		},
		recentTasks,
		upcomingDeadlines
	}
}