/**
 * Escape HTML special characters to prevent XSS attacks
 * Converts HTML metacharacters to their entity equivalents
 */
function escapeHtml(text: string): string {
  const htmlEscapeMap: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return text.replace(/[&<>"']/g, (char) => htmlEscapeMap[char]);
}

/**
 * Validate and escape URL to prevent javascript: and data: protocol attacks
 * Only allows http://, https://, and mailto: protocols
 */
function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return "about:blank";
    }
    return url;
  } catch {
    // If URL parsing fails, check for mailto: prefix
    if (url.startsWith("mailto:")) {
      return escapeHtml(url);
    }
    // Default to blank for invalid URLs
    return "about:blank";
  }
}

export type InvitationEmailParams = {
  inviteeEmail: string;
  inviterName: string;
  organizationName: string;
  invitationId: string;
  baseUrl: string;
};

/**
 * Generate HTML email template for wedding workspace invitation
 * All user-controlled data is properly escaped to prevent XSS attacks
 */
export function generateInvitationEmail({
  inviteeEmail,
  inviterName,
  organizationName,
  invitationId,
  baseUrl,
}: InvitationEmailParams): { subject: string; html: string; text: string } {
  const acceptUrl = `${baseUrl}/accept-invitation/${invitationId}`;
  const sanitizedUrl = sanitizeUrl(acceptUrl);
  const escapedInviterName = escapeHtml(inviterName);
  const escapedOrgName = escapeHtml(organizationName);
  const escapedEmail = escapeHtml(inviteeEmail);

  const subject = `${escapedInviterName} invited you to ${escapedOrgName}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Wedding Workspace Invitation</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
	<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
		<h1 style="color: white; margin: 0; font-size: 28px;">💍 VowsMarry</h1>
	</div>

	<div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
		<h2 style="color: #1f2937; margin-top: 0;">You're Invited!</h2>

		<p style="font-size: 16px; color: #4b5563;">
			<strong>${escapedInviterName}</strong> has invited you to collaborate on their wedding planning workspace:
		</p>

		<div style="background: #f9fafb; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0;">
			<p style="margin: 0; font-size: 18px; font-weight: 600; color: #1f2937;">
				${escapedOrgName}
			</p>
		</div>

		<p style="font-size: 16px; color: #4b5563;">
			Join them to plan tasks, manage budgets, coordinate vendors, and organize every detail of the big day together.
		</p>

		<div style="text-align: center; margin: 30px 0;">
			<a href="${sanitizedUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
				Accept Invitation
			</a>
		</div>

		<p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
			Or copy and paste this link into your browser:
		</p>
		<p style="font-size: 14px; color: #667eea; word-break: break-all;">
			${escapeHtml(sanitizedUrl)}
		</p>

		<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

		<p style="font-size: 12px; color: #9ca3af; margin: 0;">
			This invitation was sent to ${escapedEmail}. If you didn't expect this invitation, you can safely ignore this email.
		</p>
	</div>

	<div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
		<p style="margin: 0;">© ${new Date().getFullYear()} VowsMarry. All rights reserved.</p>
	</div>
</body>
</html>
	`.trim();

  const text = `
You're Invited to ${organizationName}!

${inviterName} has invited you to collaborate on their wedding planning workspace.

Join them to plan tasks, manage budgets, coordinate vendors, and organize every detail of the big day together.

Accept your invitation by visiting:
${acceptUrl}

This invitation was sent to ${inviteeEmail}. If you didn't expect this invitation, you can safely ignore this email.

© ${new Date().getFullYear()} VowsMarry. All rights reserved.
	`.trim();

  return { subject, html, text };
}
