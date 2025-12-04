<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index';
	import Profile from '$lib/components/settings/account/profile.svelte';
	import Billing from '$lib/components/settings/account/billing.svelte';
	import Privacy from '$lib/components/settings/account/privacy.svelte';

	let triggers = [
		{ value: 'profile_security', title: 'Profile & Security', component: Profile },
		{ value: 'billing', title: 'Billing', component: Billing },
		{ value: 'data_privacy', title: 'Data & Privacy', component: Privacy },
	];
</script>

<h1 class="font-bold text-2xl">Account Settings</h1>

<Tabs.Root value={triggers[0].value}>
	<Tabs.List class="w-full">
		{#each triggers as trigger (trigger.title)}
			<Tabs.Trigger value={trigger.value}>{trigger.title}</Tabs.Trigger>
		{/each}
	</Tabs.List>
	{#each triggers as trigger (trigger.title)}
		<Tabs.Content value={trigger.value}>
			{#if trigger.component}
				<svelte:component this={trigger.component} />
			{/if}</Tabs.Content
		>
	{/each}
</Tabs.Root>
