<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { UserData } from '$lib/validation/planner';
	import type { InferInput } from 'valibot';
	import type { validateChangePasswordSchema } from '$lib/validation/auth';
	import { Button } from '$lib/components/ui/button/';
	import ProfileSection from '$lib/components/settings/account/profile/profile-section.svelte';
	import PasswordSection from '$lib/components/settings/account/profile/password-section.svelte';
	import TwofaSection from '$lib/components/settings/account/profile/twofa-section.svelte';
	import ActiveSection from '$lib/components/settings/account/profile/active-section.svelte';

	type PasswordData = InferInput<typeof validateChangePasswordSchema>;

	interface Props {
		user: {
			id: string;
			name: string;
			email: string;
			emailVerified: boolean;
			image: string | null;
			phone?: string | null;
			role?: string | null;
		};
		activeSessions: Array<{
			id: string;
			createdAt: Date;
			ipAddress: string | null;
			userAgent: string | null;
			expiresAt: Date;
		}>;
		profileForm: SuperValidated<UserData>;
		passwordForm: SuperValidated<PasswordData>;
	}

	let { user, activeSessions, profileForm, passwordForm }: Props = $props();

	function handleSaveAll() {
		// Trigger form submissions by dispatching submit events
		const forms = document.querySelectorAll(
			'form[action*="updateProfile"], form[action*="changePassword"]',
		);
		forms.forEach((form) => {
			if (form instanceof HTMLFormElement) {
				form.requestSubmit();
			}
		});
	}
</script>

<div class="flex flex-col gap-4">
	<ProfileSection
		{profileForm}
		{user}
	/>
	<PasswordSection {passwordForm} />
	<TwofaSection />
	<ActiveSection {activeSessions} />
	<div class="flex justify-between items-center">
		<span class="text-sm text-muted-foreground"
			>Keep your profile up to date for a personalized experience.</span
		>
		<Button onclick={handleSaveAll}>Save Changes</Button>
	</div>
</div>
