import type { RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const HOUR_IN_MS = 1000 * 60 * 60;

export const sessionCookieName = 'auth-session';

export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(18));
	const token = encodeBase64url(bytes);
	return token;
}

export function generateEmailVerificationToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(32));
	const token = encodeBase64url(bytes);
	return token;
}

export function generatePasswordResetToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(32));
	const token = encodeBase64url(bytes);
	return token;
}

export async function hashPassword(password: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(password);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
	return hashHex;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
	const hashedPassword = await hashPassword(password);
	return hashedPassword === hash;
}

export async function createUser(email: string, password: string, firstName: string, lastName: string) {
	const passwordHash = await hashPassword(password);
	const emailVerificationToken = generateEmailVerificationToken();
	
	const [user] = await db.insert(table.users).values({
		email,
		passwordHash,
		firstName,
		lastName,
		emailVerificationToken,
		emailVerified: false
	}).returning();
	
	return { user, emailVerificationToken };
}

export async function createSession(token: string, userId: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: table.NewSession = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + DAY_IN_MS * 30)
	};
	await db.insert(table.sessions).values(session);
	return session;
}

export async function validateSessionToken(token: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const [result] = await db
		.select({
			user: { 
				id: table.users.id, 
				email: table.users.email,
				firstName: table.users.firstName,
				lastName: table.users.lastName,
				emailVerified: table.users.emailVerified
			},
			session: table.sessions
		})
		.from(table.sessions)
		.innerJoin(table.users, eq(table.sessions.userId, table.users.id))
		.where(eq(table.sessions.id, sessionId));

	if (!result) {
		return { session: null, user: null };
	}
	const { session, user } = result;

	const sessionExpired = Date.now() >= session.expiresAt.getTime();
	if (sessionExpired) {
		await db.delete(table.sessions).where(eq(table.sessions.id, session.id));
		return { session: null, user: null };
	}

	const renewSession = Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15;
	if (renewSession) {
		session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
		await db
			.update(table.sessions)
			.set({ expiresAt: session.expiresAt })
			.where(eq(table.sessions.id, session.id));
	}

	return { session, user };
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(sessionId: string) {
	await db.delete(table.sessions).where(eq(table.sessions.id, sessionId));
}

export async function invalidateAllUserSessions(userId: string) {
	await db.delete(table.sessions).where(eq(table.sessions.userId, userId));
}

export async function verifyEmailToken(token: string) {
	const [user] = await db
		.select()
		.from(table.users)
		.where(eq(table.users.emailVerificationToken, token));

	if (!user || user.emailVerified) {
		return null;
	}

	await db
		.update(table.users)
		.set({ 
			emailVerified: true, 
			emailVerificationToken: null,
			updatedAt: new Date()
		})
		.where(eq(table.users.id, user.id));

	return user;
}

export async function createPasswordResetToken(email: string) {
	const [user] = await db
		.select()
		.from(table.users)
		.where(eq(table.users.email, email));

	if (!user) {
		return null;
	}

	const resetToken = generatePasswordResetToken();
	const expiresAt = new Date(Date.now() + HOUR_IN_MS * 2); // 2 hours

	await db
		.update(table.users)
		.set({ 
			passwordResetToken: resetToken,
			passwordResetExpiresAt: expiresAt,
			updatedAt: new Date()
		})
		.where(eq(table.users.id, user.id));

	return resetToken;
}

export async function resetPassword(token: string, newPassword: string) {
	const [user] = await db
		.select()
		.from(table.users)
		.where(eq(table.users.passwordResetToken, token));

	if (!user || !user.passwordResetExpiresAt || Date.now() > user.passwordResetExpiresAt.getTime()) {
		return null;
	}

	const passwordHash = await hashPassword(newPassword);

	await db
		.update(table.users)
		.set({ 
			passwordHash,
			passwordResetToken: null,
			passwordResetExpiresAt: null,
			updatedAt: new Date()
		})
		.where(eq(table.users.id, user.id));

	// Invalidate all existing sessions
	await invalidateAllUserSessions(user.id);

	return user;
}

export async function getUserByEmail(email: string) {
	const [user] = await db
		.select()
		.from(table.users)
		.where(eq(table.users.email, email));

	return user || null;
}

export async function getUserById(id: string) {
	const [user] = await db
		.select()
		.from(table.users)
		.where(eq(table.users.id, id));

	return user || null;
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
	event.cookies.set(sessionCookieName, token, {
		expires: expiresAt,
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax'
	});
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.delete(sessionCookieName, {
		path: '/'
	});
}
