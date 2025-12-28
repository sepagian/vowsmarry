import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import { loginSchema } from "$lib/validation/auth";
import { getAuth } from "$lib/server/auth";
import { createSecureLogger } from "$lib/server/logging";
import type { Actions, PageServerLoad } from "./$types";

const logger = createSecureLogger("LoginAction");

export const load: PageServerLoad = async ({ locals: { user }, url }) => {
  if (user) {
    redirect(302, "/dashboard");
  }

  const loginForm = await superValidate(valibot(loginSchema));
  const message = url.searchParams.get("message");
  const messageType = url.searchParams.get("messageType");
  const error = url.searchParams.get("error");
  const errorType = url.searchParams.get("errorType");

  return {
    loginForm,
    message,
    messageType,
    error,
    errorType,
  };
};

export const actions: Actions = {
  default: async ({ request, platform, plannerDb }) => {
    if (!platform?.env?.vowsmarry) {
      return fail(500, {
        error: "Database configuration error",
      });
    }

    const auth = getAuth(platform.env.vowsmarry);
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return fail(400, {
        error: "Email and password are required",
        email,
      });
    }

    try {
      // Use Better Auth to sign in
      const result = await auth.api.signInEmail({
        body: {
          email,
          password,
        },
      });

      logger.debug("Sign in attempt completed");

      // Check if sign in was successful
      if (!result || !result.user) {
        return fail(400, {
          error: "Authentication failed. Please try again.",
          errorType: "auth_error",
          email,
        });
      }

      // After successful login, check if user has any workspaces
      // If they do, automatically set the most recently created one as active
      // This prevents the user from being redirected to onboarding after every login
      try {
        // Query the database directly to get user's organizations
        const userOrganizations = await plannerDb
          .selectFrom("member")
          .innerJoin("organization", "organization.id", "member.organizationId")
          .select([
            "organization.id",
            "organization.name",
            "organization.slug",
            "organization.createdAt",
          ])
          .where("member.userId", "=", result.user.id)
          .orderBy("organization.createdAt", "desc")
          .execute();

        if (userOrganizations && userOrganizations.length > 0) {
          // Get the most recent organization
          const mostRecentOrg = userOrganizations[0];

          // Update the session in the database AND invalidate the cookie cache
          // by updating both the activeOrganizationId and the updatedAt timestamp
          await plannerDb
            .updateTable("session")
            .set({
              activeOrganizationId: mostRecentOrg.id,
              updatedAt: Date.now(),
            })
            .where("token", "=", result.token)
            .execute();

          logger.debug("Active workspace set", {
            workspaceId: mostRecentOrg.id,
          });

          // Now call setActiveOrganization with the new session to update the cookie
          // Create a new Headers object with the session cookie
          const cookieHeader = `vowsmarry_auth.session_token=${result.token}`;
          const newHeaders = new Headers(request.headers);
          newHeaders.set("cookie", cookieHeader);

          await auth.api.setActiveOrganization({
            body: {
              organizationId: mostRecentOrg.id,
            },
            headers: newHeaders,
          });

          logger.debug("Cookie cache updated with active workspace");
        } else {
          logger.debug("No workspaces found for user");
        }
      } catch (workspaceError) {
        // Don't fail login if workspace setting fails
        console.error("Failed to set active workspace:", workspaceError);
      }

      logger.debug("Redirecting to dashboard");
    } catch (error: unknown) {
      logger.error("Login authentication failed", error);

      // Handle specific authentication errors from Better Auth
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null && "message" in error
            ? String((error as { message: unknown }).message)
            : "";

      if (
        errorMessage.includes("Invalid") ||
        errorMessage.includes("credentials")
      ) {
        return fail(400, {
          error:
            "Invalid email or password. Please check your credentials and try again.",
          errorType: "invalid_credentials",
          email,
        });
      } else if (
        errorMessage.includes("not verified") ||
        errorMessage.includes("Email not confirmed")
      ) {
        return fail(400, {
          error:
            "Please check your email and click the verification link before signing in.",
          errorType: "email_not_confirmed",
          email,
        });
      } else if (
        errorMessage.includes("Too many") ||
        errorMessage.includes("rate limit")
      ) {
        return fail(429, {
          error:
            "Too many login attempts. Please wait a moment before trying again.",
          errorType: "rate_limit",
          email,
        });
      } else {
        // Generic error message for other authentication issues
        return fail(400, {
          error: errorMessage || "Authentication failed. Please try again.",
          errorType: "auth_error",
          email,
        });
      }
    }

    // Redirect to dashboard on success (outside try-catch to avoid catching redirect)
    throw redirect(303, "/dashboard");
  },
};
