/**
 * SvelteKit Server Hooks
 *
 * This file defines the server-side request lifecycle hooks for the VowsMarry application.
 * Hooks are executed in sequence for every request, allowing us to:
 * 1. Initialize database connections
 * 2. Process authentication
 * 3. Protect routes based on authentication status
 *
 * Hook Execution Order:
 * 1. database - Initialize Kysely database instances from Cloudflare D1 binding
 * 2. betterAuth - Process Better Auth requests and populate event.locals with session/user
 * 3. authGuard - Enforce route protection rules and handle redirects
 *
 * This order is critical: database must be initialized before auth (which needs DB access),
 * and auth must be processed before the guard (which checks auth status).
 */

import { type Handle, redirect } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { getDb } from "$lib/server/db";
import { getAuth } from "$lib/server/auth";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { building, dev } from "$app/environment";
import { createAppError, ErrorCodes } from "$lib/server/error-utils";
import { RouteMatcher } from "$lib/server/route-matcher";
import { ROUTES } from "$lib/constants/routes";
import { createSecureLogger } from "$lib/server/logging";

const logger = createSecureLogger("Hooks");

/**
 * Database Hook
 *
 * Initializes Kysely database instances from Cloudflare D1 binding.
 * This hook runs first to ensure database access is available for subsequent hooks.
 *
 * The database binding is provided by Cloudflare Workers/Pages and is configured
 * in wrangler.toml. In development, Wrangler provides a local D1 instance.
 *
 * Sets:
 * - event.plannerDb - Database instance for wedding planning data
 * - event.invitationDb - Database instance for invitation data (currently same as plannerDb)
 *
 * Error Handling:
 * - During build: Silently continues (database not needed for static generation)
 * - During runtime: Throws 500 error if database binding is not available
 */
const database: Handle = async ({ event, resolve }) => {
  if (!event.platform?.env?.vowsmarry) {
    if (building) {
      // During build, create mock instances to prevent undefined errors
      // @ts-expect-error - Mock for build time only
      event.plannerDb = null;
      // @ts-expect-error - Mock for build time only
      event.invitationDb = null;
      return resolve(event);
    }
    logger.error("Database binding not available");
    throw error(
      500,
      createAppError(
        500,
        "Database configuration error",
        ErrorCodes.DATABASE_ERROR,
      ),
    );
  }

  const db = getDb(event.platform.env.vowsmarry);
  event.plannerDb = db;
  event.invitationDb = db;

  return resolve(event);
};

/**
 * Better Auth Hook
 *
 * Processes Better Auth authentication for every request.
 * This hook uses Better Auth's SvelteKit handler to:
 * 1. Handle auth API endpoints (/api/auth/*)
 * 2. Read and validate session cookies
 * 3. Query the database for session and user data
 * 4. Populate event.locals with session and user objects
 * 5. Load active workspace if set in session
 *
 * After this hook executes:
 * - event.locals.session contains the session object (or null if not authenticated)
 * - event.locals.user contains the user object (or null if not authenticated)
 * - event.locals.activeWorkspaceId contains the active workspace ID (or null)
 * - event.locals.activeWorkspace contains the full workspace details (or null)
 *
 * Session Validation:
 * Better Auth automatically validates sessions by:
 * - Checking if the session token exists in the database
 * - Verifying the session hasn't expired (expiresAt > now)
 * - Ensuring the session is associated with a valid user
 *
 * If validation fails, Better Auth clears the session cookie and sets locals to null.
 *
 * Active Workspace Loading:
 * If the session has an activeOrganizationId, this hook loads the full workspace
 * details from the database. This allows routes to access workspace information
 * without additional database queries.
 *
 * Development Logging:
 * In development mode, logs authentication events to help with debugging.
 */
