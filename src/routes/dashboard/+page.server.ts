import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: { user }, error } = await supabase.auth.getUser()
	
	if (error || !user) {
		redirect(302, '/login')
	}

	// For now, return minimal data since we're migrating to Supabase database
	// You'll need to recreate your wedding data structure in Supabase
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