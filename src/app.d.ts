import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import type { Database as SupabaseDatabase } from './database.types.ts'; // import generated types
import type { D1Database } from '@cloudflare/workers-types';
import type { Kysely } from 'kysely';
import type { Database } from '$lib/server/db/schema/types';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient<SupabaseDatabase>;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
			session: Session | null;
			user: User | null;
		}
		interface PageData {
			session: Session | null;
		}
		// interface PageState {}
		interface Platform {
			env: {
				vowsmarry: D1Database;
				// Add other Cloudflare bindings as needed
			};
			context: {
				waitUntil(promise: Promise<unknown>): void;
			};
			caches: CacheStorage & { default: Cache };
		}
	}
}

// Extend RequestEvent to include Kysely database instances
declare module '@sveltejs/kit' {
	interface RequestEvent {
		plannerDb: Kysely<Database>;
		invitationDb: Kysely<Database>;
	}
}

export {};
