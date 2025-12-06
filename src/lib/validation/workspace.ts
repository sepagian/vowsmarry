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

/**
 * Workspace info update schema
 * For updating workspace name, slug, and couple names
 */
export const workspaceInfoSchema = v.object({
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
	groomName: v.pipe(
		v.string(),
		v.nonEmpty('Groom name is required'),
		v.minLength(2, 'Groom name must be at least 2 characters'),
	),
	brideName: v.pipe(
		v.string(),
		v.nonEmpty('Bride name is required'),
		v.minLength(2, 'Bride name must be at least 2 characters'),
	),
});

/**
 * Wedding details update schema
 * For updating wedding date, venue, and budget
 */
export const weddingDetailsSchema = v.object({
	weddingDate: v.pipe(v.string(), v.nonEmpty('Wedding date is required')),
	weddingVenue: v.pipe(
		v.string(),
		v.nonEmpty('Wedding venue is required'),
		v.minLength(2, 'Venue must be at least 2 characters'),
	),
	weddingBudget: v.optional(
		v.pipe(
			v.string(),
			v.regex(/^\d+(\.\d{1,2})?$/, 'Budget must be a valid number with up to 2 decimal places'),
		),
	),
});

export const inviteSchema = v.object({
	partnerEmail: v.pipe(v.string(), v.email('Please enter a valid email')),
});

/**
 * Inferred TypeScript types
 */
export type WorkspaceData = v.InferInput<typeof workspaceSchema>;
export type WorkspaceInfoData = v.InferInput<typeof workspaceInfoSchema>;
export type WeddingDetailsData = v.InferInput<typeof weddingDetailsSchema>;
