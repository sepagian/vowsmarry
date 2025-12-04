<script lang="ts">
	import ProfileSection from '$lib/components/settings/account/profile/profile-section.svelte';
	import PasswordSection from '$lib/components/settings/account/profile/password-section.svelte';
	import TwofaSection from '$lib/components/settings/account/profile/twofa-section.svelte';
	import ActiveSection from '$lib/components/settings/account/profile/active-section.svelte';
</script>

<div class="flex flex-col gap-4">
	<ProfileSection />
	<PasswordSection />
	<TwofaSection />
	<ActiveSection />
</div>
