<script lang="ts">
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import type { Item } from '$lib/stores/vendors';

	const flipDurationMs = 150;
	export let name: string;
	export let items: Item[];
	export let onDrop: (updatedItems: Item[]) => void;

	function handleDndConsiderCards(e: CustomEvent) {
		console.warn('got consider', name);
		items = e.detail.items as Item[];
	}
	function handleDndFinalizeCards(e: CustomEvent) {
		onDrop(e.detail.items as Item[]);
	}
</script>

<div class="shrink-0 sm:w-auto gap-2 flex flex-col py-2 shadow-none">
	<div class=" font-bold flex justify-center items-center">
		{name}
	</div>
	<div
		class="h-[calc(100%-2.5em)] w-full flex flex-col gap-2 overflow-y-scroll"
		use:dndzone={{ items, flipDurationMs, zoneTabIndex: -1 }}
		on:consider={handleDndConsiderCards}
		on:finalize={handleDndFinalizeCards}
	>
		{#each items as item (item.id)}
			<div
				class="h-24 w-full p-4 flex justify-center rounded-lg items-center bg-gray-300 border border-gray-800"
				animate:flip={{ duration: flipDurationMs }}
			>
				{item.name}
			</div>
		{/each}
	</div>
</div>
