import { Resend } from "resend";

import { RESEND_API_KEY } from "$env/static/private";

if (!RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY environment variable is required");
}

/**
 * Resend client instance
 * Configured with API key from environment variables
 */
export const resend = new Resend(RESEND_API_KEY);

/**
 * Send email via Resend API
 */
export async function sendResendEmail(params: {
  to: string;
  subject: string;
  body: string;
  from: string;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const { data, error } = await resend.emails.send({
      from: params.from,
      to: [params.to],
      subject: params.subject,
      html: params.body,
    });

    if (error) {
      return {
        success: false,
        error: `Resend API error: ${error.message}`,
      };
    }

    return {
      success: true,
      id: data?.id,
    };
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    return {
      success: false,
      error: `Resend send failed: ${error}`,
    };
  }
}