const betterAuth: Handle = async ({ event, resolve }) => {
  // Get auth instance with D1 database from platform
  if (!event.platform?.env?.vowsmarry) {
    if (building) {
      return resolve(event);
    }
    logger.error("D1 database binding not available for auth");
    throw error(
      500,
      createAppError(
        500,
        "Authentication configuration error",
        ErrorCodes.DATABASE_ERROR,
      ),
    );
  }

  const auth = getAuth(event.platform.env.vowsmarry);

  // Fetch current session from Better Auth and populate event.locals
  try {
    const session = await auth.api.getSession({
      headers: event.request.headers,
    });

    if (session) {
      event.locals.session = session.session;
      event.locals.user = session.user;

      // Load active workspace if set in session
      if (session.session.activeOrganizationId) {
        const activeOrgId = session.session.activeOrganizationId;

        // Critical security check: Verify user is actually a member of the workspace
        // This prevents unauthorized access if session data is tampered with
        try {
          const isMember = await event.plannerDb
            ?.selectFrom("member")
            .select("id")
            .where("member.userId", "=", session.user.id)
            .where("member.organizationId", "=", activeOrgId)
            .executeTakeFirst();

          if (!isMember) {
            // User is not a member of this workspace, clear it from the session
            logger.logSecurityEvent(
              `User attempted unauthorized workspace access`,
              "medium",
              { workspaceId: activeOrgId },
            );
            event.locals.activeWorkspaceId = null;
            event.locals.activeWorkspace = null;
            // Clear the invalid activeOrganizationId from the session
            if (event.plannerDb) {
              await event.plannerDb
                .updateTable("session")
                .set({ activeOrganizationId: null })
                .where("token", "=", session.session.token)
                .execute()
                .catch((err) => {
                  logger.error(
                    "Failed to clear invalid workspace from session:",
                    err,
                  );
                });
            }
          } else {
            event.locals.activeWorkspaceId = activeOrgId;

            // Load full workspace details for use in routes
            try {
              const workspace = await auth.api.getFullOrganization({
                query: { organizationId: activeOrgId },
                headers: event.request.headers,
              });

              if (workspace) {
                // Cast to our Organization type (Better Auth returns additional fields like members and invitations)
                event.locals.activeWorkspace = {
                  id: workspace.id,
                  name: workspace.name,
                  slug: workspace.slug,
                  logo: workspace.logo ?? null,
                  metadata: workspace.metadata ?? null,
                  createdAt: workspace.createdAt,
                  // Wedding-specific fields
                  groomName: workspace.groomName ?? null,
                  brideName: workspace.brideName ?? null,
                  weddingDate: workspace.weddingDate ?? null,
                  weddingVenue: workspace.weddingVenue ?? null,
                  weddingBudget: workspace.weddingBudget ?? null,
                };
              } else {
                event.locals.activeWorkspace = null;
                await auth.api.setActiveOrganization({
                  body: { organizationId: null },
                  headers: event.request.headers,
                });
                if (dev) {
                  logger.debug(
                    "Active workspace loaded",
                    logger.extractWorkspaceInfo(workspace),
                  );
                }
              }
            } catch (workspaceError) {
              // Workspace loading failed, but user is still authenticated
              logger.error("Failed to load active workspace:", workspaceError);
              event.locals.activeWorkspace = null;
              await auth.api.setActiveOrganization({
                body: { organizationId: null },
                headers: event.request.headers,
              });
            }
          }
        } catch (membershipError) {
          logger.error(
            "Failed to verify workspace membership:",
            membershipError,
          );
          // On error, clear the workspace to be safe
          event.locals.activeWorkspaceId = null;
          event.locals.activeWorkspace = null;
        }
      } else {
        // No active workspace set
        event.locals.activeWorkspaceId = null;
        event.locals.activeWorkspace = null;
      }
    } else {
      // Not authenticated, clear workspace data
      event.locals.activeWorkspaceId = null;
      event.locals.activeWorkspace = null;
    }
  } catch (err) {
    // Session fetch failed, user is not authenticated
    if (dev) {
      logger.debug("Session fetch failed:", err);
    }
    // Ensure workspace data is cleared
    event.locals.activeWorkspaceId = null;
    event.locals.activeWorkspace = null;
  }

  const response = await svelteKitHandler({ event, resolve, auth, building });

  // Log auth events in development
  if (dev && event.locals.user) {
    const workspaceInfo = event.locals.activeWorkspace
      ? logger.extractWorkspaceInfo(event.locals.activeWorkspace)
      : {};
    logger.debug("User authenticated", {
      ...logger.extractUserInfo(event.locals.user),
      ...workspaceInfo,
    });
  }

  return response;
};

