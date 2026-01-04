<script lang="ts">
  import { useQueryClient } from "@tanstack/svelte-query";
  import { superForm } from "sveltekit-superforms";
  import { valibot } from "sveltekit-superforms/adapters";

  import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "$lib/components/ui/dialog/index";
  import {
    FormButton,
    FormControl,
    FormField,
    FormFieldErrors,
    FormLabel,
  } from "$lib/components/ui/form/index";
  import { Input } from "$lib/components/ui/input/index";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
  } from "$lib/components/ui/select/index";

  import { broadcastInvalidate } from "$lib/utils/broadcast";
  import { CrudToasts, FormToasts } from "$lib/utils/toasts";
  import {
    categoryEnum,
    vendorRatingEnum,
    vendorSchema,
    vendorStatusEnum,
  } from "$lib/validation/planner";

  import { useCreateVendor } from "$lib/mutation/vendor";

  let { data, open = $bindable() } = $props();

  const createVendorMutation = useCreateVendor();
  const queryClient = useQueryClient();

  const form = superForm(data.vendorForm, {
    validators: valibot(vendorSchema),
    resetForm: true,
    onResult: ({ result }) => {
      if (result.type === "success") {
        const vendorName = $formData.vendorName || "Vendor";
        CrudToasts.success("create", "vendor", { itemName: vendorName });
        queryClient.invalidateQueries({ queryKey: ["vendors"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        broadcastInvalidate(["vendors", "dashboard"]);
        open = false;
      } else if (result.type === "failure") {
        FormToasts.emptyFormError();
      } else if (result.type === "error") {
        CrudToasts.error(
          "create",
          "An error occurred while saving the vendor",
          "vendor"
        );
      }
    },
  });
  const { form: formData, enhance } = form;

  const isLoading = $derived(createVendorMutation.isPending.value);

  const selectedCategory = $derived(
    $formData.vendorCategory
      ? categoryEnum.find((c) => c.value === $formData.vendorCategory)?.label
      : "Choose category"
  );

  const selectedStatus = $derived(
    $formData.vendorStatus
      ? vendorStatusEnum.find((s) => s.value === $formData.vendorStatus)?.label
      : "Select progress status"
  );

  const selectedRating = $derived(
    $formData.vendorRating
      ? vendorRatingEnum.find((r) => r.value === $formData.vendorRating)?.label
      : "Select vendor rating"
  );
</script>

<DialogContent class="sm:max-w-[425px]">
  <DialogHeader>
    <DialogTitle>Add New Vendor</DialogTitle>
    <DialogDescription>
      <p>Add a new wedding service provider</p>
    </DialogDescription>
  </DialogHeader>
  <form
    use:enhance
    method="POST"
    action="?/createVendor"
    class="flex flex-col gap-4"
    onsubmit={(e) => {
      if (!$formData.valid) {
        e.preventDefault();
      }
    }}
  >
    <FormField {form} name="vendorName">
      <FormControl>
        {#snippet children({ props })}
          <FormLabel>Name</FormLabel>
          <Input {...props} type="text" bind:value={$formData.vendorName} />
        {/snippet}
      </FormControl>
      <FormFieldErrors class="text-xs text-red-500"/>
    </FormField>
    <div class="flex w-full gap-4">
      <FormField {form} name="vendorCategory" class="flex flex-col w-full">
        <FormControl>
          {#snippet children({ props })}
            <FormLabel>Category</FormLabel>
            <Select
              type="single"
              bind:value={$formData.vendorCategory}
              name={props.name}
            >
              <SelectTrigger {...props} class="flex w-full">
                {selectedCategory}
              </SelectTrigger>
              <SelectContent>
                {#each categoryEnum as option (option.value)}
                  <SelectItem value={option.value}>
                    {option.label}
                  </SelectItem>
                {/each}
              </SelectContent>
            </Select>
          {/snippet}
        </FormControl>
        <FormFieldErrors class="text-xs"/>
      </FormField>
      <FormField {form} name="vendorInstagram" class="flex flex-col w-full">
        <FormControl>
          {#snippet children({ props })}
            <FormLabel>Instagram</FormLabel>
            <Input {...props} type="text" bind:value={$formData.vendorInstagram} />
          {/snippet}
        </FormControl>
        <FormFieldErrors class="text-xs text-red-500"/>
      </FormField>
    </div>
    <div class="flex w-full gap-4">
      <FormField {form} name="vendorStatus" class="flex flex-col w-full">
        <FormControl>
          {#snippet children({ props })}
            <FormLabel>Status</FormLabel>
            <Select
              type="single"
              bind:value={$formData.vendorStatus}
              name={props.name}
            >
              <SelectTrigger {...props} class="flex w-full">
                {selectedStatus}
              </SelectTrigger>
              <SelectContent>
                {#each vendorStatusEnum as option (option.value)}
                  <SelectItem value={option.value}>
                    {option.label}
                  </SelectItem>
                {/each}
              </SelectContent>
            </Select>
          {/snippet}
        </FormControl>
        <FormFieldErrors class="text-xs"/>
      </FormField>
      <FormField {form} name="vendorRating" class="flex flex-col w-full">
        <FormControl>
          {#snippet children({ props })}
            <FormLabel>Rating</FormLabel>
            <Select
              type="single"
              bind:value={$formData.vendorRating}
              name={props.name}
            >
              <SelectTrigger {...props} class="flex w-full">
                {selectedRating} stars
              </SelectTrigger>
              <SelectContent>
                {#each vendorRatingEnum as option (option.value)}
                  <SelectItem value={option.value}>
                    {option.label} stars
                  </SelectItem>
                {/each}
              </SelectContent>
            </Select>
          {/snippet}
        </FormControl>
        <FormFieldErrors class="text-xs"/>
      </FormField>
    </div>
    <DialogFooter>
      <FormButton disabled={isLoading}>
        {isLoading ? "Creating..." : "Add New Vendor"}
      </FormButton>
    </DialogFooter>
  </form>
</DialogContent>
