<script lang="ts">
	import SectionCards from '$lib/components/section/section-cards.svelte';
	import SectionRundown from '$lib/components/section/section-rundown.svelte';
	import TimelineDnd from '$lib/components/dnd/timeline-dnd.svelte';
	import { rundownsStore } from '$lib/stores/rundowns';

	$: items = $rundownsStore.map((rundown) => ({
		id: rundown.id,
		title: rundown.title,
		description: rundown.description || '',
		category: rundown.category,
		startTime: rundown.startTime,
		endTime: rundown.endTime,
		attendees: rundown.attendees,
		location: rundown.location,
	}));

	$: overviewCards = (() => {
		const rundowns = $rundownsStore;
		const totalEvents = rundowns.length;
		const preparationEvents = rundowns.filter((r) => r.category === 'preparation').length;
		const ceremonyEvents = rundowns.filter((r) => r.category === 'ceremony').length;
		const receptionEvents = rundowns.filter((r) => r.category === 'reception').length;

		return [
			{
				title: totalEvents.toString(),
				description: 'Total Events',
				actionClass: 'i-lucide:calendar',
				actionColor: 'bg-blue-500 text-white',
				footer: 'Scheduled events',
			},
			{
				title: preparationEvents.toString(),
				description: 'Preparation',
				actionClass: 'i-lucide:sparkles',
				actionColor: 'bg-purple-500 text-white',
				footer: 'Prep activities',
			},
			{
				title: ceremonyEvents.toString(),
				description: 'Ceremony',
				actionClass: 'i-lucide:heart',
				actionColor: 'bg-pink-500 text-white',
				footer: 'Ceremony events',
			},
			{
				title: receptionEvents.toString(),
				description: 'Reception',
				actionClass: 'i-lucide:utensils',
				actionColor: 'bg-green-500 text-white',
				footer: 'Reception activities',
			},
		];
	})();

	const overviewTitle = 'Schedule Overview';
</script>

<div class="flex flex-1 flex-col gap-4 py-4 max-w-screen-xl mx-auto">
	<SectionCards
		{overviewCards}
		{overviewTitle}
		columns={4}
	/>
	<SectionRundown />
	<TimelineDnd {items} />
</div>
