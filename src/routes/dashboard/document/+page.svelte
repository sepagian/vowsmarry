<script lang="ts">
	import SectionCards from "$lib/components/section/section-cards.svelte";
	import SectionDocs from "$lib/components/section/section-docs.svelte";
	import { ConfirmDeleteDialog } from "$lib/components/ui/confirm-delete-dialog";
	import { documentsState } from "$lib/stores/documents.svelte";
	import type { DocumentCategory } from "$lib/types";

	import { docTypeOptions } from "$lib/constants/constants";
	import { page } from "$app/state";
	import { goto } from "$app/navigation";
	import { Pagination } from "$lib/components/ui/pagination";

	const overviewTitle = "Document Overview";
	let { data } = $props();

	// Pagination state derived from URL
	let currentPage = $derived(Number(page.url.searchParams.get("page")) || 1);
	let limit = $derived(Number(page.url.searchParams.get("limit")) || 10);

	// Handle page change
	function handlePageChange(newPage: number) {
		const url = new URL(page.url);
		if (newPage !== 1) {
			url.searchParams.set("page", newPage.toString());
		} else {
			url.searchParams.delete("page");
		}
		goto(url.toString(), { replaceState: true, noScroll: true });
	}

	// Reactive overviewCards based on the store
	let overviewCards = $derived.by(() => {
		const documents = documentsState.documents;
		const typeCounts = documents.reduce(
			(acc, doc) => {
				acc[doc.documentCategory] = (acc[doc.documentCategory] || 0) + 1;
				return acc;
			},
			{} as Partial<Record<DocumentCategory, number>>
		);

		return docTypeOptions.map((option) => {
			const count = typeCounts[option.value] ?? 0;
			let actionColor = "";
			switch (option.value) {
				case "legal_formal":
					actionColor = "bg-green-500 text-white";
					break;
				case "vendor_finance":
					actionColor = "bg-yellow-500 text-white";
					break;
				case "guest_ceremony":
					actionColor = "bg-blue-500 text-white";
					break;
				case "personal_keepsake":
					actionColor = "bg-red-500 text-white";
					break;
			}
			return {
				title: count.toString(),
				description: option.label,
				actionClass: option.icon,
				actionColor,
				footer: "Updated just now",
			};
		});
	});

	// Initialize store with server data
	// Pass workspace ID to ensure data consistency when workspace changes
	$effect(() => {
		if (data.documents) {
			const workspaceId = data.workspace?.id || null;

			// Clear store if workspace changed to prevent stale data
			if (!documentsState.isWorkspace(workspaceId)) {
				documentsState.clearWorkspace();
			}

			documentsState.set(
				(data.documents as any).list || data.documents,
				workspaceId
			);
		}
	});

	let docsCards = $derived(documentsState.documents);
</script>

<ConfirmDeleteDialog/>

<div class="flex flex-1 flex-col gap-4 py-4 max-w-screen-xl mx-auto">
	<SectionCards {overviewCards} {overviewTitle}/>
	<SectionDocs {data} {docsCards}/>

	{#if data.documents && (data.documents as any).pagination}
		<div class="flex justify-center mt-4">
			<Pagination
				count={(data.documents as any).pagination.total}
				perPage={limit}
				page={currentPage}
				onPageChange={handlePageChange}
			/>
		</div>
	{/if}
</div>
