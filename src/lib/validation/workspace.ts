import * as v from 'valibot';

/**
 * Onboarding form validation schema
 *
 * Validates wedding workspace creation data including couple names,
 * wedding date, venue, workspace name, slug, and optional partner invitation.
 *
 * @example
 * ```typescript
 * import { workspaceSchema} from '$lib/validation/auth';
 *
 * const form = superForm(data.form, {
 *   validators: valibot(workspaceSchema),
 * });
 * ```
 */
export const workspaceSchema = v.object({
	workspaceName: v.pipe(
		v.string(),
		v.nonEmpty('Workspace name is required'),
		v.minLength(2, 'Workspace name must be at least 2 characters'),
	),
	slug: v.pipe(
		v.string(),
		v.nonEmpty('Workspace slug is required'),
		v.minLength(3, 'Slug must be at least 3 characters'),
		v.regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
	),
});

export const inviteSchema = v.object({
	partnerEmail: v.pipe(v.string(), v.email('Please enter a valid email')),
});

/**
 * Inferred TypeScript type for onboarding form data
 */

export type WorkspaceData = v.InferInput<typeof workspaceSchema>;
