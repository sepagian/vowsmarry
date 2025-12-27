<script lang="ts">
	import Billing from '$lib/components/settings/account/billing.svelte';
	import Privacy from '$lib/components/settings/account/privacy.svelte';
	import Profile from '$lib/components/settings/account/profile.svelte';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs/index';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let triggers = [
		{ value: 'profile_security', title: 'Profile & Security', component: Profile },
		{ value: 'billing', title: 'Billing', component: Billing },
		{ value: 'data_privacy', title: 'Data & Privacy', component: Privacy },
	];
</script>

<h1 class="font-bold text-2xl">Account Settings</h1>

<Tabs value={triggers[0].value}>
	<TabsList class="w-full">
		{#each triggers as trigger (trigger.title)}
			<TabsTrigger value={trigger.value}>{trigger.title}</TabsTrigger>
		{/each}
	</TabsList>
	<TabsContent value="profile_security">
		<Profile
			user={data.user}
			activeSessions={data.activeSessions}
			profileForm={data.profileForm}
			passwordForm={data.passwordForm}
		/>
	</TabsContent>
	<TabsContent value="billing">
		<Billing />
	</TabsContent>
	<TabsContent value="data_privacy">
		<Privacy />
	</TabsContent>
</Tabs>
