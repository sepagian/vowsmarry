<script lang="ts">
	import { flip } from 'svelte/animate';
	import * as Card from '$lib/components/ui/card/index';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import * as Dialog from '../ui/dialog/index';
	import { Badge } from '$lib/components/ui/badge/index';
	import { dndzone } from 'svelte-dnd-action';
	import { Button, buttonVariants } from '../ui/button/index';
	import DialogRundown from '../dialog/dialog-rundown.svelte';

	let { items } = $props();
	let dragDisabled = $state(false);
	const flipDurationMs = 300;
	const delayTouchStart = 300;

	const dropdownItem: {
		label: string;
		icon: string;
		color?: string;
	}[] = [
		{
			label: 'View',
			icon: 'i-lucide:eye',
		},
		{
			label: 'Edit',
			icon: 'i-lucide:edit',
		},
		{
			label: 'Delete',
			icon: 'i-lucide:trash2',
			color: 'hover:bg-red-100 text-red-800',
		},
	];

	function handleDndConsider(e: CustomEvent) {
		items = e.detail.items;
	}
	function handleDndFinalize(e: CustomEvent) {
		items = e.detail.items;
	}

	function toggleDrag() {
		dragDisabled = !dragDisabled;
	}

	function formatHour(dateString: number) {
		return new Date(dateString).toLocaleTimeString('id-ID', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		});
	}

	function getDuration(startTime: string, endTime: string) {
		const startDate = new Date(startTime);
		const endDate = new Date(endTime);
		const diffMs = endDate.getTime() - startDate.getTime();
		const diffMinutes = Math.floor(diffMs / 1000 / 60);

		const hours = Math.floor(diffMinutes / 60);
		const minutes = diffMinutes % 60;

		if (hours && minutes) return `${hours}h ${minutes}m`;
		if (hours) return `${hours}h`;
		return `${minutes}m`;
	}
</script>

<div class="flex flex-col gap-4 px-4">
	<div class="flex inline-flex items-center gap-4 justify-between">
		<div class="flex flex-col">
			<h2 class="text-base font-bold text-neutral-600">Schedule Breakdown</h2>
		</div>

		<div class="inline-flex gap-4">
			<Button
				onclick={toggleDrag}
				variant="outline"
				size="default"
				><div class="i-lucide:arrow-up-down"></div>
				<span class="hidden lg:inline">Arrange</span>
			</Button>
			<Dialog.Root>
				<Dialog.Trigger class={buttonVariants({ variant: 'outline', size: 'default' })}>
					<div class="i-lucide:plus p-2"></div>
					<span class="hidden lg:inline">Add Event</span>
				</Dialog.Trigger>
				<DialogRundown />
			</Dialog.Root>
		</div>
	</div>

	<section
		use:dndzone={{ items, flipDurationMs, delayTouchStart, dragDisabled }}
		onconsider={handleDndConsider}
		onfinalize={handleDndFinalize}
		class="flex flex-col gap-2 w-full border rounded-xl p-2"
	>
		{#each items as item (item.id)}
			<div animate:flip={{ duration: flipDurationMs }}>
				<Card.Root class="flex flex-row shrink-0 gap-1 py-4 px-2">
					<div class="i-lucide:more-vertical items-center justify-end"></div>
					<div class="flex flex-col w-full gap-2">
						<Card.Header class="px-0">
							<div class="inline-flex justify-between">
								<Card.Title>{item.title}</Card.Title>
								<div class="inline-flex gap-2">
									<Badge
										variant="outline"
										class="text-xs">{item.category}</Badge
									>
									<DropdownMenu.Root>
										<DropdownMenu.Trigger>
											<div class="i-lucide:more-vertical bg-gray-500"></div>
										</DropdownMenu.Trigger>
										<DropdownMenu.Content>
											<DropdownMenu.Group>
												{#each dropdownItem as item (item.label)}
													<DropdownMenu.Item class={item.color}>
														<div class={item.icon}></div>
														{item.label}
													</DropdownMenu.Item>
												{/each}
											</DropdownMenu.Group>
										</DropdownMenu.Content>
									</DropdownMenu.Root>
								</div>
							</div>
							<Card.Description>{item.description}</Card.Description>
						</Card.Header>
						<Card.Content class="inline-flex gap-2 items-center pt-2 p-0">
							<div class="i-lucide:clock w-3 h-3"></div>
							<span class="text-sm">{formatHour(item.startTime)} - {formatHour(item.endTime)}</span>
							<Badge
								variant="outline"
								class="text-xs">{getDuration(item.startTime, item.endTime)}</Badge
							>
						</Card.Content>
						<Card.Footer class="inline-flex gap-4 items-center p-0">
							<div class="inline-flex gap-2 items-center">
								<div class="i-lucide:user w-3 h-3"></div>
								<span class="text-sm">{item.attendees}</span>
							</div>
							<div class="inline-flex gap-2 items-center">
								<div class="i-lucide:map-pin w-3 h-3"></div>
								<span class="text-sm">{item.location}</span>
							</div>
						</Card.Footer>
					</div>
				</Card.Root>
			</div>
		{/each}
	</section>
</div>
