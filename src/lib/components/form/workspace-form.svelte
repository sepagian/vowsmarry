<script lang="ts">
	import { superForm } from "sveltekit-superforms";
	import { valibot } from "sveltekit-superforms/adapters";

	import { FormControl, FormField, FormFieldErrors, FormLabel } from "$lib/components/ui/form/index";
	import { Input } from "$lib/components/ui/input/index";
	import { InputGroup, InputGroupAddon, InputGroupInput } from "$lib/components/ui/input-group/index";

	import { FormToasts } from "$lib/utils/toasts";
	import { workspaceSchema } from "$lib/validation/workspace";

	let { data, onSuccess = $bindable() } = $props();

	const form = superForm(data.workspaceForm, {
		validators: valibot(workspaceSchema),
		dataType: "json",
		onUpdate: ({ form: f }) => {
			if (f.valid) {
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

	// Note: Client-side slug validation is disabled for now
	// Server-side validation in the createWorkspace action will handle slug uniqueness
	// This avoids issues with Better Auth's checkSlug API response format
</script>

<form
	id="workspace-form"
	use:enhance
	method="POST"
	action="?/updateOrganizationWorkspace"
	class="flex flex-col gap-4"
>
	<div class="flex flex-col sm:flex-row w-full gap-2">
		<FormField {form} name="workspaceName" class="w-full">
			<FormControl>
				{#snippet children({ props })}
					<FormLabel>Wedding Title</FormLabel>
					<Input {...props} type="text" bind:value={$formData.workspaceName} />
				{/snippet}
			</FormControl>
			<FormFieldErrors class="text-xs text-red-500 text-left"/>
		</FormField>
		<FormField {form} name="slug" class="w-full">
			<FormControl>
				{#snippet children({ props })}
					<FormLabel>Wedding Invitation Slug</FormLabel>
					<InputGroup>
						<InputGroupInput {...props} bind:value={$formData.slug} />
						<InputGroupAddon align="inline-end">.vowsmarry.id</InputGroupAddon>
					</InputGroup>
					<p class="text-xs text-left mt-1 text-muted-foreground">
						Your unique wedding invitation URL
					</p>
				{/snippet}
			</FormControl>
			<FormFieldErrors class="text-xs text-red-500 text-left"/>
		</FormField>
	</div>
</form>
