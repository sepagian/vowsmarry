<script lang="ts">
	import * as Dialog from '../ui/dialog/index';
	import * as Tabs from '../ui/tabs/index';
	import { buttonVariants } from '../ui/button/index';
	import DialogRundown from '../dialog/dialog-rundown.svelte';
</script>

<div class="flex flex-col px-4">
	<div class="flex inline-flex items-center gap-4 justify-end">
		<Tabs.List class="">
			<Tabs.Trigger
				class={buttonVariants({ variant: 'default', size: 'sm' })}
				value="timeline">Timeline View</Tabs.Trigger
			>
			<Tabs.Trigger
				class={buttonVariants({ variant: 'outline', size: 'sm' })}
				value="schedule">Schedule View</Tabs.Trigger
			>
		</Tabs.List>
		<Dialog.Root>
			<Dialog.Trigger class={buttonVariants({ variant: 'outline', size: 'default' })}>
				<div class="i-lucide:plus p-2"></div>
				<span class="hidden lg:inline">Add Event</span>
			</Dialog.Trigger>
			<DialogRundown />
		</Dialog.Root>
	</div>
</div>

<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
	}
</style>
