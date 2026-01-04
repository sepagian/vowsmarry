<script lang="ts">
  import { formatDistanceToNow } from "date-fns";

  import SectionCards from "$lib/components/section/section-cards.svelte";
  import SectionVendor from "$lib/components/section/section-vendor.svelte";
  import { ConfirmDeleteDialog } from "$lib/components/ui/confirm-delete-dialog";

  import { getVendorStats } from "$lib/utils/vendor-stats";

  import { useVendors } from "$lib/query/vendor";

  const overviewTitle = "Vendors Overview";
  let { data } = $props();

  const vendorQuery = useVendors();

  let vendorStats = $derived(getVendorStats(vendorQuery.data?.vendors || []));

  let overviewCards = $derived([
    {
      title: vendorStats.researching.toString(),
      description: "Researching",
      actionClass: "i-lucide:search",
      actionColor: "bg-gray-500 text-white",
      footer: vendorQuery.data?.update?.researching
        ? `Last updated ${formatDistanceToNow(new Date(vendorQuery.data.update.researching), { addSuffix: true })}`
        : "No data yet",
    },
    {
      title: vendorStats.contacted.toString(),
      description: "Contacted",
      actionClass: "i-lucide:phone",
      actionColor: "bg-yellow-500 text-white",
      footer: vendorQuery.data?.update?.contacted
        ? `Last updated ${formatDistanceToNow(new Date(vendorQuery.data.update.contacted), { addSuffix: true })}`
        : "No data yet",
    },
    {
      title: vendorStats.quoted.toString(),
      description: "Quoted",
      actionClass: "i-lucide:message-square-quote",
      actionColor: "bg-blue-500 text-white",
      footer: vendorQuery.data?.update?.quoted
        ? `Last updated ${formatDistanceToNow(new Date(vendorQuery.data.update.quoted), { addSuffix: true })}`
        : "No data yet",
    },
    {
      title: vendorStats.booked.toString(),
      description: "Booked",
      actionClass: "i-lucide:book-check",
      actionColor: "bg-green-500 text-white",
      footer: vendorQuery.data?.update?.booked
        ? `Last updated ${formatDistanceToNow(new Date(vendorQuery.data.update.booked), { addSuffix: true })}`
        : "No data yet",
    },
  ]);
</script>

<ConfirmDeleteDialog/>

<div class="flex flex-1 flex-col gap-4 py-4 max-w-screen-xl mx-auto">
  <SectionCards {overviewCards} {overviewTitle}/>
  <SectionVendor {data}/>
</div>
