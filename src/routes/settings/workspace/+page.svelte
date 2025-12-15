<script lang="ts">
	import Integration from '$lib/components/settings/workspace/integration.svelte';
	import Team from '$lib/components/settings/workspace/team.svelte';
	import Workspace from '$lib/components/settings/workspace/workspace.svelte';
	import { ConfirmDeleteDialog } from '$lib/components/ui/confirm-delete-dialog';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs/index';

	let triggers = [
		{ value: 'workspace', title: 'Workspace', component: Workspace },
		{ value: 'team_roles', title: 'Team & Roles', component: Team },
		{ value: 'integration', title: 'Integration', component: Integration },
	];
</script>

<ConfirmDeleteDialog />

<h1 class="font-bold text-2xl">Workspace Settings</h1>

<Tabs value={triggers[0].value}>
	<TabsList class="w-full">
		{#each triggers as trigger (trigger.title)}
			<TabsTrigger value={trigger.value}>{trigger.title}</TabsTrigger>
		{/each}
	</TabsList>
	{#each triggers as trigger (trigger.title)}
		<TabsContent value={trigger.value}>
			{#if trigger.component}
				<svelte:component this={trigger.component} />
			{/if}
		</TabsContent>
	{/each}
</Tabs>
