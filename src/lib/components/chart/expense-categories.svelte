<script lang="ts">
	import { Progress } from '$lib/components/ui/progress';
	import { categoryOptions } from '$lib/constants/constants';

	const expenses = [
		{ category: 'Accommodation', spent: 0, budgeted: 0 },
		{ category: 'Catering', spent: 0, budgeted: 0 },
		{ category: 'Decoration', spent: 0, budgeted: 0 },
		{ category: 'Entertainment', spent: 0, budgeted: 0 },
		{ category: 'Makeup & Attire', spent: 0, budgeted: 0 },
		{ category: 'Paperwork', spent: 0, budgeted: 0 },
		{ category: 'Photo & Video', spent: 0, budgeted: 0 },
		{ category: 'Venue', spent: 0, budgeted: 0 },
		{ category: 'Miscellaneous', spent: 0, budgeted: 0 },
	];

	function percentage(spent: number, budgeted: number) {
		return budgeted > 0 ? Math.min((spent / budgeted) * 100, 100) : 0;
	}

	function getCategoryIcon(categoryName: string) {
		const category = categoryOptions.find((option) => option.label === categoryName);
		return category ? category.icon : 'i-lucide:help-circle';
	}
</script>

<div class="flex flex-col gap-4">
	{#each expenses as item (item.category)}
		<div>
			<div class="flex justify-between text-sm mb-1">
				<span class="flex items-center gap-2">
					<div class={getCategoryIcon(item.category)}></div>
					{item.category}
				</span>
				<span>{item.spent}/{item.budgeted}</span>
			</div>
			<Progress
				value={percentage(item.spent, item.budgeted)}
				max={100}
				class="[&[data-slot=progress]]:bg-blue-200 [&>[data-slot=progress-indicator]]:bg-blue-500"
			/>
		</div>
	{/each}
</div>
