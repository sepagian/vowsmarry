<script lang="ts">
  import DialogVendor from "$lib/components/dialog/dialog-vendor.svelte";
  import DialogVendorEdit from "$lib/components/dialog/dialog-vendor-edit.svelte";
  import { Button, buttonVariants } from "$lib/components/ui/button/index";
  import * as Card from "$lib/components/ui/card/index";
  import { confirmDelete } from "$lib/components/ui/confirm-delete-dialog";
  import * as Dialog from "$lib/components/ui/dialog/index";
  import { Input } from "$lib/components/ui/input/index";

  import { CrudToasts } from "$lib/utils/toasts";

  import { useDeleteVendor } from "$lib/mutation/vendor";
  import { useVendors } from "$lib/query/vendor";
  import type { Vendor } from "$lib/types";

  let { data: pageData } = $props<{ data: { vendorForm: unknown } }>();

  const vendorQuery = useVendors();
  const deleteVendorMutation = useDeleteVendor();

  let searchTerm = $state("");
  let open = $state(false);
  let editDialogOpen = $state(false);
  let selectedVendor = $state<Vendor | null>(null);

  async function handleDelete(vendorId: string, vendorName: string) {
    try {
      await deleteVendorMutation.mutateAsync(vendorId);
      CrudToasts.success("delete", "vendor", { itemName: vendorName });
    } catch (error) {
      console.error("Delete error:", error);
      CrudToasts.error("delete", "Failed to delete vendor", "vendor");
    }
  }

  function openEditDialog(vendor: Vendor) {
    selectedVendor = vendor;
    editDialogOpen = true;
  }

  let vendors = $derived(vendorQuery.data?.vendors || []);

  let filteredVendors = $derived(
    vendors.filter(
      (v) =>
        v.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.vendorCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.vendorStatus.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  let isLoading = $derived(vendorQuery.isLoading);
</script>

<div class="flex flex-col gap-4 px-4">
  <div class="flex items-center justify-between gap-4">
    <Input
      bind:value={searchTerm}
      placeholder="Search vendors"
      type="search"
      class="max-w-sm border-1 border-neutral-200"
    />
    <Dialog.Root bind:open>
      <Dialog.Trigger
        class={buttonVariants({ variant: "outline", size: "default" })}
      >
        <div class="i-lucide:plus p-2"></div>
        <span class="hidden lg:inline">Add Vendor</span>
      </Dialog.Trigger>
      <DialogVendor data={pageData} bind:open/>
    </Dialog.Root>
  </div>
  {#if isLoading}
    <div class="flex flex-col items-center justify-center py-12 text-center">
      <div
        class="i-lucide:loader-2 h-8 w-8 animate-spin text-muted-foreground mb-4"
      ></div>
      <p class="text-sm text-muted-foreground">Loading vendors...</p>
    </div>
  {:else}
    <div
      class="flex gap-4 flex-col sm:grid md:grid lg:grid-cols-2 xl:grid-cols-4"
    >
      {#each filteredVendors as vendor (vendor.vendorName)}
        <Card.Root
          class="@container/card shrink-0 w-full sm:w-auto gap-2 flex flex-col p-2 shadow-none"
        >
          <Card.Header class="flex flex-col gap-3 px-0">
            <div
              class="inline-flex min-h-[8rem] sm:min-h-[6rem] rounded-lg w-full bg-gray-100"
            ></div>
          </Card.Header>
          <Card.Footer
            class="flex-col items-start text-sm justify-start p-0 gap-2.5"
          >
            <div class="flex justify-between w-full items-center">
              <div
                class="inline-flex gap-1 items-center text-xs truncate text-gray-600"
              >
                <Card.Description
                  class="text-sm font-semibold truncate overflow-hidden"
                >
                  {vendor.vendorName}
                </Card.Description>
              </div>
              <div class="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  class="h-8 w-8 p-0"
                  title="Edit vendor"
                  onclick={() => openEditDialog(vendor)}
                >
                  <div class="i-lucide:pencil h-4 w-4"></div>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  class="h-8 w-8 p-0"
                  title="Delete vendor"
                  onclick={() => {
                    confirmDelete({
                      title: "Delete Vendor",
                      description: `Are you sure you want to delete "${vendor.vendorName}"? This action cannot be undone.`,
                      onConfirm: async () => {
                        await handleDelete(
                          vendor.id as string,
                          vendor.vendorName,
                        );
                      },
                    });
                  }}
                >
                  <div class="i-lucide:trash-2 h-4 w-4 text-red-500"></div>
                </Button>
              </div>
            </div>
          </Card.Footer>
        </Card.Root>
      {:else}
        <div
          class="col-span-full flex flex-col items-center justify-center py-12 text-center"
        >
          <div
            class="i-lucide:users h-12 w-12 text-muted-foreground mb-4"
          ></div>
          <h3 class="text-lg font-semibold mb-2">
            No vendors in this workspace
          </h3>
          <p class="text-sm text-muted-foreground mb-4">
            Add your first vendor to start managing your wedding service
            providers.
          </p>
        </div>
      {/each}
    </div>
  {/if}
  {#if selectedVendor}
    <DialogVendorEdit
      vendor={selectedVendor}
      data={pageData}
      bind:open={editDialogOpen}
    />
  {/if}
</div>
