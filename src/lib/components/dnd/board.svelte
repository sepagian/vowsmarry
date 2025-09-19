<script lang="ts">
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import Column from './column.svelte';

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

<section
	class="board"
	use:dndzone={{ items: columns, flipDurationMs, type: 'column' }}
	on:consider={handleDndConsiderColumns}
	on:finalize={handleDndFinalizeColumns}
>
	{#each columns as { id, name, items }, idx (id)}
		<div
			class="column"
			animate:flip={{ duration: flipDurationMs }}
		>
			<Column
				{name}
				{items}
				onDrop={(newItems) => handleItemFinalize(idx, newItems)}
			/>
		</div>
	{/each}
</section>

<style>
	.board {
		height: 90vh;
		width: 100%;
		padding: 0.5em;
	}
	.column {
		height: 100%;
		width: 25%;
		padding: 0.5em;
		margin: 0.5em;
		float: left;
		border: 1px solid #333333;
	}
</style>
