import type { EmailParams } from "./index";

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
 * and open redirect vulnerabilities. Only allows http://, https://, and mailto: protocols.
 * For http/https URLs, validates against a trusted origin to prevent open redirects.
 */
function sanitizeUrl(url: string, trustedOrigin?: string): string {
	try {
		const parsed = new URL(url);
		// Only allow http and https protocols
		if (!["http:", "https:"].includes(parsed.protocol)) {
			return "about:blank";
		}

		// Validate against open redirects by checking against trusted origin
		if (trustedOrigin) {
			try {
				const trusted = new URL(trustedOrigin);
				if (parsed.origin !== trusted.origin) {
					return "about:blank";
				}
			} catch {
				// If trustedOrigin is invalid, reject the URL
				return "about:blank";
			}
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

/**
 * Base data for all email templates
 */
type BaseTemplateData = {
	brandName: string;
	year: number;
	supportEmail: string;
	baseUrl: string;
};

/**
 * Render email template based on type
 * Returns subject, HTML, and plain text versions
 */
export function renderTemplate(params: EmailParams): {
	subject: string;
	html: string;
	text: string;
} {
	const baseData = {
		brandName: "VowsMarry",
		year: new Date().getFullYear(),
		supportEmail: "support@vowsmarry.sepagian.xyz",
	};

	switch (params.type) {
		case "verification":
			return renderVerificationTemplate({ ...baseData, ...params });
		case "password-reset":
			return renderPasswordResetTemplate({ ...baseData, ...params });
		case "email-update":
			return renderEmailUpdateTemplate({ ...baseData, ...params });
		case "invitation":
			return renderInvitationTemplate({ ...baseData, ...params });
		default: {
			const _exhaustive: never = params;
			return _exhaustive;
		}
	}
}

/**
 * Render verification email template
 */
function renderVerificationTemplate(
	data: BaseTemplateData & {
		type: "verification";
		to: string;
		user: { name?: string; email: string };
		verificationUrl: string;
		token: string;
	}
): { subject: string; html: string; text: string } {
	const subject = "Verify your email address";
	const sanitizedUrl = sanitizeUrl(data.verificationUrl, data.baseUrl);

	const html = `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Email Verification</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
	<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
		<h1 style="color: white; margin: 0; font-size: 28px;">💍 ${escapeHtml(data.brandName)}</h1>
	</div>

	<div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
		<h2 style="color: #1f2937; margin-top: 0;">Verify Your Email Address</h2>

		<p style="font-size: 16px; color: #4b5563;">
			Welcome to ${escapeHtml(data.brandName)}! Please verify your email address to complete your registration and start planning your wedding.
		</p>

		<div style="text-align: center; margin: 30px 0;">
			<a href="${sanitizedUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
				Verify Email Address
			</a>
		</div>

		<p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
			Or copy and paste this link into your browser:
		</p>
		<p style="font-size: 14px; color: #667eea; word-break: break-all;">
			${escapeHtml(sanitizedUrl)}
		</p>

		<p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
			This verification link will expire in 24 hours.
		</p>

		<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

		<p style="font-size: 12px; color: #9ca3af; margin: 0;">
			If you didn't create this account, you can safely ignore this email.
		</p>
	</div>

	<div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
		<p style="margin: 0;">© ${data.year} ${escapeHtml(data.brandName)}. All rights reserved.</p>
	</div>
</body>
</html>
	`.trim();

	const plainText = `
Verify Your Email Address

Welcome to ${data.brandName}! Please verify your email address to complete your registration and start planning your wedding.

Verify your email by visiting:
${data.verificationUrl}

This verification link will expire in 24 hours.

If you didn't create this account, you can safely ignore this email.

© ${data.year} ${data.brandName}. All rights reserved.
	`.trim();

	return { subject, html, text: plainText };
}

/**
 * Render password reset email template
 */
function renderPasswordResetTemplate(
	data: BaseTemplateData & {
		type: "password-reset";
		to: string;
		user: { name?: string; email: string };
		resetUrl: string;
		token: string;
	}
): { subject: string; html: string; text: string } {
	const subject = "Reset your password";
	const sanitizedUrl = sanitizeUrl(data.resetUrl, data.baseUrl);

	const html = `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Password Reset</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
	<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
		<h1 style="color: white; margin: 0; font-size: 28px;">💍 ${escapeHtml(data.brandName)}</h1>
	</div>

	<div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
		<h2 style="color: #1f2937; margin-top: 0;">Reset Your Password</h2>

		<p style="font-size: 16px; color: #4b5563;">
			We received a request to reset your password. Click the button below to create a new password.
		</p>

		<div style="text-align: center; margin: 30px 0;">
			<a href="${sanitizedUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
				Reset Password
			</a>
		</div>

		<p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
			Or copy and paste this link into your browser:
		</p>
		<p style="font-size: 14px; color: #667eea; word-break: break-all;">
			${escapeHtml(sanitizedUrl)}
		</p>

		<p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
			This password reset link will expire in 1 hour.
		</p>

		<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

		<p style="font-size: 12px; color: #9ca3af; margin: 0;">
			If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
		</p>
	</div>

	<div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
		<p style="margin: 0;">© ${data.year} ${escapeHtml(data.brandName)}. All rights reserved.</p>
	</div>
</body>
</html>
	`.trim();

	const plainText = `
Reset Your Password

We received a request to reset your password. Click the link below to create a new password.

Reset your password by visiting:
${data.resetUrl}

This password reset link will expire in 1 hour.

If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.

© ${data.year} ${data.brandName}. All rights reserved.
	`.trim();

	return { subject, html, text: plainText };
}

/**
 * Render email update confirmation template
 */
function renderEmailUpdateTemplate(
	data: BaseTemplateData & {
		type: "email-update";
		to: string;
		user: { name?: string; email: string };
		newEmail: string;
		confirmUrl: string;
		token: string;
	}
): { subject: string; html: string; text: string } {
	const subject = "Confirm your new email address";
	const sanitizedUrl = sanitizeUrl(data.confirmUrl, data.baseUrl);
	const escapedNewEmail = escapeHtml(data.newEmail);

	const html = `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Email Update Confirmation</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
	<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
		<h1 style="color: white; margin: 0; font-size: 28px;">💍 ${escapeHtml(data.brandName)}</h1>
	</div>

	<div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
		<h2 style="color: #1f2937; margin-top: 0;">Confirm Your New Email Address</h2>

		<p style="font-size: 16px; color: #4b5563;">
			You requested to change your email address to <strong>${escapedNewEmail}</strong>. Click the button below to confirm this change.
		</p>

		<div style="text-align: center; margin: 30px 0;">
			<a href="${sanitizedUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
				Confirm Email Change
			</a>
		</div>

		<p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
			Or copy and paste this link into your browser:
		</p>
		<p style="font-size: 14px; color: #667eea; word-break: break-all;">
			${escapeHtml(sanitizedUrl)}
		</p>

		<p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
			This confirmation link will expire in 24 hours.
		</p>

		<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

		<p style="font-size: 12px; color: #9ca3af; margin: 0;">
			If you didn't request this change, you can safely ignore this email. Your email address will not be changed.
		</p>
	</div>

	<div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
		<p style="margin: 0;">© ${data.year} ${escapeHtml(data.brandName)}. All rights reserved.</p>
	</div>
</body>
</html>
	`.trim();

	const plainText = `
Confirm Your New Email Address

You requested to change your email address to ${data.newEmail}. Click the link below to confirm this change.

Confirm your email change by visiting:
${data.confirmUrl}

This confirmation link will expire in 24 hours.

If you didn't request this change, you can safely ignore this email. Your email address will not be changed.

© ${data.year} ${data.brandName}. All rights reserved.
	`.trim();

	return { subject, html, text: plainText };
}

/**
 * Render invitation email template
 */
function renderInvitationTemplate(
	data: BaseTemplateData & {
		type: "invitation";
		to: string;
		inviterName: string;
		organizationName: string;
		invitationUrl: string;
		invitationId: string;
	}
): { subject: string; html: string; text: string } {
	const escapedInviterName = escapeHtml(data.inviterName);
	const escapedOrgName = escapeHtml(data.organizationName);
	const sanitizedUrl = sanitizeUrl(data.invitationUrl, data.baseUrl);
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
		<h1 style="color: white; margin: 0; font-size: 28px;">💍 ${escapeHtml(data.brandName)}</h1>
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
			This invitation was sent to ${escapeHtml(data.to)}. If you didn't expect this invitation, you can safely ignore this email.
		</p>
	</div>

	<div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
		<p style="margin: 0;">© ${data.year} ${escapeHtml(data.brandName)}. All rights reserved.</p>
	</div>
</body>
</html>
	`.trim();

	const plainText = `
You're Invited to ${data.organizationName}!

${data.inviterName} has invited you to collaborate on their wedding planning workspace.

Join them to plan tasks, manage budgets, coordinate vendors, and organize every detail of the big day together.

Accept your invitation by visiting:
${data.invitationUrl}

This invitation was sent to ${data.to}. If you didn't expect this invitation, you can safely ignore this email.

© ${data.year} ${data.brandName}. All rights reserved.
	`.trim();

	return { subject, html, text: plainText };
}
