import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { db } from '$lib/server/db'
import { weddings, todos } from '$lib/server/db/schema'
import { eq, desc, and, lte } from 'drizzle-orm'

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
			todos: [],
			taskStats: {
				total: 0,
				completed: 0,
				inProgress: 0,
				pending: 0,
				overdue: 0
			}
		}
	}

	// Get all todos for this wedding
	const allTodos = await db.query.todos.findMany({
		where: eq(todos.weddingId, userWedding.id),
		orderBy: [desc(todos.updatedAt)]
	})

	// Calculate task statistics
	const today = new Date().toISOString().split('T')[0]
	
	const taskStats = {
		total: allTodos.length,
		completed: allTodos.filter(t => t.status === 'done').length,
		inProgress: allTodos.filter(t => t.status === 'in_progress').length,
		pending: allTodos.filter(t => t.status === 'todo').length,
		overdue: allTodos.filter(t => {
			return t.dueDate && t.status !== 'done' && new Date(t.dueDate).toISOString().split('T')[0] < today
		}).length
	}

	return {
		wedding: userWedding,
		todos: allTodos,
		taskStats
	}
}