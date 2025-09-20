<script lang="ts">
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import Column from './column.svelte';
	import type { ColumnType, Item } from '$lib/stores/vendors';

	const flipDurationMs = 300;

	export let columns: ColumnType[];
	// will be called any time a card or a column gets dropped to update the parent data
	export let onFinalUpdate: (updatedColumns: ColumnType[]) => void;

	function handleDndConsiderColumns(e: CustomEvent) {
		columns = e.detail.items as ColumnType[];
	}
	function handleDndFinalizeColumns(e: CustomEvent) {
		onFinalUpdate(e.detail.items as ColumnType[]);
	}
	function handleItemFinalize(columnIdx: number, newItems: Item[]) {
		columns[columnIdx].items = newItems;
		onFinalUpdate([...columns]);
	}
</script>

<div
	class="flex gap-4 overflow-x-auto scrollbar-none scroll-smooth h-[90vh] sm:grid md:grid lg:grid-cols-4"
	use:dndzone={{ items: columns, flipDurationMs, type: 'column' }}
	on:consider={handleDndConsiderColumns}
	on:finalize={handleDndFinalizeColumns}
>
	{#each columns as { id, name, items }, idx (id)}
		<div
			class="shrink-0 w-64 h-full p-2 border border-gray-200 rounded-xl sm:w-auto"
			animate:flip={{ duration: flipDurationMs }}
		>
			<Column
				{name}
				{items}
				onDrop={(newItems) => handleItemFinalize(idx, newItems)}
			/>
		</div>
	{/each}
</div>
