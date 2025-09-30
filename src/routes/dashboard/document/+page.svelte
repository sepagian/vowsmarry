<script lang="ts">
	import SectionCards from '$lib/components/section/section-cards.svelte';
	import SectionDocs from '$lib/components/section/section-docs.svelte';
	import { documentsStore } from '$lib/stores/documents';
	import type { DocType } from '$lib/types';
	import { docTypeOptions } from '$lib/constants/constants';

	const overviewTitle = 'Document Overview';
	let { data } = $props();

	// Reactive overviewCards based on the store
	let overviewCards = $derived(() => {
		const documents = $documentsStore;
		const typeCounts = documents.reduce(
			(acc, doc) => {
				acc[doc.type] = (acc[doc.type] || 0) + 1;
				return acc;
			},
			{} as Partial<Record<DocType, number>>,
		);

		return docTypeOptions.map((option) => {
			const count = typeCounts[option.value] ?? 0;
			let actionColor = '';
			switch (option.value) {
				case 'legal-formal':
					actionColor = 'bg-green-500 text-white';
					break;
				case 'vendor-finance':
					actionColor = 'bg-yellow-500 text-white';
					break;
				case 'guest-ceremony':
					actionColor = 'bg-blue-500 text-white';
					break;
				case 'personal-keepsake':
					actionColor = 'bg-red-500 text-white';
					break;
			}
			return {
				title: count.toString(),
				description: option.label,
				actionClass: option.icon,
				actionColor,
				footer: 'Updated just now',
			};
		});
	});

	let docsCards = $documentsStore.map((doc) => ({
		description: doc.description,
		type: doc.type,
		action: doc.action,
		footer: doc.footer,
	}));
</script>

<div class="flex flex-1 flex-col gap-4 py-4 max-w-screen-xl mx-auto">
	<SectionCards
		{overviewCards}
		{overviewTitle}
		columns={4}
	/>
	<SectionDocs
		{data}
		{docsCards}
	/>
</div>
