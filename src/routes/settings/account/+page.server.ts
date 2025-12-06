import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { validateChangePasswordSchema } from '$lib/validation/auth';
import { userSchema } from '$lib/validation/planner';
import { getAuth } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals, plannerDb }) => {
	// Check authentication
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const userId = locals.user.id;

	// Fetch user data from Better Auth user table
	const [userData] = await plannerDb
		.selectFrom('user')
		.selectAll()
		.where('id', '=', userId)
		.limit(1)
		.execute();

	if (!userData) {
		throw redirect(302, '/login');
	}

	// Fetch active sessions
	const activeSessions = await plannerDb
		.selectFrom('session')
		.select(['id', 'createdAt', 'ipAddress', 'userAgent', 'expiresAt'])
		.where('userId', '=', userId)
		.orderBy('createdAt', 'desc')
		.execute();

	// Initialize forms
	const profileForm = await superValidate(
		{
			userName: userData.name,
			userEmail: userData.email,
			userAvatarUrl: userData.image || undefined,
		},
		valibot(userSchema)
	);

	const passwordForm = await superValidate(valibot(validateChangePasswordSchema));

	return {
		user: {
			id: userData.id,
			name: userData.name,
			email: userData.email,
			emailVerified: Boolean(userData.emailVerified),
			image: userData.image,
		},
		activeSessions: activeSessions.map((s) => ({
			id: s.id,
			createdAt: s.createdAt,
			ipAddress: s.ipAddress,
			userAgent: s.userAgent,
			expiresAt: s.expiresAt,
		})),
		profileForm,
		passwordForm,
	};
};

export const actions: Actions = {
	/**
	 * Update user profile (name, email, phone, role)
	 */
	updateProfile: async ({ request, locals, plannerDb }) => {
		if (!locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const form = await superValidate(request, valibot(userSchema));

		console.log('Form validation result:', { valid: form.valid, errors: form.errors, data: form.data });

		if (!form.valid) {
			console.log('Form validation failed:', form.errors);
			return fail(400, { form });
		}

		const userId = locals.user.id;

		try {
			console.log('Updating user profile for userId:', userId);
			console.log('Form data:', form.data);

			// Update Better Auth user table with all user data
			// Note: D1 requires timestamps as numbers, not Date objects
			await plannerDb
				.updateTable('user')
				.set({
					name: form.data.userName,
					email: form.data.userEmail,
					image: form.data.userAvatarUrl || null,
					updatedAt: Date.now(),
				})
				.where('id', '=', userId)
				.execute();

			console.log('Updated user profile in user table');

			console.log('Profile update successful');
			return { form, success: true, message: 'Profile updated successfully' };
		} catch (error) {
			console.error('Profile update error:', error);
			if (error instanceof Error) {
				console.error('Error message:', error.message);
				console.error('Error stack:', error.stack);
			}
			return fail(500, { form, message: 'Failed to update profile' });
		}
	},

	/**
	 * Change user password using Better Auth API
	 *
	 * Uses Better Auth's changePassword API which:
	 * - Verifies the current password
	 * - Hashes the new password with scrypt
	 * - Updates the password in the account table
	 * - Optionally revokes other sessions
	 */
	changePassword: async ({ request, locals, platform }) => {
		if (!locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		if (!platform?.env?.vowsmarry) {
			return fail(500, { message: 'Database connection not available' });
		}

		const form = await superValidate(request, valibot(validateChangePasswordSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const auth = getAuth(platform.env.vowsmarry);

			// Call Better Auth's changePassword API
			// This requires session cookies to be present in the request headers
			await auth.api.changePassword({
				body: {
					newPassword: form.data.newPassword,
					currentPassword: form.data.oldPassword,
					revokeOtherSessions: false, // Keep user logged in on other devices
				},
				headers: request.headers,
			});

			return { form, success: true, message: 'Password changed successfully' };
		} catch (error) {
			console.error('Password change error:', error);

			// Better Auth throws errors with status and message
			if (error && typeof error === 'object' && 'status' in error) {
				const authError = error as { status: number; message?: string };
				return fail(authError.status, {
					form,
					message: authError.message || 'Failed to change password',
				});
			}

			return fail(500, { form, message: 'Failed to change password' });
		}
	},

	/**
	 * Delete a specific session (sign out from device)
	 */
	deleteSession: async ({ request, locals, plannerDb }) => {
		if (!locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const sessionId = formData.get('sessionId') as string;

		if (!sessionId) {
			return fail(400, { message: 'Session ID is required' });
		}

		try {
			// Verify session belongs to user before deleting
			const [sessionToDelete] = await plannerDb
				.selectFrom('session')
				.selectAll()
				.where('id', '=', sessionId)
				.limit(1)
				.execute();

			if (!sessionToDelete || sessionToDelete.userId !== locals.user.id) {
				return fail(403, { message: 'Unauthorized to delete this session' });
			}

			await plannerDb.deleteFrom('session').where('id', '=', sessionId).execute();

			return { success: true, message: 'Session deleted successfully' };
		} catch (error) {
			console.error('Session deletion error:', error);
			return fail(500, { message: 'Failed to delete session' });
		}
	},

	/**
	 * Delete all sessions except current one
	 */
	deleteAllSessions: async ({ request, locals, plannerDb }) => {
		if (!locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const currentSessionId = formData.get('currentSessionId') as string;

		if (!currentSessionId) {
			return fail(400, { message: 'Current session ID is required' });
		}

		try {
			// Delete all sessions except the current one
			await plannerDb
				.deleteFrom('session')
				.where('userId', '=', locals.user.id)
				.where('id', '!=', currentSessionId)
				.execute();

			return { success: true, message: 'All other sessions deleted successfully' };
		} catch (error) {
			console.error('Sessions deletion error:', error);
			return fail(500, { message: 'Failed to delete sessions' });
		}
	},

	/**
	 * Delete user account (soft delete or hard delete)
	 */
	deleteAccount: async ({ locals, plannerDb }) => {
		if (!locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const userId = locals.user.id;

		try {
			// Delete user account (cascade will handle sessions and accounts)
			await plannerDb.deleteFrom('user').where('id', '=', userId).execute();

			// Redirect to home page after account deletion
			throw redirect(302, '/');
		} catch (error) {
			if (error instanceof Response) {
				throw error;
			}
			console.error('Account deletion error:', error);
			return fail(500, { message: 'Failed to delete account' });
		}
	},
};
