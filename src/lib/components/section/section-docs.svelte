<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index';
	import * as Card from '$lib/components/ui/card/index';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import { docTypeOptions } from '$lib/constants/constants';

	let {
		docsCards,
	}: {
		docsCards: {
			description: string;
			type: DocType;
			action?: string;
			footer: string;
		}[];
	} = $props();

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
	<div class="flex flex-col">
		<h2 class="text-base font-bold text-neutral-600">Uploaded Documents</h2>
	</div>

	<div class="flex gap-4 flex-col sm:grid md:grid lg:grid-cols-3 xl:grid-cols-4">
		{#each docsCards as data (data.description)}
			<Card.Root
				class="@container/card shrink-0 w-full sm:w-auto gap-2 flex flex-col py-4 px-4 shadow-none bg-zinc-50"
			>
				<Card.Header class="flex flex-col gap-3 px-0">
					<div class="inline-flex min-h-[4rem] w-full">
						<Card.Description class="text-sm font-semibold truncate overflow-hidden">
							{data.description}
						</Card.Description>
					</div>
				</Card.Header>
				<Card.Footer class="flex-col items-start text-sm justify-start p-0 gap-2.5">
					<div class="flex flex-col gap-2">
						<Badge
							variant="outline"
							class={`${getTypeColor(data.type)} border text-xs px-2 py-1 w-fit`}
						>
							{getTypeInfo(data.type)?.label || 'Unknown'}
						</Badge>
					</div>
					<div class="flex justify-between w-full items-center">
						<div class="flex gap-1 items-center text-xs text-gray-500">
							<div class="i-lucide:calendar w-3 h-3"></div>
							{data.footer}
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
