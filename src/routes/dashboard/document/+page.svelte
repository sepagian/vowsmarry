<script lang="ts">
	import SectionCards from '$lib/components/section/section-cards.svelte';
	import SectionDocs from '$lib/components/section/section-docs.svelte';

	const overviewCards = [
		{
			title: '2',
			description: 'Legal & Formal',
			actionClass: 'i-lucide:scale',
			actionColor: 'bg-green-500 text-white',
			footer: 'Updated 5 minutes ago',
		},
		{
			title: '5',
			description: 'Vendor & Finance',
			actionClass: 'i-lucide:scroll-text',
			actionColor: 'bg-yellow-500 text-white',
			footer: 'Updated 10 minutes ago',
		},
		{
			title: '3',
			description: 'Guests & Ceremony',
			actionClass: 'i-lucide:book-open-check',
			actionColor: 'bg-blue-500 text-white',
			footer: 'Updated 2 minutes ago',
		},
		{
			title: '7',
			description: 'Personal & Keepsakes',
			actionClass: 'i-lucide:heart',
			actionColor: 'bg-red-500 text-white',
			footer: 'Updated 1 hour ago',
		},
	];
	const overviewTitle = 'Document Overview';

	// Explicitly type the docsCards array to match the expected component prop type
	const docsCards: {
		description: string;
		type: DocType;
		action?: string;
		footer: string;
	}[] = [
		{
			description: 'Official paperwork required to legally tie the knot.',
			type: 'legal-formal',
			footer: 'Sep 1, 2025',
		},
		{
			description: 'Agreement with Rosewood Hall including deposit details.',
			type: 'vendor-finance',
			footer: 'Aug 28, 2025',
		},
		{
			description: 'Package details and payment terms for wedding photography.',
			type: 'vendor-finance',
			footer: 'Aug 25, 2025',
		},
		{
			description: 'Running order of events including readings and vows.',
			type: 'guest-ceremony',
			footer: 'Sep 3, 2025',
		},
		{
			description: 'Personal vow draft, marked as private.',
			type: 'personal-keepsake',
			footer: 'Sep 5, 2025',
		},
		{
			description: 'Detailed expense tracking for all vendors and extra.',
			type: 'vendor-finance',
			footer: 'Sep 7, 2025',
		},
	];
</script>

<div class="flex flex-1 flex-col gap-4 py-4 max-w-screen-xl mx-auto">
	<SectionCards
		{overviewCards}
		{overviewTitle}
		columns={4}
	/>
	<SectionDocs {docsCards} />
</div>
