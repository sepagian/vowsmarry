<script lang="ts">
	import SectionCards from '$lib/components/section/section-cards.svelte';

	const overviewCards = [
		{
			title: 'Rp20.000.000',
			description: 'Total Budget',
			actionClass: 'i-lucide:scale',
			actionColor: 'bg-green-500 text-white',
			footer: 'Updated 5 minutes ago',
		},
		{
			title: 'Rp10.000.000',
			description: 'Amount Spent',
			actionClass: 'i-lucide:scroll-text',
			actionColor: 'bg-yellow-500 text-white',
			footer: 'Updated 10 minutes ago',
		},
		{
			title: 'Rp10.000.000',
			description: 'Budget Remaining',
			actionClass: 'i-lucide:book-open-check',
			actionColor: 'bg-blue-500 text-white',
			footer: 'Updated 2 minutes ago',
		},
	];

	const overviewTitle = 'Budget Overview';
</script>

<div class="flex flex-1 flex-col gap-4 py-4 px-4 max-w-screen-lg mx-auto">
	<SectionCards
		{overviewCards}
		{overviewTitle}
		columns={3}
	/>
	<div class="sm:grid sm:grid-cols-3 gap-4 flex flex-col">
		<div class="col-span-2 bg-gray-200 rounded-xl min-h-[8rem]">1</div>
		<div class="bg-gray-200 rounded-xl">2</div>
	</div>
</div>
