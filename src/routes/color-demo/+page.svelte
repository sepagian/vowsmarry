<script lang="ts">
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';
</script>

<svelte:head>
	<title>Color System Demo</title>
</svelte:head>

<div class="min-h-screen bg-base-100 text-base-content p-8">
	<div class="max-w-6xl mx-auto">
		<!-- Header -->
		<div class="flex justify-between items-center mb-8">
			<h1 class="text-h1">Color System Demo</h1>
			<ThemeToggle variant="dropdown" showLabel />
		</div>

		<!-- Primary Colors -->
		<section class="mb-12">
			<h2 class="text-h2 mb-6">Primary Colors</h2>
			<div class="grid grid-cols-11 gap-2 mb-4">
				<div class="bg-primary-50 p-4 rounded text-center text-xs">50</div>
				<div class="bg-primary-100 p-4 rounded text-center text-xs">100</div>
				<div class="bg-primary-200 p-4 rounded text-center text-xs">200</div>
				<div class="bg-primary-300 p-4 rounded text-center text-xs">300</div>
				<div class="bg-primary-400 p-4 rounded text-center text-xs">400</div>
				<div class="bg-primary-500 p-4 rounded text-center text-xs text-white">500</div>
				<div class="bg-primary-600 p-4 rounded text-center text-xs text-white">600</div>
				<div class="bg-primary-700 p-4 rounded text-center text-xs text-white">700</div>
				<div class="bg-primary-800 p-4 rounded text-center text-xs text-white">800</div>
				<div class="bg-primary-900 p-4 rounded text-center text-xs text-white">900</div>
				<div class="bg-primary-950 p-4 rounded text-center text-xs text-white">950</div>
			</div>
		</section>

		<!-- Secondary Colors -->
		<section class="mb-12">
			<h2 class="text-h2 mb-6">Secondary Colors</h2>
			<div class="grid grid-cols-11 gap-2 mb-4">
				<div class="bg-secondary-50 p-4 rounded text-center text-xs">50</div>
				<div class="bg-secondary-100 p-4 rounded text-center text-xs">100</div>
				<div class="bg-secondary-200 p-4 rounded text-center text-xs">200</div>
				<div class="bg-secondary-300 p-4 rounded text-center text-xs">300</div>
				<div class="bg-secondary-400 p-4 rounded text-center text-xs">400</div>
				<div class="bg-secondary-500 p-4 rounded text-center text-xs text-white">500</div>
				<div class="bg-secondary-600 p-4 rounded text-center text-xs text-white">600</div>
				<div class="bg-secondary-700 p-4 rounded text-center text-xs text-white">700</div>
				<div class="bg-secondary-800 p-4 rounded text-center text-xs text-white">800</div>
				<div class="bg-secondary-900 p-4 rounded text-center text-xs text-white">900</div>
				<div class="bg-secondary-950 p-4 rounded text-center text-xs text-white">950</div>
			</div>
		</section>

		<!-- Neutral Colors -->
		<section class="mb-12">
			<h2 class="text-h2 mb-6">Neutral Colors</h2>
			<div class="grid grid-cols-11 gap-2 mb-4">
				<div class="bg-neutral-50 p-4 rounded text-center text-xs border">50</div>
				<div class="bg-neutral-100 p-4 rounded text-center text-xs">100</div>
				<div class="bg-neutral-200 p-4 rounded text-center text-xs">200</div>
				<div class="bg-neutral-300 p-4 rounded text-center text-xs">300</div>
				<div class="bg-neutral-400 p-4 rounded text-center text-xs">400</div>
				<div class="bg-neutral-500 p-4 rounded text-center text-xs text-white">500</div>
				<div class="bg-neutral-600 p-4 rounded text-center text-xs text-white">600</div>
				<div class="bg-neutral-700 p-4 rounded text-center text-xs text-white">700</div>
				<div class="bg-neutral-800 p-4 rounded text-center text-xs text-white">800</div>
				<div class="bg-neutral-900 p-4 rounded text-center text-xs text-white">900</div>
				<div class="bg-neutral-950 p-4 rounded text-center text-xs text-white">950</div>
			</div>
		</section>

		<!-- Semantic Colors -->
		<section class="mb-12">
			<h2 class="text-h2 mb-6">Semantic Colors</h2>
			<div class="grid grid-cols-4 gap-4">
				<div class="space-y-2">
					<h3 class="text-h4">Success</h3>
					<div class="bg-success p-4 rounded text-success-content text-center">Default</div>
					<div class="bg-success-100 p-4 rounded text-center text-xs">Light</div>
					<div class="bg-success-800 p-4 rounded text-center text-xs text-white">Dark</div>
				</div>
				<div class="space-y-2">
					<h3 class="text-h4">Warning</h3>
					<div class="bg-warning p-4 rounded text-warning-content text-center">Default</div>
					<div class="bg-warning-100 p-4 rounded text-center text-xs">Light</div>
					<div class="bg-warning-800 p-4 rounded text-center text-xs text-white">Dark</div>
				</div>
				<div class="space-y-2">
					<h3 class="text-h4">Error</h3>
					<div class="bg-error p-4 rounded text-error-content text-center">Default</div>
					<div class="bg-error-100 p-4 rounded text-center text-xs">Light</div>
					<div class="bg-error-800 p-4 rounded text-center text-xs text-white">Dark</div>
				</div>
				<div class="space-y-2">
					<h3 class="text-h4">Info</h3>
					<div class="bg-info p-4 rounded text-info-content text-center">Default</div>
					<div class="bg-info-100 p-4 rounded text-center text-xs">Light</div>
					<div class="bg-info-800 p-4 rounded text-center text-xs text-white">Dark</div>
				</div>
			</div>
		</section>

		<!-- Button Examples -->
		<section class="mb-12">
			<h2 class="text-h2 mb-6">Button Examples</h2>
			<div class="space-y-4">
				<div class="flex gap-4 flex-wrap">
					<button class="btn-primary px-4 py-2 rounded">Primary</button>
					<button class="btn-secondary px-4 py-2 rounded">Secondary</button>
					<button class="btn-accent px-4 py-2 rounded">Accent</button>
					<button class="btn-success px-4 py-2 rounded">Success</button>
					<button class="btn-warning px-4 py-2 rounded">Warning</button>
					<button class="btn-error px-4 py-2 rounded">Error</button>
					<button class="btn-info px-4 py-2 rounded">Info</button>
				</div>
				<div class="flex gap-4 flex-wrap">
					<button class="btn-outline-primary px-4 py-2 rounded">Outline Primary</button>
					<button class="btn-outline-secondary px-4 py-2 rounded">Outline Secondary</button>
					<button class="btn-outline-accent px-4 py-2 rounded">Outline Accent</button>
				</div>
				<div class="flex gap-4 flex-wrap">
					<button class="btn-ghost-primary px-4 py-2 rounded">Ghost Primary</button>
					<button class="btn-ghost-secondary px-4 py-2 rounded">Ghost Secondary</button>
					<button class="btn-ghost-accent px-4 py-2 rounded">Ghost Accent</button>
				</div>
			</div>
		</section>

		<!-- Surface Examples -->
		<section class="mb-12">
			<h2 class="text-h2 mb-6">Surface Examples</h2>
			<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div class="surface-primary p-4 rounded">
					<h4 class="font-semibold mb-2">Primary Surface</h4>
					<p class="text-sm">Content on primary surface</p>
				</div>
				<div class="surface-secondary p-4 rounded">
					<h4 class="font-semibold mb-2">Secondary Surface</h4>
					<p class="text-sm">Content on secondary surface</p>
				</div>
				<div class="surface-success p-4 rounded">
					<h4 class="font-semibold mb-2">Success Surface</h4>
					<p class="text-sm">Success message content</p>
				</div>
				<div class="surface-warning p-4 rounded">
					<h4 class="font-semibold mb-2">Warning Surface</h4>
					<p class="text-sm">Warning message content</p>
				</div>
			</div>
		</section>

		<!-- Text Examples -->
		<section class="mb-12">
			<h2 class="text-h2 mb-6">Text Examples</h2>
			<div class="space-y-2">
				<p class="text-base-content">Default text color</p>
				<p class="text-muted">Muted text color</p>
				<p class="text-subtle">Subtle text color</p>
				<p class="text-placeholder">Placeholder text color</p>
			</div>
		</section>
	</div>
</div>
