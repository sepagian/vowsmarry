<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index';
	import Workspace from '$lib/components/settings/workspace/workspace.svelte';
	import Team from '$lib/components/settings/workspace/team.svelte';
	import Integration from '$lib/components/settings/workspace/integration.svelte';

	let triggers = [
		{ value: 'workspace', title: 'Workspace', component: Workspace },
		{ value: 'team_roles', title: 'Team & Roles', component: Team },
		{ value: 'integration', title: 'Integration', component: Integration },
	];
</script>

<h1 class="font-bold text-2xl">Workspace Settings</h1>

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
			{/if}
		</Tabs.Content>
	{/each}
</Tabs.Root>
