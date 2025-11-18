<script lang="ts">
	import SectionCards from '$lib/components/section/section-cards.svelte';
	import TimelineDnd from '$lib/components/dnd/timeline-dnd.svelte';
	import { rundownsStore } from '$lib/stores/rundowns';

	let { data } = $props();

	$effect(() => {
		if (data.schedules) {
			rundownsStore.set(data.schedules);
		}
	});

	const weddingDate = data.wedding?.weddingDate ? new Date(data.wedding.weddingDate) : null;
	const daysUntilWedding = weddingDate
		? Math.ceil((weddingDate.getTime() - new Date().getTime()) / 86400000)
		: '0';

	let items = $derived($rundownsStore);

	let overviewCards = $derived(() => {
		const nextEventTitle = data.stats.nextEvent ? data.stats.nextEvent.startTime : 'No events';
		const nextEventFooter = data.stats.nextEvent
			? data.stats.nextEvent.name
			: 'All events completed';

		return [
			{
				title: `${daysUntilWedding === 0 ? 'Today' : daysUntilWedding} days to go`,
				description: 'Days Until Wedding',
				actionClass: 'i-lucide:calendar',
				actionColor: 'bg-blue-500 text-white',
				footer: 'Until your big day',
			},
			{
				title: data.stats.completedEvents.toString(),
				description: 'Completed Events',
				actionClass: 'i-lucide:sparkles',
				actionColor: 'bg-purple-500 text-white',
				footer: 'Events finished',
			},
			{
				title: nextEventTitle,
				description: 'Upcoming Events',
				actionClass: 'i-lucide:clock',
				actionColor: 'bg-pink-500 text-white',
				footer: nextEventFooter,
			},
			{
				title: data.stats.remainingEvents.toString(),
				description: 'Remaining Events',
				actionClass: 'i-lucide:list-checks',
				actionColor: 'bg-green-500 text-white',
				footer: 'Still to complete',
			},
		];
	});

	const overviewTitle = 'Schedule Overview';
</script>

<div class="flex flex-1 flex-col gap-4 py-4 max-w-screen-xl mx-auto">
	<SectionCards
		{overviewCards}
		{overviewTitle}
	/>
	<TimelineDnd
		{items}
		{data}
	/>
</div>
