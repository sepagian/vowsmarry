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
    expenseSchema,
    expenseStatusEnum,
  } from "$lib/validation/planner";

  let { data, open = $bindable() } = $props();

  const queryClient = useQueryClient();

  const form = superForm(data.expenseForm, {
    validators: valibot(expenseSchema),
    resetForm: true,
    onResult: ({ result }) => {
      if (result.type === "success") {
        const expenseName = $formData.expenseDescription || "Expense";
        CrudToasts.success("create", "expense", { itemName: expenseName });
        queryClient.invalidateQueries({ queryKey: ["expenses"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        broadcastInvalidate(["expenses", "dashboard"]);
        open = false;
      } else if (result.type === "failure") {
        FormToasts.emptyFormError();
      } else if (result.type === "error") {
        CrudToasts.error(
          "create",
          "An error occurred while saving the expense",
          "expense"
        );
      }
    },
  });
  const { form: formData, enhance } = form;

  const selectedCategory = $derived(
    $formData.expenseCategory
      ? categoryEnum.find((c) => c.value === $formData.expenseCategory)?.label
      : "Choose category"
  );

  const selectedStatus = $derived(
    $formData.expensePaymentStatus
      ? expenseStatusEnum.find(
          (s) => s.value === $formData.expensePaymentStatus
        )?.label
      : "Select payment status"
  );
</script>

<DialogContent class="sm:max-w-[425px]">
  <DialogHeader>
    <DialogTitle>Add an Expense</DialogTitle>
    <DialogDescription>
      <p>Keep track of where the budget goes — from flowers to fireworks.</p>
    </DialogDescription>
  </DialogHeader>
  <form
    use:enhance
    method="POST"
    action="?/createExpense"
    class="flex flex-col gap-4"
    onsubmit={(e) => {
      if (!$formData.valid) {
        e.preventDefault();
      }
    }}
  >
    <FormField {form} name="expenseDescription">
      <FormControl>
        {#snippet children({ props })}
          <FormLabel>Description</FormLabel>
          <Input
            {...props}
            type="text"
            bind:value={$formData.expenseDescription}
          />
        {/snippet}
      </FormControl>
      <FormFieldErrors class="text-xs text-red-500"/>
    </FormField>
    <FormField {form} name="expenseAmount">
      <FormControl>
        {#snippet children({ props })}
          <FormLabel>Amount</FormLabel>
          <Input
            {...props}
            type="number"
            pattern="[0-9]*"
            bind:value={$formData.expenseAmount}
          />
        {/snippet}
      </FormControl>
      <FormFieldErrors class="text-xs text-red-500"/>
    </FormField>
    <div class="flex w-full gap-4">
      <FormField {form} name="expenseCategory" class="flex flex-col w-full">
        <FormControl>
          {#snippet children({ props })}
            <FormLabel>Category</FormLabel>
            <Select
              type="single"
              bind:value={$formData.expenseCategory}
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
        <FormFieldErrors/>
      </FormField>
      <FormField
        {form}
        name="expensePaymentStatus"
        class="flex flex-col w-full"
      >
        <FormControl>
          {#snippet children({ props })}
            <FormLabel>Payment Status</FormLabel>
            <Select
              type="single"
              bind:value={$formData.expensePaymentStatus}
              name={props.name}
            >
              <SelectTrigger {...props} class="flex w-full">
                {selectedStatus}
              </SelectTrigger>
              <SelectContent>
                {#each expenseStatusEnum as option (option.value)}
                  <SelectItem value={option.value}>
                    {option.label}
                  </SelectItem>
                {/each}
              </SelectContent>
            </Select>
          {/snippet}
        </FormControl>
        <FormFieldErrors/>
      </FormField>
    </div>
    <FormField {form} name="expenseDueDate">
      <FormControl>
        {#snippet children({ props })}
          <FormLabel>Date</FormLabel>
          <Input {...props} type="date" bind:value={$formData.expenseDueDate} />
        {/snippet}
      </FormControl>
      <FormFieldErrors class="text-xs text-red-500"/>
    </FormField>
    <DialogFooter>
      <FormButton>Add New Expense</FormButton>
    </DialogFooter>
  </form>
</DialogContent>
