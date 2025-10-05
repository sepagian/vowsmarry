<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index';
	import { buttonVariants } from '$lib/components/ui/button/index';
	import * as Card from '$lib/components/ui/card/index';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import * as Dialog from '$lib/components/ui/dialog/index';
	import type { DocType } from '$lib/types';
	import { docTypeOptions } from '$lib/constants/constants';
	import DialogDocument from '../dialog/dialog-document.svelte';

	let { docsCards, data } = $props();

	const dropdownItem: {
		label: string;
		icon: string;
		color?: string;
	}[] = [
		{
			label: 'View',
			icon: 'i-lucide:eye',
		},
		{
			label: 'Edit',
			icon: 'i-lucide:edit',
		},
		{
			label: 'Delete',
			icon: 'i-lucide:trash2',
			color: 'hover:bg-red-100 text-red-800',
		},
	];

	function getTypeInfo(type: DocType) {
		return docTypeOptions.find((s) => s.value === type);
	}

	function getTypeColor(type: DocType): string {
		const colors = {
			'legal-formal': 'bg-green-50 text-green-700 border-green-200',
			'vendor-finance': 'bg-yellow-50 text-yellow-700 border-yellow-200',
			'guest-ceremony': 'bg-blue-50 text-blue-700 border-blue-200',
			'personal-keepsake': 'bg-red-50 text-red-700 border-red-200',
		};
		return colors[type] || 'bg-gray-50 text-gray-700 border-gray-200';
	}
</script>

<div class="flex flex-col gap-2 px-4">
	<div class="flex justify-between items-center">
		<h2 class="text-base font-bold text-neutral-600">Uploaded Documents</h2>
		<div class="flex flex-1 items-center justify-end gap-4">
			<Dialog.Root>
				<Dialog.Trigger class={buttonVariants({ variant: 'outline', size: 'default' })}>
					<div class="i-lucide:plus p-2"></div>
					<span class="hidden lg:inline">Upload New Document</span>
				</Dialog.Trigger>
				<DialogDocument {data} />
			</Dialog.Root>
		</div>
	</div>

	<div class="flex gap-4 flex-col sm:grid md:grid lg:grid-cols-3 xl:grid-cols-4">
		{#each docsCards as data (data.description)}
			<Card.Root
				class="@container/card shrink-0 w-full sm:w-auto gap-2 flex flex-col p-2 shadow-none "
			>
				<Card.Header class="flex flex-col gap-3 px-0">
					<div class="inline-flex min-h-[8rem] sm:min-h-[6rem] rounded-lg w-full bg-gray-100"></div>
				</Card.Header>
				<Card.Footer class="flex-col items-start text-sm justify-start p-0 gap-2.5">
					<div class="flex justify-between w-full items-center">
						<div class="inline-flex gap-1 items-center text-xs truncate text-gray-600">
							<Badge
								variant="outline"
								class={`${getTypeColor(data.type)} text-xs px-1 py-1 w-fit flex items-center gap-1`}
							>
								<div class={`${getTypeInfo(data.type)?.icon} w-3 h-3`}></div>
							</Badge>
							<Card.Description class="text-sm font-semibold truncate overflow-hidden">
								{data.description}
							</Card.Description>
						</div>
						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								<div class="i-lucide:more-vertical bg-gray-500"></div>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content>
								<DropdownMenu.Group>
									{#each dropdownItem as item (item.label)}
										<DropdownMenu.Item class={item.color}>
											<div class={item.icon}></div>
											{item.label}
										</DropdownMenu.Item>
									{/each}
								</DropdownMenu.Group>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</div>
				</Card.Footer>
			</Card.Root>
		{/each}
	</div>
</div>
