import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals: { session } }) => {
	if (session) {
		redirect(302, '/dashboard')
	} else {
		redirect(302, '/login')
	}
}