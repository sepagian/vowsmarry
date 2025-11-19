<script lang="ts">
	import * as Card from '$lib/components/ui/card/index';
	import * as Dialog from '$lib/components/ui/dialog/index';
	import { Button, buttonVariants } from '$lib/components/ui/button/index';
	import DialogTask from '../dialog/dialog-task.svelte';

	let { data } = $props();
</script>

<div class="flex flex-col px-4 gap-4">
	<div class="flex flex-col gap-4">
		<Card.Root class="@container/card flex flex-row justify-between items-center shadow-none">
			<div class="w-full">
				<Card.Header>
					<Card.Title class="leading-6 text-base">Almost ready to plan your big day 🎉</Card.Title>
				</Card.Header>
				<Card.Content class="text-sm">
					<p>Complete your wedding profile to see tasks, invitations, and more.</p>
				</Card.Content>
			</div>
			<div class="w-fit justify-end flex px-6">
				<Button
					variant="outline"
					size="icon"
				>
					<div class="i-lucide:chevron-right"></div>
				</Button>
			</div>
		</Card.Root>
	</div>
</div>
