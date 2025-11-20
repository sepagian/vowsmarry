import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as weddings from './schema/planner';
import * as invitations from './schema/invitation';
import { env } from '$env/dynamic/private';

if (!env.HYPERDRIVE_URL) throw new Error('HYPERDRIVE_URL is not set');

const client = postgres(env.HYPERDRIVE_URL, { ssl: 'require' });

export const plannerDb = drizzle(client, { schema: weddings });
export const invitationDb = drizzle(client, { schema: invitations });
