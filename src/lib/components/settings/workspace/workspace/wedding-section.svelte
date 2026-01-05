<script lang="ts">
  import { page } from "$app/stores";
  import * as Form from "$lib/components/ui/form/index";
  import { cn } from "$lib/utils/utils";
  import { Input } from "$lib/components/ui/input/index";
  import CurrencyInput from "@canutin/svelte-currency-input";
  import { Separator } from "$lib/components/ui/separator";
  import { superForm } from "sveltekit-superforms";
  import { valibot } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import { weddingDetailsSchema } from "$lib/validation/workspace";
  import { invalidateAll } from "$app/navigation";

  const { weddingDetailsForm } = $page.data;

  const form = superForm(weddingDetailsForm, {
    validators: valibot(weddingDetailsSchema),
    onResult: async ({ result }) => {
      if (result.type === "success" && result.data?.success) {
        toast.success(
          result.data.message || "Wedding details updated successfully"
        );
        await invalidateAll();
      } else if (result.type === "failure") {
        toast.error(result.data?.message || "Failed to update wedding details");
      }
    },
    onError: () => {
      toast.error("An error occurred while updating wedding details");
    },
  });

  const { form: formData, enhance } = form;
</script>

<form
  method="POST"
  action="?/updateWeddingDetails"
  use:enhance
  class="flex flex-col gap-4"
>
  <div class="flex flex-col">
    <h1 class="font-extrabold text-xl">Wedding Details</h1>
    <span class="text-muted-foreground text-sm"
      >These details help shape your timeline, invitations, and shared moments.</span
    >
  </div>

  <div class="grid gap-6">
    <Form.Field {form} name="weddingDate">
      <Form.Control>
				{#snippet children({ props })}
					<div class="flex flex-col sm:flex-row gap-2 align-center">
						<div class="flex flex-col flex-1 gap-1">
							<Form.Label>Wedding Date</Form.Label>
							<Form.Description>When will your day unfold?</Form.Description>
						</div>
						<div class="flex-1">
							<Input
								{...props}
								type="date"
								bind:value={$formData.weddingDate}
							/>
						</div>
					</div>
				{/snippet}
			</Form.Control>
      <Form.FieldErrors class="text-xs text-red-500"/>
    </Form.Field>

    <Form.Field {form} name="weddingVenue">
      <Form.Control>
				{#snippet children({ props })}
					<div class="flex flex-col sm:flex-row gap-2 align-center">
						<div class="flex flex-col flex-1 gap-1">
							<Form.Label>Wedding Location</Form.Label>
							<Form.Description>Where will your wedding take place?</Form.Description>
						</div>
						<div class="flex-1">
							<Input
								{...props}
								type="text"
								bind:value={$formData.weddingVenue}
								placeholder="Venue or City"
							/>
						</div>
					</div>
				{/snippet}
			</Form.Control>
      <Form.FieldErrors class="text-xs text-red-500"/>
    </Form.Field>

    <Form.Field {form} name="weddingBudget">
      <Form.Control>
				{#snippet children({ props })}
					<div class="flex flex-col sm:flex-row gap-2 align-center">
						<div class="flex flex-col flex-1 gap-1">
							<Form.Label>Wedding Budget</Form.Label>
							<Form.Description>Your total budget for the wedding</Form.Description>
						</div>
						<div class="flex-1">
							<CurrencyInput
								{...props}
								name="weddingBudget"
								bind:value={$formData.weddingBudget}
								locale="id-ID"
								currency="IDR"
								inputClasses={{
									formatted: cn(
										"border-input bg-background selection:bg-primary dark:bg-input/30 selection:text-primary-foreground ring-offset-background placeholder:text-muted-foreground flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
										"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
										"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
									),
									formattedPositive: "text-base",
								}}
							/>
						</div>
					</div>
				{/snippet}
			</Form.Control>
      <Form.FieldErrors class="text-xs text-red-500"/>
    </Form.Field>
  </div>

  <Separator/>
</form>
