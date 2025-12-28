import type { RequestEvent } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import type { User } from "better-auth/types";
import type { Kysely } from "kysely";
import type { AuthContext, Wedding } from "./auth-types";
import { createAppError, ErrorCodes } from "./error-utils";
import { isValidUser } from "./auth-utils";
import type { Database } from "./db/schema/types";

/**
 * Authentication Helper Functions
 *
 * This module provides utility functions for working with Better Auth authentication
 * in SvelteKit server-side code. These helpers simplify common authentication patterns
 * and ensure consistent error handling across the application.
 */

/**
 * Retrieves the authenticated user from Better Auth locals
 *
 * This function validates that a user is authenticated by checking if the user
 * object exists in event.locals. Better Auth automatically populates event.locals.user
 * when a valid session exists. If the user is not authenticated, this function
 * throws a 401 Unauthorized error.
 *
 * Use this function in load functions and API endpoints to ensure authentication
 * before processing requests.
 *
 * @param user - Better Auth user from event.locals.user
 * @returns Authenticated user object
 * @throws {error(401)} if user is not authenticated (null or undefined)
 *
 * @example
 * ```typescript
 * // In a load function
 * export const load = async ({ locals }) => {
 *   const user = await getUser(locals.user);
 *   // user is guaranteed to exist here
 *   return { user };
 * };
 * ```
 */
export async function getUser(user: User | null): Promise<User> {
  if (!user || !isValidUser(user)) {
    throw error(
      401,
      createAppError(401, "Authentication required", ErrorCodes.AUTH_REQUIRED),
    );
  }
  return user;
}

/**
 * Verifies that a user is a member of a workspace
 *
 * This function performs a critical security check to ensure that the authenticated user
 * actually has membership in the workspace they're trying to access. This prevents
 * unauthorized access if a user attempts to tamper with the activeOrganizationId in
 * their session.
 *
 * The check is performed against the database to ensure it reflects the actual
 * authorization state, not session data which could be manipulated.
 *
 * @param userId - The ID of the user to verify
 * @param organizationId - The ID of the workspace/organization to check
 * @param db - Database instance for querying membership
 * @returns true if user is a member, false otherwise
 * @throws {error(403)} if user is not a member of the organization
 *
 * @example
 * ```typescript
 * await verifyWorkspaceMembership(user.id, organizationId, plannerDb);
 * // Throws 403 if user is not a member
 * // Returns true if user is a member
 * ```
 */
export async function verifyWorkspaceMembership(
  userId: string,
  organizationId: string,
  db: Kysely<Database>,
): Promise<boolean> {
  try {
    const membership = await db
      .selectFrom("member")
      .select("id")
      .where("member.userId", "=", userId)
      .where("member.organizationId", "=", organizationId)
      .executeTakeFirst();

    if (!membership) {
      throw error(
        403,
        createAppError(
          403,
          "You do not have access to this workspace",
          ErrorCodes.FORBIDDEN,
        ),
      );
    }

    return true;
  } catch (err) {
    // If it's already an HTTP error, re-throw it
    if (err instanceof Error && "status" in err) {
      throw err;
    }

    // Otherwise, it's a database error
    console.error("Failed to verify workspace membership:", err);
    throw error(
      500,
      createAppError(
        500,
        "Failed to verify workspace access",
        ErrorCodes.DATABASE_ERROR,
      ),
    );
  }
}

/**
 * Higher-order function that wraps SvelteKit actions with authentication and authorization
 *
 * This function provides a convenient way to protect form actions and ensure that:
 * 1. The user is authenticated (has a valid session)
 * 2. The user is a member of the active workspace
 * 3. The database connection is available
 *
 * The wrapped handler receives an AuthContext object containing the authenticated user,
 * their workspace data, and the database instance. This eliminates boilerplate code
 * for checking authentication and verifying workspace membership in every action.
 *
 * Security:
 * - Verifies user membership in workspace against database (not just session)
 * - Prevents access if activeOrganizationId has been tampered with
 * - Throws 403 Forbidden if user is not a member
 *
 * Error Handling:
 * - Throws 401 if user is not authenticated
 * - Throws 404 if no active workspace is selected
 * - Throws 403 if user is not a member of the workspace
 * - Throws 500 if database is unavailable
 *
 * @param handler - Action handler function that receives AuthContext and event
 * @returns SvelteKit action function
 *
 * @example
 * ```typescript
 * // In +page.server.ts
 * export const actions = {
 *   createTask: withAuth(async ({ user, organizationId, plannerDb }, { request }) => {
 *     // user membership is verified before this runs
 *     const formData = await request.formData();
 *     const title = formData.get('title') as string;
 *
 *     await plannerDb
 *       .insertInto('tasks')
 *       .values({
 *         organizationId,
 *         title,
 *         userId: user.id,
 *       })
 *       .execute();
 *
 *     return { success: true };
 *   }),
 * };
 * ```
 */
export function withAuth<T>(
  handler: (context: AuthContext, event: { request: Request }) => Promise<T>,
) {
  return async ({ request, locals, plannerDb }: RequestEvent) => {
    // Ensure database is available
    if (!plannerDb) {
      throw error(
        500,
        createAppError(500, "Database error", ErrorCodes.DATABASE_ERROR),
      );
    }

    // Validate user is authenticated (throws 401 if not)
    const user = await getUser(locals.user);

    // Ensure user has an active organization/workspace
    const organizationId = locals.activeWorkspaceId;
    if (!organizationId) {
      throw error(
        404,
        createAppError(
          404,
          "No active workspace found. Please select or create a workspace.",
          ErrorCodes.WEDDING_NOT_FOUND,
        ),
      );
    }

    // Verify user is actually a member of the workspace (critical security check)
    await verifyWorkspaceMembership(user.id, organizationId, plannerDb);

    // Call the wrapped handler with guaranteed AuthContext
    // Note: wedding is deprecated, use organizationId instead
    return handler(
      {
        user,
        wedding: { id: organizationId } as Wedding,
        organizationId,
        plannerDb,
      },
      { request },
    );
  };
}
