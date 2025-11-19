import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as weddings from './schema/planner';
import * as invitations from './schema/invitation';
import { env } from '$env/dynamic/private';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = postgres(env.DATABASE_URL);

export const plannerDb = drizzle(client, { schema: weddings });
export const invitationDb = drizzle(client, { schema: invitations });
