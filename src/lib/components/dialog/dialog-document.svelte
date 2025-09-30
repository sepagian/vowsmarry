<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as Form from '$lib/components/ui/form/index';
	import * as Select from '$lib/components/ui/select/index';
	import {
		displaySize,
		MEGABYTE,
		FileDropZone,
		type FileDropZoneProps,
	} from '$lib/components/ui/file-drop-zone';
	import { Input } from '$lib/components/ui/input/index';
	import { Button } from '$lib/components/ui/button/index';
	import { Progress } from '$lib/components/ui/progress/index';
	import { onDestroy } from 'svelte';
	import { SvelteDate } from 'svelte/reactivity';
	import { toast } from 'svelte-sonner';
	import { superForm, filesProxy } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { documentFormSchema, categorySchema } from '$lib/validation/document';

	let { data } = $props();

	const form = superForm(data.documentForm, {
		validators: zod4(documentFormSchema as any),
		onUpdate: ({ form: f }) => {
			if (f.valid) {
				toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
			} else {
				toast.error('Please fix the errors in the form.');
			}
		},
	});
	const { form: formData, enhance } = form;

	const selectedCategory = $derived(
		$formData.category
			? categorySchema[$formData.category as keyof typeof categorySchema]
			: 'Choose category',
	);

	const onUpload: FileDropZoneProps['onUpload'] = async (uploadedFiles) => {
		// we use set instead of an assignment since it accepts a File[]
		files.set([...Array.from($files), ...uploadedFiles]);
	};

	const onFileRejected: FileDropZoneProps['onFileRejected'] = async ({ reason, file }) => {
		toast.error(`${file.name} failed to upload!`, { description: reason });
	};

	const files = filesProxy(form, 'attachments');
</script>

<Dialog.Content class="w-full sm:w-[120rem] bg-neutral-100">
	<Dialog.Header>
		<Dialog.Title>Add New Document</Dialog.Title>
		<Dialog.Description>
			<p>Add a new document to track your wedding paperwork.</p>
		</Dialog.Description>
	</Dialog.Header>
	<form
		use:enhance
		method="POST"
		enctype="multipart/form-data"
		class="flex flex-col gap-2 py-4"
	>
		<Form.Field
			{form}
			name="name"
		>
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Description</Form.Label>
					<Input
						{...props}
						type="text"
						bind:value={$formData.name}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs text-red-500" />
		</Form.Field>
		<Form.Field
			{form}
			name="category"
		>
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Category</Form.Label>
					<Select.Root
						type="single"
						bind:value={$formData.category}
						name={props.name}
					>
						<Select.Trigger
							{...props}
							class="w-full"
						>
							{selectedCategory}
						</Select.Trigger>
						<Select.Content>
							{#each Object.entries(categorySchema) as [value, label] (label)}
								<Select.Item {value}>
									{label}
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<FileDropZone
			{onUpload}
			{onFileRejected}
			maxFileSize={2 * MEGABYTE}
			accept="image/*"
			maxFiles={1}
			fileCount={$files.length}
		>
			<div class="flex flex-col gap-2 w-full items-center justify-center">
				<div class="i-lucide:upload h-12 w-12 bg-neutral-500"></div>
				<div class="flex flex-col w-full gap-0 items-center justify-center">
					<h2 class="text-base font-bold text-neutral-500">
						Drag 'n' drop files here, or click to select files
					</h2>
					<span class="text-sm text-neutral-500">You can upload file up to 5 MB</span>
				</div>
			</div>
		</FileDropZone>
		<input
			name="attachments"
			type="file"
			bind:files={$files}
			class="hidden"
		/>
		<div class="flex flex-col gap-2">
			{#each Array.from($files) as file, i (file.name)}
				<div class="flex place-items-center justify-between gap-2">
					<div class="flex flex-col">
						<span>{file.name}</span>
						<span class="text-muted-foreground text-xs">{displaySize(file.size)}</span>
					</div>
					<Button
						variant="outline"
						size="icon"
						onclick={() => {
							// we use set instead of an assignment since it accepts a File[]
							files.set([...Array.from($files).slice(0, i), ...Array.from($files).slice(i + 1)]);
						}}
					>
						<div class="i-lucide:x"></div>
					</Button>
				</div>
			{/each}
		</div>
		<Dialog.Footer>
			<Form.Button type="submit">Add Document</Form.Button>
		</Dialog.Footer>
	</form>
</Dialog.Content>
