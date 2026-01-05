import { toast } from "svelte-sonner";
import {
  authToasts,
  handleAuthError,
  handleFormValidationError,
} from "$lib/utils/toasts";
import { goto } from "$app/navigation";
import type { ActionResult } from "@sveltejs/kit";

export function createAuthFormHandler(options: {
  successMessage?: string;
  successDuration?: number;
  onSuccess?: () => void;
}) {
  return {
    onResult: async ({ result }: { result: ActionResult }) => {
      console.log("Form result type:", result.type, result);

      if (result.type === "redirect") {
        await goto(result.location);
        return;
      }

      if (result.type === "success") {
        toast.success(options.successMessage || "Success!", {
          duration: options.successDuration || 2000,
        });
        options.onSuccess?.();
      } else if (result.type === "failure") {
        const error = result.data?.error;
        const errorType = result.data?.errorType;

        if (error) {
          handleSpecificError(error, errorType);
        } else {
          handleFormValidationError();
        }
      }
    },
    onError: () => {
      authToasts.error.unexpectedError();
    },
  };
}

function handleSpecificError(error: string, errorType?: string) {
  // Centralized error type mapping
  const errorMap: Record<string, () => void> = {
    // Authentication errors
    invalid_credentials: authToasts.error.invalidCredentials,
    email_not_confirmed: authToasts.error.emailNotConfirmed,
    email_not_verified: authToasts.error.emailNotConfirmed,
    rate_limit: authToasts.error.tooManyRequests,
    user_not_found: authToasts.error.userNotFound,
    email_already_exists: authToasts.error.emailAlreadyExists,
    weak_password: authToasts.error.weakPassword,
    invalid_email: authToasts.error.invalidEmail,

    // Password errors
    password_mismatch: authToasts.error.passwordMismatch,
    incorrect_password: authToasts.error.incorrectPassword,
    password_reset_failed: authToasts.error.passwordResetFailed,
    invalid_token: authToasts.error.invalidResetToken,

    // Session errors
    session_expired: authToasts.error.sessionExpired,
    unauthorized: authToasts.error.unauthorized,

    // Organization errors
    organization_not_found: authToasts.error.organizationNotFound,
    invitation_failed: authToasts.error.invitationFailed,
    invitation_not_found: authToasts.error.invitationNotFound,
    already_member: authToasts.error.alreadyMember,

    // Generic errors
    database_error: authToasts.error.databaseError,
    configuration_error: authToasts.error.configurationError,
    validation_error: authToasts.error.validationError,
    network_error: authToasts.error.networkError,
    server_error: authToasts.error.serverError,
  };

  if (errorType && errorMap[errorType]) {
    errorMap[errorType]();
    return;
  }

  // Fall back to handleAuthError for pattern matching
  handleAuthError({ message: error });
}
