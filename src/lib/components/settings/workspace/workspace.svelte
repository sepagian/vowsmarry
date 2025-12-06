<script lang="ts">
	import { Button } from '$lib/components/ui/button/';
	import { Separator } from '$lib/components/ui/separator';
	import WorkspaceInfoSection from '$lib/components/settings/workspace/workspace/workspace-info-section.svelte';
	import WeddingSection from './workspace/wedding-section.svelte';
	import LocaleSection from './workspace/locale-section.svelte';
	import NotificationSection from './workspace/notification-section.svelte';
	import DangerSection from './workspace/danger-section.svelte';

	function handleSaveAll() {
		// Trigger form submissions by dispatching submit events
		const forms = document.querySelectorAll(
			'form[action*="updateWorkspaceInfo"], form[action*="updateWeddingDetails"]',
		);
		forms.forEach((form) => {
			if (form instanceof HTMLFormElement) {
				form.requestSubmit();
			}
		});
	}
</script>

<div class="flex flex-col gap-4">
	<WorkspaceInfoSection />
	<WeddingSection />
	<LocaleSection />
	<NotificationSection />
	<DangerSection />
	<Separator />
	<div class="flex justify-between items-center">
		<span class="text-sm text-muted-foreground"
			>You can refine these anytime as your plans take shape.</span
		>
		<Button onclick={handleSaveAll}>Save Changes</Button>
	</div>
</div>
