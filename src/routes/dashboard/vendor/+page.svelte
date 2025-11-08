<script lang="ts">
	import SectionCards from '$lib/components/section/section-cards.svelte';
	import SectionVendor from '$lib/components/section/section-vendor.svelte';

	import { vendorsStore } from '$lib/stores/vendors';
	import { formatDistanceToNow } from 'date-fns';

	const overviewTitle = 'Vendors Overview';
	let { data } = $props();

	// Update store whenever data changes (including after invalidation)
	$effect(() => {
		if (data.vendors) {
			vendorsStore.set(data.vendors);
		}
	});

	let overviewCards = $derived(() => {
		return [
			{
				title: data.stats.researchingCount.toString(),
				description: 'Researching',
				actionClass: 'i-lucide:search',
				actionColor: 'bg-gray-500 text-white',
				footer: data.update.researching 
					? `Last updated ${formatDistanceToNow(new Date(data.update.researching), { addSuffix: true })}`
					: 'No data yet',
			},
			{
				title: data.stats.contactedCount.toString(),
				description: 'Contacted',
				actionClass: 'i-lucide:phone',
				actionColor: 'bg-yellow-500 text-white',
				footer: data.update.contacted
					? `Last updated ${formatDistanceToNow(new Date(data.update.contacted), { addSuffix: true })}`
					: 'No data yet',
			},
			{
				title: data.stats.quotedCount.toString(),
				description: 'Quoted',
				actionClass: 'i-lucide:message-square-quote',
				actionColor: 'bg-blue-500 text-white',
				footer: data.update.quoted
					? `Last updated ${formatDistanceToNow(new Date(data.update.quoted), { addSuffix: true })}`
					: 'No data yet',
			},
			{
				title: data.stats.bookedCount.toString(),
				description: 'Booked',
				actionClass: 'i-lucide:book-check',
				actionColor: 'bg-green-500 text-white',
				footer: data.update.booked
					? `Last updated ${formatDistanceToNow(new Date(data.update.booked), { addSuffix: true })}`
					: 'No data yet',
			},
		];
	});
</script>

<div class="flex flex-1 flex-col gap-4 py-4 max-w-screen-xl mx-auto">
	<SectionCards
		{overviewCards}
		{overviewTitle}
	/>
	<SectionVendor {data} />
</div>
