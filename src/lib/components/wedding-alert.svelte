<script lang="ts">
	import * as Card from '$lib/components/ui/card/index';
	import * as Dialog from '$lib/components/ui/dialog/index';
	import { buttonVariants } from '$lib/components/ui/button/index';
	import DialogWedding from '$lib/components/dialog/dialog-wedding.svelte';

	let { data } = $props();
	let open = $state(false);
</script>

<div class="flex flex-col px-4 gap-4">
	<div class="flex flex-col gap-4">
		{#if !data.wedding}
			<Card.Root
				class="@container/card flex flex-row justify-between items-center shadow-none border-blue-400 bg-blue-200"
			>
				<div class="w-full">
					<Card.Header>
						<Card.Title class="leading-6 text-base text-blue-800"
							>Almost ready to plan your big day 🎉</Card.Title
						>
					</Card.Header>
					<Card.Content class="text-sm text-blue-700">
						<p>Complete your wedding profile to see tasks, invitations, and more.</p>
					</Card.Content>
				</div>
				<div class="w-fit justify-end flex px-6">
					<Dialog.Root>
						<Dialog.Trigger
							class="{buttonVariants({
								variant: 'outline',
								size: 'default',
							})} self-center bg-blue-300 hover:bg-blue-400 border-blue-400"
						>
							<div class="i-lucide:chevron-right"></div>
						</Dialog.Trigger>
						<DialogWedding
							{data}
							bind:open
						/>
					</Dialog.Root>
				</div>
			</Card.Root>
		{/if}
	</div>
</div>
