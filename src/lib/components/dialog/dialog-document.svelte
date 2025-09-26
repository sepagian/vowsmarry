<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as Select from '$lib/components/ui/select/index';
	import { Button } from '$lib/components/ui/button/index';
	import { Input } from '$lib/components/ui/input/index';
	import { Label } from '$lib/components/ui/label/index';
	import { docTypeOptions } from '$lib/constants/constants';
	import type { DocType } from '$lib/types';

	let docTypeValue = $state<DocType | ''>('');
	let description = $state('');
	let date = $state('');
	let fileUrl = $state('');

	const triggerDocType = $derived(
		docTypeValue
			? docTypeOptions.find((d) => d.value === docTypeValue)?.label
			: 'Pick a document type',
	);
</script>

<Dialog.Content class="sm:max-w-[425px] bg-neutral-100">
	<Dialog.Header>
		<Dialog.Title>Add New Document</Dialog.Title>
		<Dialog.Description>
			<p>Add a new document to track your wedding paperwork.</p>
		</Dialog.Description>
	</Dialog.Header>
	<div class="flex flex-col gap-4 py-4">
		<div class="flex flex-col items-start gap-2">
			<Label
				for="documentDescription"
				class="text-right">Document Description *</Label
			>
			<Input
				id="documentDescription"
				bind:value={description}
				placeholder="e.g. Marriage License"
				class="col-span-3"
			/>
		</div>
		<div class="flex flex-col gap-2">
			<Label
				for="documentCategory"
				class="text-right">Category</Label
			>
			<Select.Root
				type="single"
				name="documentCategory"
				bind:value={docTypeValue}
			>
				<Select.Trigger
					class="w-full"
					aria-label="Document Category"
				>
					{triggerDocType}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						{#each docTypeOptions as docType (docType.value)}
							<Select.Item
								value={docType.value}
								label={docType.label}
							>
								{docType.label}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		</div>
		<div class="flex flex-col gap-2">
			<Label
				for="documentDate"
				class="text-right">Date</Label
			>
			<Input
				type="date"
				id="documentDate"
				bind:value={date}
				class="w-full"
				placeholder="Select date..."
			/>
		</div>
		<div class="flex flex-col gap-2">
			<Label
				for="documentFileUrl"
				class="text-right">File URL</Label
			>
			<Input
				id="documentFileUrl"
				bind:value={fileUrl}
				placeholder="https://example.com/file.pdf"
				class="col-span-3"
			/>
		</div>
	</div>
	<Dialog.Footer>
		<Button type="submit">Add Document</Button>
	</Dialog.Footer>
</Dialog.Content>
