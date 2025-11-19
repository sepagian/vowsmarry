<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import { Badge } from '$lib/components/ui/badge/index';

	let { data } = $props();
	const { error } = data;

	// Category-based styling
	const categoryStyles = {
		password_reset: {
			bgColor: 'bg-orange-100 dark:bg-orange-900/20',
			iconColor: 'text-orange-600 dark:text-orange-400',
			titleColor: 'text-orange-900 dark:text-orange-100',
			badgeVariant: 'secondary' as const,
		},
		email_verification: {
			bgColor: 'bg-blue-100 dark:bg-blue-900/20',
			iconColor: 'text-blue-600 dark:text-blue-400',
			titleColor: 'text-blue-900 dark:text-blue-100',
			badgeVariant: 'secondary' as const,
		},
		authentication: {
			bgColor: 'bg-red-100 dark:bg-red-900/20',
			iconColor: 'text-red-600 dark:text-red-400',
			titleColor: 'text-red-900 dark:text-red-100',
			badgeVariant: 'destructive' as const,
		},
		network: {
			bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
			iconColor: 'text-yellow-600 dark:text-yellow-400',
			titleColor: 'text-yellow-900 dark:text-yellow-100',
			badgeVariant: 'secondary' as const,
		},
		server: {
			bgColor: 'bg-purple-100 dark:bg-purple-900/20',
			iconColor: 'text-purple-600 dark:text-purple-400',
			titleColor: 'text-purple-900 dark:text-purple-100',
			badgeVariant: 'secondary' as const,
		},
		generic: {
			bgColor: 'bg-gray-100 dark:bg-gray-900/20',
			iconColor: 'text-gray-600 dark:text-gray-400',
			titleColor: 'text-gray-900 dark:text-gray-100',
			badgeVariant: 'secondary' as const,
		},
	};

	const style =
		categoryStyles[error.category as keyof typeof categoryStyles] || categoryStyles.generic;

	// Format category for display
	const categoryLabel = error.category.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
</script>

<svelte:head>
	<title>Error - {error.title}</title>
	<meta
		name="description"
		content={error.description}
	/>
</svelte:head>

<div class="flex flex-col gap-8 max-w-md mx-auto">
	<!-- Error Icon and Header -->
	<div class="flex flex-col items-center gap-4 text-center">
		<div class="relative">
			<div
				class="mx-auto w-16 h-16 {style.bgColor} rounded-full flex items-center justify-center mb-2 shadow-sm"
			>
				<div class="{error.icon} w-8 h-8 {style.iconColor}"></div>
			</div>
			<!-- Category Badge -->
			<div class="absolute -bottom-1 -right-1">
				<Badge
					variant={style.badgeVariant}
					class="text-xs px-2 py-1"
				>
					{categoryLabel}
				</Badge>
			</div>
		</div>

		<div class="space-y-2">
			<h1 class="text-2xl font-bold {style.titleColor}">{error.title}</h1>
			<p class="text-muted-foreground text-balance text-sm leading-relaxed max-w-sm">
				{error.description}
			</p>
		</div>

		<!-- Context Information (if available) -->
		{#if error.context}
			<div class="mt-2 p-3 bg-muted rounded-lg border">
				<p class="text-xs text-muted-foreground font-mono">
					Context: {error.context}
				</p>
			</div>
		{/if}
	</div>

	<!-- Action Buttons -->
	<div class="flex flex-col gap-3">
		{#each error.actions as action, index}
			<Button
				href={action.href}
				variant={action.variant}
				size="lg"
				class="w-full {index === 0 ? 'shadow-sm' : ''}"
			>
				{action.label}
			</Button>
		{/each}
	</div>

	<!-- Additional Help Section -->
	<div class="mt-4 p-4 bg-muted/50 rounded-lg border border-dashed">
		<div class="flex items-start gap-3">
			<div class="i-lucide:info w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0"></div>
			<div class="text-sm text-muted-foreground">
				<p class="font-medium mb-1">Need more help?</p>
				<p class="text-xs leading-relaxed">
					If you continue to experience issues, please contact our support team with the error
					details above.
				</p>
			</div>
		</div>
	</div>
</div>
