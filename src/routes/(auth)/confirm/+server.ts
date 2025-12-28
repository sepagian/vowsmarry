import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { createSecureLogger } from "$lib/server/logging";

const logger = createSecureLogger("EmailConfirm");

export const GET: RequestHandler = async ({ url }) => {
  const token = url.searchParams.get("token");
  const type = url.searchParams.get("type");

  if (!token) {
    throw redirect(
      303,
      "/error?type=invalid_verification_link&message=Invalid or missing verification token",
    );
  }

  // TODO: Implement Better Auth email verification
  // Better Auth requires configuring sendVerificationEmail in auth.ts
  // See: https://www.better-auth.com/docs/authentication/email
  //
  // For now, redirect to error page
  logger.debug("Email verification requested", { type });

  throw redirect(
    303,
    "/error?type=not_implemented&message=Email verification is not yet configured. Please contact support.",
  );

  // Once configured, the implementation should be:
  // 1. Call Better Auth's /verify-email endpoint with the token
  // 2. Handle success/error responses
  // 3. Redirect to appropriate page with success message
};
