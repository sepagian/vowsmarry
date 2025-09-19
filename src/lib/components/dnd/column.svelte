<script lang="ts">
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';

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

<div class="wrapper">
	<div class="column-title">
		{name}
	</div>
	<div
		class="column-content"
		use:dndzone={{ items, flipDurationMs, zoneTabIndex: -1 }}
		on:consider={handleDndConsiderCards}
		on:finalize={handleDndFinalizeCards}
	>
		{#each items as item (item.id)}
			<div
				class="card"
				animate:flip={{ duration: flipDurationMs }}
			>
				{item.name}
			</div>
		{/each}
	</div>
</div>

<style>
	.wrapper {
		height: 100%;
		width: 100%;
		/*Notice we make sure this container doesn't scroll so that the title stays on top and the dndzone inside is scrollable*/
		overflow-y: hidden;
	}
	.column-content {
		height: calc(100% - 2.5em);
		/* Notice that the scroll container needs to be the dndzone if you want dragging near the edge to trigger scrolling */
		overflow-y: scroll;
	}
	.column-title {
		height: 2.5em;
		font-weight: bold;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.card {
		height: 4em;
		width: 100%;
		margin: 0.4em 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #dddddd;
		border: 1px solid #333333;
	}
</style>
