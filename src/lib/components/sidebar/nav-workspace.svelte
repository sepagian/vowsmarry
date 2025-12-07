<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import type { Organization } from '../../../app.d';
	
	let {
		workspace,
	}: {
		workspace: Organization | null;
	} = $props();
	
	const sidebar = useSidebar();
	
	// Format workspace display name from couple names or fallback to workspace name
	const workspaceName = $derived(() => {
		if (!workspace) return 'No Workspace';
		
		const groomName = workspace.groomName;
		const brideName = workspace.brideName;
		
		if (groomName && brideName) {
			return `${groomName} & ${brideName}`;
		}
		
		return workspace.name;
	});
	
	// Format wedding date for display
	const weddingInfo = $derived(() => {
		if (!workspace?.weddingDate) return 'Wedding Planning';
		
		const date = new Date(workspace.weddingDate);
		const year = date.getFullYear();
		const month = date.toLocaleDateString('en-US', { month: 'short' });
		
		return `${month} ${year}`;
	});
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		{#if workspace}
			<Sidebar.MenuButton
				size="lg"
				class="cursor-default hover:bg-transparent"
			>
				<div
					class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
				>
					<div class="i-lucide:heart"></div>
				</div>
				<div class="grid flex-1 text-start text-sm leading-tight">
					<span class="truncate font-medium">
						{workspaceName()}
					</span>
					<span class="truncate text-xs text-muted-foreground">{weddingInfo()}</span>
				</div>
			</Sidebar.MenuButton>
		{:else}
			<Sidebar.MenuButton
				size="lg"
				class="cursor-default hover:bg-transparent"
			>
				<div
					class="bg-muted text-muted-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
				>
					<div class="i-lucide:alert-circle size-4"></div>
				</div>
				<div class="grid flex-1 text-start text-sm leading-tight">
					<span class="truncate font-medium text-muted-foreground">
						No Workspace
					</span>
					<span class="truncate text-xs text-muted-foreground">Create one to start</span>
				</div>
			</Sidebar.MenuButton>
		{/if}
	</Sidebar.MenuItem>
</Sidebar.Menu>
