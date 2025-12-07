<script lang="ts">
	import SectionCards from '$lib/components/section/section-cards.svelte';
	import SectionVendor from '$lib/components/section/section-vendor.svelte';
	import { ConfirmDeleteDialog } from '$lib/components/ui/confirm-delete-dialog';

	import { vendorsState } from '$lib/stores/vendors.svelte';
	import { formatDistanceToNow } from 'date-fns';

	const overviewTitle = 'Vendors Overview';
	let { data } = $props();

	// Update store whenever data changes (including after invalidation)
	// Pass workspace ID to ensure data consistency when workspace changes
	$effect(() => {
		if (data.vendors) {
			const workspaceId = data.workspace?.id || null;
			
			// Clear store if workspace changed to prevent stale data
			if (!vendorsState.isWorkspace(workspaceId)) {
				vendorsState.clearWorkspace();
			}
			
			vendorsState.set(data.vendors, workspaceId);
		}
	});

	let overviewCards = $derived([
			{
				title: data.vendorStats.researching.toString(),
				description: 'Researching',
				actionClass: 'i-lucide:search',
				actionColor: 'bg-gray-500 text-white',
				footer: data.update.researching
					? `Last updated ${formatDistanceToNow(new Date(data.update.researching), { addSuffix: true })}`
					: 'No data yet',
			},
			{
				title: data.vendorStats.contacted.toString(),
				description: 'Contacted',
				actionClass: 'i-lucide:phone',
				actionColor: 'bg-yellow-500 text-white',
				footer: data.update.contacted
					? `Last updated ${formatDistanceToNow(new Date(data.update.contacted), { addSuffix: true })}`
					: 'No data yet',
			},
			{
				title: data.vendorStats.quoted.toString(),
				description: 'Quoted',
				actionClass: 'i-lucide:message-square-quote',
				actionColor: 'bg-blue-500 text-white',
				footer: data.update.quoted
					? `Last updated ${formatDistanceToNow(new Date(data.update.quoted), { addSuffix: true })}`
					: 'No data yet',
			},
			{
				title: data.vendorStats.booked.toString(),
				description: 'Booked',
				actionClass: 'i-lucide:book-check',
				actionColor: 'bg-green-500 text-white',
				footer: data.update.booked
					? `Last updated ${formatDistanceToNow(new Date(data.update.booked), { addSuffix: true })}`
					: 'No data yet',
			},
		]);
</script>

<ConfirmDeleteDialog />

<div class="flex flex-1 flex-col gap-4 py-4 max-w-screen-xl mx-auto">
	<SectionCards
		{overviewCards}
		{overviewTitle}
	/>
	<SectionVendor {data} />
</div>
