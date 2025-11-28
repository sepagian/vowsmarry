<script lang="ts">
	import { flip } from 'svelte/animate';
	import * as Card from '$lib/components/ui/card/index';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import * as Dialog from '../ui/dialog/index';
	import { Badge } from '$lib/components/ui/badge/index';
	import { dndzone } from 'svelte-dnd-action';
	import { Button, buttonVariants } from '../ui/button/index';
	import { Switch } from '../ui/switch/index';
	import DialogRundown from '../dialog/dialog-rundown.svelte';
	import { CrudToasts } from '$lib/utils/toasts';
	import { InvalidationService } from '$lib/utils/invalidation-helpers';
	import { createFormDataWithId } from '$lib/utils/form-helpers';

	let { items, data } = $props();
	let open = $state(false);

	let dragDisabled = $state(true);
	const flipDurationMs = 300;
	const delayTouchStart = 300;

	const dropdownItem: {
		label: string;
		icon: string;
		color?: string;
		action: string;
	}[] = [
		{
			label: 'View',
			icon: 'i-lucide:eye',
			action: 'view',
		},
		{
			label: 'Edit',
			icon: 'i-lucide:edit',
			action: 'edit',
		},
		{
			label: 'Delete',
			icon: 'i-lucide:trash2',
			color: 'hover:bg-red-100 text-red-800',
			action: 'delete',
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

	async function handleDelete(itemId: string, itemName: string) {
		if (!confirm(`Are you sure you want to delete "${itemName}"?`)) {
			return;
		}

		try {
			const formData = createFormDataWithId(itemId);

			const response = await fetch('?/deleteSchedule', {
				method: 'POST',
				body: formData,
			});

			const result = (await response.json()) as { type: string; error?: string };

			if (result.type === 'success') {
				CrudToasts.success('delete', 'rundown', { itemName });
				await InvalidationService.invalidateRundown();
			} else {
				CrudToasts.error('delete', result.error || 'Failed to delete rundown', 'rundown');
			}
		} catch (error) {
			CrudToasts.error('delete', 'An error occurred while deleting the rundown', 'rundown');
		}
	}

	function handleMenuAction(action: string, item: any) {
		switch (action) {
			case 'view':
				console.log('View item:', item);
				break;
			case 'edit':
				console.log('Edit item:', item);
				break;
			case 'delete':
				handleDelete(item.id, item.rundownName);
				break;
		}
	}
</script>

<div class="flex flex-col gap-2 px-4">
	<div class="flex inline-flex items-center gap-4 justify-between">
		<div class="flex flex-col">
			<h2 class="text-base font-bold text-neutral-600">Schedule Breakdown</h2>
		</div>

		<div class="inline-flex items-center gap-4">
			<Switch
				id="toggle-drag"
				class=""
				onclick={toggleDrag}
			/>
			<Dialog.Root bind:open>
				<Dialog.Trigger class={buttonVariants({ variant: 'outline', size: 'default' })}>
					<div class="i-lucide:plus p-2"></div>
					<span class="hidden lg:inline">Add Event</span>
				</Dialog.Trigger>
				<DialogRundown
					{data}
					bind:open
				/>
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
				<Card.Root class="flex flex-row shrink-0 gap-1 rounded-lg py-4 px-2">
					<div class="i-lucide:more-vertical bg-gray-500"></div>
					<div class="flex flex-col w-full gap-2">
						<Card.Header class="px-0">
							<div class="inline-flex justify-between">
								<Card.Title>{item.rundownName}</Card.Title>
								<div class="inline-flex gap-2">
									<DropdownMenu.Root>
										<DropdownMenu.Trigger>
											<div class="i-lucide:more-vertical bg-gray-500"></div>
										</DropdownMenu.Trigger>
										<DropdownMenu.Content>
											<DropdownMenu.Group>
												{#each dropdownItem as dropdownOption (dropdownOption.label)}
													<DropdownMenu.Item
														class={dropdownOption.color}
														onclick={() => handleMenuAction(dropdownOption.action, item)}
													>
														<div class={dropdownOption.icon}></div>
														{dropdownOption.label}
													</DropdownMenu.Item>
												{/each}
											</DropdownMenu.Group>
										</DropdownMenu.Content>
									</DropdownMenu.Root>
								</div>
							</div>
							<Card.Description>{item.venue || 'No description'}</Card.Description>
						</Card.Header>
						<Card.Content class="inline-flex gap-2 items-center pt-2 p-0">
							<div class="i-lucide:clock w-3 h-3"></div>
							<span class="text-sm">{item.startTime} - {item.endTime}</span>
						</Card.Content>
						<Card.Footer class="inline-flex gap-4 items-center p-0">
							<div class="inline-flex gap-2 items-center">
								<div class="i-lucide:user w-3 h-3"></div>
								<span class="text-sm">{item.attendees || 'N/A'}</span>
							</div>
							<div class="inline-flex gap-2 items-center">
								<div class="i-lucide:map-pin w-3 h-3"></div>
								<span class="text-sm">{item.location || 'N/A'}</span>
							</div>
						</Card.Footer>
					</div>
				</Card.Root>
			</div>
		{/each}
	</section>
</div>
