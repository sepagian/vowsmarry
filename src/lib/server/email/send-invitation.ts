import { resend, FROM_EMAIL } from './resend';
import { generateInvitationEmail } from './templates/invitation';

interface SendInvitationEmailParams {
	inviteeEmail: string;
	inviterName: string;
	organizationName: string;
	invitationId: string;
	baseUrl: string;
}

/**
 * Send invitation email via Resend
 * 
 * @throws Error if email fails to send
 */
export async function sendInvitationEmail(params: SendInvitationEmailParams): Promise<void> {
	const { subject, html, text } = generateInvitationEmail(params);

	try {
		const result = await resend.emails.send({
			from: FROM_EMAIL,
			to: params.inviteeEmail,
			subject,
			html,
			text,
		});

		if (result.error) {
			console.error('Resend API error:', result.error);
			throw new Error(`Failed to send invitation email: ${result.error.message}`);
		}

		console.log('Invitation email sent successfully:', {
			emailId: result.data?.id,
			to: params.inviteeEmail,
		});
	} catch (err) {
		console.error('Failed to send invitation email:', err);
		throw err;
	}
}
