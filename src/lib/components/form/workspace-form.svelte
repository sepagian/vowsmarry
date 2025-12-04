<script lang="ts">
	import * as Form from '$lib/components/ui/form/index';
	import * as InputGroup from '$lib/components/ui/input-group/index';
	import { Input } from '$lib/components/ui/input/index';
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { FormToasts } from '$lib/utils/toasts';
	import { workspaceSchema } from '$lib/validation/workspace';

	let { data, onSuccess = $bindable() } = $props();

	const form = superForm(data.workspaceForm, {
		validators: valibot(workspaceSchema),
		dataType: 'json',
		onUpdate: async ({ form: f }) => {
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
	action="?/createWorkspace"
	class="flex flex-col gap-4"
>
	<div class="flex flex-col sm:flex-row w-full gap-2">
		<Form.Field
			{form}
			name="workspaceName"
			class="w-full"
		>
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Wedding Title</Form.Label>
					<Input
						{...props}
						type="text"
						bind:value={$formData.workspaceName}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500 text-left" />
		</Form.Field>
		<Form.Field
			{form}
			name="slug"
			class="w-full"
		>
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Wedding Invitation Slug</Form.Label>
					<InputGroup.Root>
						<InputGroup.Input
							{...props}
							bind:value={$formData.slug}
						/>
						<InputGroup.Addon align="inline-end">.vowsmarry.id</InputGroup.Addon>
					</InputGroup.Root>
					<p class="text-xs text-left mt-1 text-muted-foreground">
						Your unique wedding invitation URL
					</p>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500 text-left" />
		</Form.Field>
	</div>
</form>
