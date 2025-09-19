<script lang="ts">
	import SectionCards from '$lib/components/section/section-cards.svelte';
	import SectionVendor from '$lib/components/section/section-vendor.svelte';

	const overviewCards = [
		{
			title: '2',
			description: 'Booked',
			actionClass: 'i-lucide:badge-check',
			actionColor: 'bg-green-500 text-white',
			footer: 'Updated 5 minutes ago',
		},
		{
			title: '5',
			description: 'Contacted',
			actionClass: 'i-lucide:badge-minus',
			actionColor: 'bg-yellow-500 text-white',
			footer: 'Updated 10 minutes ago',
		},
		{
			title: '0',
			description: 'Negotiated',
			actionClass: 'i-lucide:badge-alert',
			actionColor: 'bg-red-500 text-white',
			footer: 'Updated 2 minutes ago',
		},
		{
			title: '7',
			description: 'Completed',
			actionClass: 'i-lucide:badge-info',
			actionColor: 'bg-blue-500 text-white',
			footer: 'Updated 1 hour ago',
		},
	];

	const overviewTitle = 'Vendors Overview';
</script>

<div class="flex flex-1 flex-col gap-4 py-4 max-w-screen-xl mx-auto">
	<SectionCards
		{overviewCards}
		{overviewTitle}
		columns={4}
	/>
	<SectionVendor />
</div>
