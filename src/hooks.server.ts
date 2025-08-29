import { createServerClient } from '@supabase/ssr'
import { type Handle, redirect } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'

const supabase: Handle = async ({ event, resolve }) => {
	/**
	 * Creates a Supabase client specific to this server request.
	 *
	 * The Supabase client gets the Auth token from the request cookies.
	 */
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			/**
			 * SvelteKit's cookies API requires `path` to be explicitly set in
			 * the cookie options. Setting `path` to `/` replicates previous/
			 * standard behavior.
			 */
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' })
				})
			},
		},
	})

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			/**
			 * Supabase libraries use the `content-range` and `x-supabase-api-version`
			 * headers, so we need to tell SvelteKit to pass it through.
			 */
			return name === 'content-range' || name === 'x-supabase-api-version'
		},
	})
}

const authGuard: Handle = async ({ event, resolve }) => {
	const { data: { user }, error } = await event.locals.supabase.auth.getUser()
	
	// No need for session data since we only use user for authentication
	event.locals.session = null
	event.locals.user = error ? null : user

	// Protect dashboard routes
	if (!event.locals.user && event.url.pathname.startsWith('/dashboard')) {
		redirect(303, '/login')
	}

	// Redirect authenticated users away from auth pages
	if (event.locals.user && (event.url.pathname.startsWith('/login') || event.url.pathname.startsWith('/register'))) {
		redirect(303, '/dashboard')
	}

	return resolve(event)
}

export const handle: Handle = sequence(supabase, authGuard)
