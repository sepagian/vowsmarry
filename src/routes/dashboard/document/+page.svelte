<script lang="ts">
  import SectionCards from "$lib/components/section/section-cards.svelte";
  import SectionDocs from "$lib/components/section/section-docs.svelte";
  import { ConfirmDeleteDialog } from "$lib/components/ui/confirm-delete-dialog";
  import { useDocuments } from "$lib/query/document";
  import type { DocumentCategory } from "$lib/types";

  import { docTypeOptions } from "$lib/constants/constants";

  const overviewTitle = "Document Overview";
  let { data } = $props();

  const documentsQuery = useDocuments();

  let overviewCards = $derived.by(() => {
    const documents = documentsQuery.data?.documents || [];
    const typeCounts = documents.reduce(
      (acc, doc) => {
        acc[doc.documentCategory] = (acc[doc.documentCategory] || 0) + 1;
        return acc;
      },
      {} as Partial<Record<DocumentCategory, number>>,
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
</script>

<ConfirmDeleteDialog />

<div class="flex flex-1 flex-col gap-4 py-4 max-w-screen-xl mx-auto">
  <SectionCards {overviewCards} {overviewTitle} />
  <SectionDocs {data} documents={documentsQuery.data?.documents || []} />
</div>
