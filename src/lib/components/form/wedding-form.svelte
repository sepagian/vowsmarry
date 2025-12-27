<script lang="ts">
	import CurrencyInput from "@canutin/svelte-currency-input";
	import { superForm } from "sveltekit-superforms";
	import { valibot } from "sveltekit-superforms/adapters";

	import {
		FormControl,
		FormField,
		FormFieldErrors,
		FormLabel,
	} from "$lib/components/ui/form/index";
	import { Input } from "$lib/components/ui/input/index";

	import { FormToasts } from "$lib/utils/toasts";
	import { cn } from "$lib/utils/utils";
	import { weddingSchema } from "$lib/validation/planner";

	let { data, onSuccess = $bindable() } = $props();

	const form = superForm(data.weddingForm, {
		validators: valibot(weddingSchema),
		dataType: "json",
		onUpdate: async ({ form: f }) => {
			if (f.valid) {
				// Call success callback if provided
				if (onSuccess) {
					onSuccess();
				}
			} else {
				FormToasts.emptyFormError();
			}
		},
		onError: () => {
			FormToasts.emptyFormError();
		},
	});
	const { form: formData, enhance } = form;
</script>

<form
	id="wedding-form"
	use:enhance
	method="POST"
	action="?/createWeddingOrganization"
	class="flex flex-col gap-4"
>
	<div class="flex flex-col sm:flex-row w-full gap-2">
		<FormField {form} name="groomName" class="w-full">
			<FormControl>
				{#snippet children({ props })}
					<FormLabel>Groom Name</FormLabel>
					<Input {...props} type="text" bind:value={$formData.groomName} />
				{/snippet}
			</FormControl>
			<FormFieldErrors class="text-xs text-red-500 text-left"/>
		</FormField>
		<FormField {form} name="brideName" class="w-full">
			<FormControl>
				{#snippet children({ props })}
					<FormLabel>Bride Name</FormLabel>
					<Input {...props} type="text" bind:value={$formData.brideName} />
				{/snippet}
			</FormControl>
			<FormFieldErrors class="text-xs text-red-500 text-left"/>
		</FormField>
	</div>
	<div class="flex flex-row w-full gap-2">
		<FormField {form} name="weddingDate" class="w-full">
			<FormControl>
				{#snippet children({ props })}
					<FormLabel>Wedding Date</FormLabel>
					<Input {...props} type="date" bind:value={$formData.weddingDate} />
				{/snippet}
			</FormControl>
			<FormFieldErrors class="text-xs text-red-500 text-left"/>
		</FormField>
		<FormField {form} name="weddingVenue" class="w-full">
			<FormControl>
				{#snippet children({ props })}
					<FormLabel>Location</FormLabel>
					<Input {...props} type="text" bind:value={$formData.weddingVenue} />
				{/snippet}
			</FormControl>
			<FormFieldErrors class="text-xs text-red-500 text-left"/>
		</FormField>
	</div>

	<FormField {form} name="weddingBudget">
		<FormControl>
			{#snippet children({ props })}
				<FormLabel>Budget Allocated</FormLabel>
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
			{/snippet}
		</FormControl>
		<FormFieldErrors class="text-xs text-red-500 text-left"/>
	</FormField>
</form>
