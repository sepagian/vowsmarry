/**
 * SvelteKit Server Hooks
 *
 * Hook Execution Order:
 * 1. database - Initialize Kysely database instances from Cloudflare D1 binding
 * 2. betterAuth - Process Better Auth requests and populate event.locals with session/user
 * 3. authGuard - Enforce route protection rules and handle redirects
 */

import { type Handle, redirect } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { getDb } from "$lib/server/db";
import { getAuth } from "$lib/server/auth";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from "$app/environment";
import { createAppError, ErrorCodes } from "$lib/server/error-utils";
import { RouteMatcher } from "$lib/server/route-matcher";
import { ROUTES } from "$lib/constants/routes";

const database: Handle = async ({ event, resolve }) => {
  if (!event.platform?.env?.vowsmarry) {
    if (building) {
      // @ts-expect-error - Mock for build time only
      event.plannerDb = null;
      // @ts-expect-error - Mock for build time only
      event.invitationDb = null;
      return await resolve(event);
    }
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

  return await resolve(event);
};

const betterAuth: Handle = async ({ event, resolve }) => {
  const { pathname } = event.url;
  const isGetAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password";

  // Skip auth for public auth pages (GET only) to reduce CPU time
  if (isGetAuthPage && event.request.method === "GET") {
    return await resolve(event);
  }

  if (!event.platform?.env?.vowsmarry) {
    if (building) {
      return await resolve(event);
    }
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

  try {
    const session = await auth.api.getSession({
      headers: event.request.headers,
    });

    if (session) {
      event.locals.session = session.session;
      event.locals.user = session.user;

      const orgId = (session.session as { activeOrganizationId?: string })
        .activeOrganizationId;

      if (orgId) {
        event.locals.activeWorkspaceId = orgId;
      } else if (event.plannerDb) {
        const org = await event.plannerDb
          .selectFrom("member")
          .innerJoin("organization", "organization.id", "member.organizationId")
          .select("organization.id")
          .where("member.userId", "=", session.user.id)
          .orderBy("organization.createdAt", "desc")
          .executeTakeFirst();

        event.locals.activeWorkspaceId = org?.id ?? null;
      } else {
        event.locals.activeWorkspaceId = null;
      }
    } else {
      event.locals.session = null;
      event.locals.user = null;
      event.locals.activeWorkspaceId = null;
    }
  } catch {
    event.locals.session = null;
    event.locals.user = null;
    event.locals.activeWorkspaceId = null;
  }

  return svelteKitHandler({ event, resolve, auth, building });
};

const authGuard: Handle = async ({ event, resolve }) => {
  const { pathname } = event.url;

  if (RouteMatcher.isPublicAsset(pathname)) {
    return await resolve(event);
  }

  const { session, user, activeWorkspaceId } = event.locals;
  const isAuthenticated = !!(session && user);
  const hasWorkspace = !!activeWorkspaceId;

  if (!isAuthenticated && RouteMatcher.isProtectedRoute(pathname)) {
    redirect(303, ROUTES.PUBLIC.LOGIN);
  }

  if (isAuthenticated && RouteMatcher.isAuthPage(pathname)) {
    const destination = hasWorkspace
      ? ROUTES.PROTECTED.DASHBOARD
      : ROUTES.PROTECTED.ONBOARDING;
    redirect(303, destination);
  }

  if (
    isAuthenticated &&
    hasWorkspace === false &&
    RouteMatcher.requiresWorkspace(pathname) &&
    pathname !== ROUTES.PROTECTED.ONBOARDING
  ) {
    redirect(303, ROUTES.PROTECTED.ONBOARDING);
  }

  return await resolve(event);
};

export const handle: Handle = sequence(database, betterAuth, authGuard);
