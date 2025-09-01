import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals: { user } }) => {
	if (user) {
		redirect(302, '/dashboard')
	}
	return {}
}

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData()
		const email = formData.get('email') as string
		const password = formData.get('password') as string

		if (!email || !password) {
			return fail(400, {
				error: 'Email and password are required',
				email
			})
		}

		const { data, error } = await supabase.auth.signInWithPassword({ email, password })

		if (error) {
			console.error('Login error:', error)
			return fail(400, {
				error: error.message,
				email
			})
		}

		console.log('Login successful:', data.user?.email)
		redirect(302, '/dashboard')
	}
}