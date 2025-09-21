<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index';
	import SectionRundown from '$lib/components/section/section-rundown.svelte';
</script>

<div class="flex flex-1 flex-col gap-4 py-4 max-w-screen-xl mx-auto">
	<Tabs.Root value="timeline">
		<SectionRundown />
		<Tabs.Content value="timeline">This is Timeline view</Tabs.Content>
		<Tabs.Content value="schedule">This is Schedule view</Tabs.Content>
	</Tabs.Root>
</div>
