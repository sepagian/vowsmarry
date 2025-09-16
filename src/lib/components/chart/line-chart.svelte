<script lang="ts">
	import { VisXYContainer, VisStackedBar, VisAxis } from '@unovis/svelte';

	type DataRecord = { x: number; y: number; y1: number; y2: number };
	export let data: DataRecord[];
	const x = (d: DataRecord) => d.x;
	const y = (d: DataRecord) => d.y;
</script>

<VisXYContainer {data}>
	<VisStackedBar
		{x}
		{y}
	/>
	<VisAxis type="x" />
	<VisAxis type="y" />
</VisXYContainer>
