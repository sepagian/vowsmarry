import { redirect, error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getAuth } from '$lib/server/auth';

/**
 * Load invitation details
 */
export const load: PageServerLoad = async ({ params, locals, platform, request }) => {
	const { invitationId } = params;
	const { user } = locals;

	if (!platform) {
		throw error(500, 'Platform not available');
	}

	const auth = getAuth(platform.env.vowsmarry);

	try {
		// Get invitation details (this doesn't require membership)
		const invitation = await auth.api.getInvitation({
			query: {
				id: invitationId,
			},
			headers: request.headers,
		});

		if (!invitation) {
			throw error(404, 'Invitation not found');
		}

		// Check if invitation is still pending
		if (invitation.status !== 'pending') {
			throw error(400, 'This invitation has already been processed');
		}

		// Check if invitation has expired
		if (invitation.expiresAt && new Date(invitation.expiresAt) < new Date()) {
			throw error(400, 'This invitation has expired');
		}

		// Get organization details from the database
		// We can't use getFullOrganization because user isn't a member yet
		let organization = null;

		if (platform.env.vowsmarry) {
			try {
				// Query the organization table directly from D1
				const orgResult = await platform.env.vowsmarry
					.prepare('SELECT id, name, slug, logo, metadata FROM organization WHERE id = ?')
					.bind(invitation.organizationId)
					.first();

				if (orgResult) {
					// Parse metadata if it exists
					let metadata = null;
					if (orgResult.metadata) {
						try {
							metadata = JSON.parse(orgResult.metadata as string);
						} catch (e) {
							console.error('Failed to parse organization metadata:', e);
						}
					}

					organization = {
						id: orgResult.id,
						name: orgResult.name,
						slug: orgResult.slug,
						logo: orgResult.logo,
						metadata,
					};

					console.log('Found organization:', organization);
				} else {
					console.log('No organization found with ID:', invitation.organizationId);
				}
			} catch (dbErr) {
				console.error('Failed to query organization from database:', dbErr);
			}
		}

		// If still no organization, create a minimal one
		if (!organization) {
			console.log('Using fallback organization name');
			organization = {
				id: invitation.organizationId,
				name: 'Wedding Workspace',
				metadata: null,
			};
		}

		return {
			invitation,
			organization,
			isAuthenticated: !!user,
			userEmail: user?.email,
		};
	} catch (err) {
		console.error('Failed to load invitation:', err);
		
		// Check if it's a specific error we can handle
		const errorMessage = err instanceof Error ? err.message : String(err);
		
		if (errorMessage.includes('not found')) {
			throw error(404, 'Invitation not found');
		}
		
		if (errorMessage.includes('already been processed')) {
			throw error(400, 'This invitation has already been processed');
		}
		
		if (errorMessage.includes('expired')) {
			throw error(400, 'This invitation has expired');
		}
		
		throw error(500, 'Failed to load invitation details');
	}
};

export const actions: Actions = {
	/**
	 * Accept the invitation
	 */
	accept: async ({ params, locals, platform, request }) => {
		const { invitationId } = params;
		const { user, session } = locals;

		if (!user || !session) {
			return fail(401, { message: 'You must be logged in to accept invitations' });
		}

		if (!platform) {
			return fail(500, { message: 'Platform not available' });
		}

		const auth = getAuth(platform.env.vowsmarry);

		try {
			// Accept the invitation
			await auth.api.acceptInvitation({
				body: {
					invitationId,
				},
				headers: request.headers,
			});

			// Redirect to dashboard with the new organization active
			throw redirect(303, '/dashboard');
		} catch (err) {
			console.error('Failed to accept invitation:', err);

			const errorMessage = err instanceof Error ? err.message : String(err);

			if (errorMessage.includes('email')) {
				return fail(400, {
					message: 'This invitation was sent to a different email address',
				});
			}

			return fail(500, {
				message: 'Failed to accept invitation',
			});
		}
	},

	/**
	 * Reject the invitation
	 */
	reject: async ({ params, locals, platform, request }) => {
		const { invitationId } = params;
		const { user, session } = locals;

		if (!user || !session) {
			return fail(401, { message: 'You must be logged in to reject invitations' });
		}

		if (!platform) {
			return fail(500, { message: 'Platform not available' });
		}

		const auth = getAuth(platform.env.vowsmarry);

		try {
			// Reject the invitation
			await auth.api.rejectInvitation({
				body: {
					invitationId,
				},
				headers: request.headers,
			});

			// Redirect to dashboard
			throw redirect(303, '/dashboard');
		} catch (err) {
			console.error('Failed to reject invitation:', err);

			return fail(500, {
				message: 'Failed to reject invitation',
			});
		}
	},
};