/**
 * Auth Guard Hook
 *
 * Enforces route protection rules based on authentication status and workspace access.
 * This hook runs after Better Auth has populated event.locals, so we can
 * reliably check if the user is authenticated and has an active workspace.
 *
 * Route Protection Rules:
 *
 * 1. Static Assets & Auth API (Always Allow):
 *    - /_app/* - SvelteKit app assets
 *    - /api/auth/* - Better Auth API endpoints
 *    - /robots.txt, /favicon.ico - Static files
 *
 * 2. Protected Routes (Require Authentication):
 *    - /dashboard/* - Main application dashboard (requires workspace)
 *    - /onboarding - Workspace setup (requires auth, no workspace needed)
 *    - /account - User account settings (requires auth, no workspace needed)
 *    - Redirects to /login if not authenticated
 *
 * 3. Workspace-Required Routes (Require Authentication + Active Workspace):
 *    - /dashboard/* - All dashboard routes require an active workspace
 *    - Redirects to /onboarding if authenticated but no workspace
 *
 * 4. Auth Pages (Redirect if Authenticated):
 *    - /login, /register - Authentication forms
 *    - Redirects to /dashboard if authenticated with workspace
 *    - Redirects to /onboarding if authenticated without workspace
 *    - Prevents authenticated users from seeing login/register pages
 *
 * 5. Public Routes (Always Allow):
 *    - /, /about, etc. - Public pages
 *    - Accessible without authentication
 *
 * Authentication Check:
 * A user is considered authenticated if BOTH session and user exist in event.locals.
 * This ensures that:
 * - The session cookie is valid
 * - The session exists in the database
 * - The session is not expired
 * - The user associated with the session exists
 *
 * Workspace Check:
 * A user has an active workspace if activeWorkspaceId exists in event.locals.
 * This is set by the betterAuth hook when loading the session.
 *
 * Redirect Behavior:
 * - Uses 303 status code (See Other) for POST-redirect-GET pattern
 * - Preserves request method semantics
 * - Prevents browser from re-submitting forms on back button
 */
const authGuard: Handle = async ({ event, resolve }) => {
  const { pathname } = event.url;

  // Allow public assets (CSS, JS, images, etc.)
  if (RouteMatcher.isPublicAsset(pathname)) {
    return resolve(event);
  }

  const { session, user, activeWorkspaceId } = event.locals;
  const isAuthenticated = !!(session && user);
  const hasWorkspace = !!activeWorkspaceId;

  // Redirect unauthenticated users trying to access protected routes
  if (!isAuthenticated && RouteMatcher.isProtectedRoute(pathname)) {
    redirect(303, ROUTES.PUBLIC.LOGIN);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && RouteMatcher.isAuthPage(pathname)) {
    // If user has a workspace, send them to dashboard
    // If no workspace, send them to onboarding
    const destination = hasWorkspace
      ? ROUTES.PROTECTED.DASHBOARD
      : ROUTES.PROTECTED.ONBOARDING;
    redirect(303, destination);
  }

  // Check workspace requirement for dashboard routes
  if (isAuthenticated && RouteMatcher.requiresWorkspace(pathname)) {
    // User is authenticated but has no active workspace
    // Redirect to onboarding to create/select a workspace
    if (!hasWorkspace && pathname !== ROUTES.PROTECTED.ONBOARDING) {
      redirect(303, ROUTES.PROTECTED.ONBOARDING);
    }
  }

  return resolve(event);
};

/**
 * Combined Hook Sequence
 *
 * Executes hooks in the following order:
 * 1. database - Initialize database connections
 * 2. betterAuth - Process authentication
 * 3. authGuard - Enforce route protection
 *
 * @remarks
 * This order is critical and should not be changed without careful consideration.
 * The database must be initialized before auth (which needs DB access),
 * and auth must be processed before the guard (which checks auth status).
 *
 * @see {@link database} for database initialization
 * @see {@link betterAuth} for authentication processing
 * @see {@link authGuard} for route protection
 */
export const handle: Handle = sequence(database, betterAuth, authGuard);
