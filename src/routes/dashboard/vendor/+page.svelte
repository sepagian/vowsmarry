<script lang="ts">
	import SectionCards from '$lib/components/section/section-cards.svelte';
	import SectionVendor from '$lib/components/section/section-vendor.svelte';
	import { vendorsColumns } from '$lib/stores/vendors';
	import type { ColumnType } from '$lib/stores/vendors';

	const overviewTitle = 'Vendors Overview';

	// Reactive overviewCards based on the store
	$: overviewCards = $vendorsColumns.map((column: ColumnType) => {
		const count = column.items.length;
		let actionClass = '';
		let actionColor = '';
		switch (column.name) {
			case 'Booked':
				actionClass = 'i-lucide:badge-check';
				actionColor = 'bg-green-500 text-white';
				break;
			case 'Contacted':
				actionClass = 'i-lucide:badge-minus';
				actionColor = 'bg-yellow-500 text-white';
				break;
			case 'Negotiated':
				actionClass = 'i-lucide:badge-alert';
				actionColor = 'bg-red-500 text-white';
				break;
			case 'Completed':
				actionClass = 'i-lucide:badge-info';
				actionColor = 'bg-blue-500 text-white';
				break;
		}
		return {
			title: count.toString(),
			description: column.name,
			actionClass,
			actionColor,
			footer: `Updated just now`,
		};
	});
</script>

<div class="flex flex-1 flex-col gap-4 py-4 max-w-screen-xl mx-auto">
	<SectionCards
		{overviewCards}
		{overviewTitle}
		columns={4}
	/>
	<SectionVendor />
</div>
