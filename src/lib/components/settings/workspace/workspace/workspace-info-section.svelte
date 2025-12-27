<script lang="ts">
	import { page } from '$app/stores';
	import * as Form from '$lib/components/ui/form/index';
	import * as InputGroup from '$lib/components/ui/input-group/index';
	import { Separator } from '$lib/components/ui/separator/index';
	import { Input } from '$lib/components/ui/input/';
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { workspaceInfoSchema } from '$lib/validation/workspace';
	import { invalidateAll } from '$app/navigation';

	const { workspaceInfoForm } = $page.data;

	const form = superForm(workspaceInfoForm, {
		validators: valibot(workspaceInfoSchema),
		onResult: async ({ result }) => {
			if (result.type === 'success' && result.data?.success) {
				toast.success(result.data.message || 'Workspace information updated successfully');
				await invalidateAll();
			} else if (result.type === 'failure') {
				toast.error(result.data?.message || 'Failed to update workspace information');
			}
		},
		onError: () => {
			toast.error('An error occurred while updating workspace information');
		},
	});

	const { form: formData, enhance } = form;
</script>

<form
	method="POST"
	action="?/updateWorkspaceInfo"
	use:enhance
	class="flex flex-col gap-4"
>
	<div class="flex flex-col">
		<h1 class="font-extrabold text-xl">Workspace Info</h1>
		<span class="text-muted-foreground text-sm"
			>Name your workspace and choose a short, memorable link for your wedding setup.</span
		>
	</div>

	<div class="grid gap-6">
		<Form.Field
			{form}
			name="groomName"
		>
			<Form.Control>
				{#snippet children({ props })}
					<div class="flex flex-col sm:flex-row gap-2 align-center">
						<div class="flex flex-col flex-1 gap-1">
							<Form.Label>Groom Name</Form.Label>
							<Form.Description>The groom's name</Form.Description>
						</div>
						<div class="flex-1">
							<Input
								{...props}
								type="text"
								bind:value={$formData.groomName}
								placeholder="John"
							/>
						</div>
					</div>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500" />
		</Form.Field>

		<Form.Field
			{form}
			name="brideName"
		>
			<Form.Control>
				{#snippet children({ props })}
					<div class="flex flex-col sm:flex-row gap-2 align-center">
						<div class="flex flex-col flex-1 gap-1">
							<Form.Label>Bride Name</Form.Label>
							<Form.Description>The bride's name</Form.Description>
						</div>
						<div class="flex-1">
							<Input
								{...props}
								type="text"
								bind:value={$formData.brideName}
								placeholder="Jane"
							/>
						</div>
					</div>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500" />
		</Form.Field>

		<Form.Field
			{form}
			name="workspaceName"
		>
			<Form.Control>
				{#snippet children({ props })}
					<div class="flex flex-col sm:flex-row gap-2 align-center">
						<div class="flex flex-col flex-1 gap-1">
							<Form.Label>Wedding Title</Form.Label>
							<Form.Description
								>A name for your wedding workspace, something that feels like you.</Form.Description
							>
						</div>
						<div class="flex-1">
							<Input
								{...props}
								type="text"
								bind:value={$formData.workspaceName}
								placeholder="John & Jane Wedding"
							/>
						</div>
					</div>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500" />
		</Form.Field>

		<Form.Field
			{form}
			name="slug"
		>
			<Form.Control>
				{#snippet children({ props })}
					<div class="flex flex-col sm:flex-row gap-2 align-center">
						<div class="flex flex-col flex-1 gap-1">
							<Form.Label>Invitation Link</Form.Label>
							<Form.Description
								>This becomes your unique invitation address. Keep it simple and meaningful.</Form.Description
							>
						</div>
						<div class="flex-1">
							<InputGroup.Root>
								<InputGroup.Input
									{...props}
									bind:value={$formData.slug}
									placeholder="johnandjane"
								/>
								<InputGroup.Addon align="inline-end">.vowsmarry.id</InputGroup.Addon>
							</InputGroup.Root>
						</div>
					</div>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500" />
		</Form.Field>
	</div>

	<Separator />
</form>
