<script lang="ts">
	import SectionCards from '$lib/components/section/section-cards.svelte';
	import SectionVendor from '$lib/components/section/section-vendor.svelte';

	import { vendorsStore } from '$lib/stores/vendors';

	let { data } = $props();
	const overviewTitle = 'Vendors Overview';

	// Reactive overviewCards based on the store
	let overviewCards = $derived(() => {
		const vendors = $vendorsStore;
		const researching = vendors.filter((vendor) => vendor.vendorStatus === 'researching').length;
		const contacted = vendors.filter((vendor) => vendor.vendorStatus === 'contacted').length;
		const quoted = vendors.filter((vendor) => vendor.vendorStatus === 'quoted').length;
		const booked = vendors.filter((vendor) => vendor.vendorStatus === 'booked').length;

		return [
			{
				title: researching.toString(),
				description: 'Researching',
				actionClass: 'i-lucide:search',
				actionColor: 'bg-gray-500 text-white',
				footer: 'Updated just now',
			},
			{
				title: contacted.toString(),
				description: 'Contacted',
				actionClass: 'i-lucide:phone',
				actionColor: 'bg-yellow-500 text-white',
				footer: 'Updated just now',
			},
			{
				title: quoted.toString(),
				description: 'Quoted',
				actionClass: 'i-lucide:message-square-quote',
				actionColor: 'bg-blue-500 text-white',
				footer: 'Updated just now',
			},
			{
				title: booked.toString(),
				description: 'Booked',
				actionClass: 'i-lucide:book-check',
				actionColor: 'bg-green-500 text-white',
				footer: 'Updated just now',
			},
		];
	});
</script>

<div class="flex flex-1 flex-col gap-4 py-4 max-w-screen-xl mx-auto">
	<SectionCards
		{overviewCards}
		{overviewTitle}
		columns={4}
	/>
	<SectionVendor {data} />

</div>
