import { PLUNK_SECRET_KEY } from "$env/static/private";

/**
 * Send email via Plunk API
 * Uses Bearer token authentication with the new Plunk API endpoint
 */
export async function sendPlunkEmail(params: {
  to: string;
  subject: string;
  body: string;
  from: string;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!PLUNK_SECRET_KEY) {
    return {
      success: false,
      error: "PLUNK_SECRET_KEY environment variable is required",
    };
  }
  const response = await fetch("https://api.useplunk.com/v1/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PLUNK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: params.to,
      subject: params.subject,
      body: params.body,
      from: params.from,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return {
      success: false,
      error: `Plunk API error: ${response.status} - ${error}`,
    };
  }

  const data = (await response.json()) as { id?: string; error?: string };
  return {
    success: true,
    id: data.id,
  };
}
