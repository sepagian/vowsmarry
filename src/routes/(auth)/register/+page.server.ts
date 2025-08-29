import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals: { session } }) => {
	if (session) {
		redirect(302, '/dashboard')
	}
	return {}
}

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData()
		const firstName = formData.get('firstName') as string
		const lastName = formData.get('lastName') as string
		const email = formData.get('email') as string
		const password = formData.get('password') as string
		const confirmPassword = formData.get('confirmPassword') as string

		// Validation
		if (!firstName || !lastName || !email || !password || !confirmPassword) {
			return fail(400, {
				error: 'All fields are required',
				firstName,
				lastName,
				email
			})
		}

		if (password !== confirmPassword) {
			return fail(400, {
				error: 'Passwords do not match',
				firstName,
				lastName,
				email
			})
		}

		if (password.length < 8) {
			return fail(400, {
				error: 'Password must be at least 8 characters long',
				firstName,
				lastName,
				email
			})
		}

		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					first_name: firstName,
					last_name: lastName
				}
			}
		})

		if (error) {
			return fail(400, {
				error: error.message,
				firstName,
				lastName,
				email
			})
		}

		return {
			success: 'Account created successfully! Please check your email to verify your account.'
		}
	}
}