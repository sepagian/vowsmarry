import { createServerClient } from '@supabase/ssr';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { getDb } from '$lib/server/db';

const database: Handle = async ({ event, resolve }) => {
	// Initialize Kysely database instances from platform bindings
	if (event.platform?.env) {
		// Both plannerDb and invitationDb use the same D1 database (vowsmarry)
		const db = getDb(event.platform.env.vowsmarry);
		event.plannerDb = db;
		event.invitationDb = db;
	}

	return resolve(event);
};

const supabase: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			},
		},
	});

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		},
	});
};

const authGuard: Handle = async ({ event, resolve }) => {
	const {
		data: { user },
		error,
	} = await event.locals.supabase.auth.getUser();

	event.locals.session = null;
	event.locals.user = error ? null : user;

	if (!event.locals.user && event.url.pathname.startsWith('/dashboard')) {
		redirect(303, '/login');
	}

	if (
		event.locals.user &&
		(event.url.pathname.startsWith('/login') || event.url.pathname.startsWith('/register'))
	) {
		redirect(303, '/dashboard');
	}

	return resolve(event);
};

export const handle: Handle = sequence(database, supabase, authGuard);
