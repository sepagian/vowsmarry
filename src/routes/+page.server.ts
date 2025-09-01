import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals: { user } }) => {
	if (user) {
		redirect(302, '/dashboard')
	} else {
		redirect(302, '/login')
	}
}