<script lang="ts">
	import { visualTokens } from '$lib/design-tokens';

	// Sample data for demonstrating tokens
	const borderRadiusValues = Object.entries(visualTokens.borderRadius);
	const shadowValues = Object.entries(visualTokens.boxShadow).filter(([key]) => key !== 'inner');
	const opacityValues = Object.entries(visualTokens.opacity).filter(([key, value]) => 
		['10', '25', '50', '75', '90'].includes(key)
	);
	const animationDurations = Object.entries(visualTokens.animationDuration).slice(0, 6);
</script>

<div class="space-y-8">
	<!-- Border Radius Examples -->
	<section>
		<h3 class="text-xl font-semibold mb-4">Border Radius Tokens</h3>
		<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
			{#each borderRadiusValues as [key, value]}
				<div class="p-4 bg-base-100 border border-base-300 rounded-lg">
					<div class="flex items-center justify-between mb-3">
						<code class="text-sm font-mono bg-primary/20 px-2 py-1 rounded">{key}</code>
						<span class="text-sm text-base-content/70">{value}</span>
					</div>
					<div 
						class="w-16 h-16 bg-primary mx-auto" 
						style="border-radius: {value};"
					></div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Shadow Examples -->
	<section>
		<h3 class="text-xl font-semibold mb-4">Shadow Tokens</h3>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each shadowValues as [key, value]}
				<div class="p-4 bg-base-100 border border-base-300 rounded-lg">
					<div class="flex items-center justify-between mb-4">
						<code class="text-sm font-mono bg-secondary/20 px-2 py-1 rounded">{key}</code>
					</div>
					<div 
						class="w-full h-16 bg-white rounded-lg flex items-center justify-center text-sm font-medium"
						style="box-shadow: {value};"
					>
						Shadow {key}
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Opacity Examples -->
	<section>
		<h3 class="text-xl font-semibold mb-4">Opacity Tokens</h3>
		<div class="grid grid-cols-1 md:grid-cols-5 gap-4">
			{#each opacityValues as [key, value]}
				<div class="p-4 bg-base-100 border border-base-300 rounded-lg">
					<div class="flex items-center justify-between mb-3">
						<code class="text-sm font-mono bg-accent/20 px-2 py-1 rounded">{key}</code>
						<span class="text-sm text-base-content/70">{value}</span>
					</div>
					<div class="relative">
						<div class="w-full h-12 bg-neutral-200 rounded"></div>
						<div 
							class="absolute inset-0 bg-primary rounded"
							style="opacity: {value};"
						></div>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Animation Duration Examples -->
	<section>
		<h3 class="text-xl font-semibold mb-4">Animation Duration Tokens</h3>
		<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
			{#each animationDurations as [key, value]}
				<div class="p-4 bg-base-100 border border-base-300 rounded-lg">
					<div class="flex items-center justify-between mb-3">
						<code class="text-sm font-mono bg-warning/20 px-2 py-1 rounded">{key}ms</code>
					</div>
					<button 
						class="w-full h-12 bg-primary text-primary-content rounded transition-all hover:scale-105"
						style="transition-duration: {value};"
					>
						Hover me
					</button>
				</div>
			{/each}
		</div>
	</section>

	<!-- Interactive Examples -->
	<section>
		<h3 class="text-xl font-semibold mb-4">Interactive Examples</h3>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			<!-- Card with shadow and border radius -->
			<div class="rounded-card shadow-card p-6 bg-white">
				<h4 class="font-semibold mb-2">Card Component</h4>
				<p class="text-sm text-neutral-600">Using rounded-card and shadow-card shortcuts</p>
			</div>

			<!-- Button with interactive states -->
			<button class="interactive rounded-button shadow-button bg-primary text-primary-content px-6 py-3">
				Interactive Button
			</button>

			<!-- Glass morphism example -->
			<div class="glass p-6 relative">
				<div class="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg"></div>
				<div class="relative">
					<h4 class="font-semibold mb-2">Glass Effect</h4>
					<p class="text-sm">Using glass utility class</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Utility Shortcuts Demo -->
	<section>
		<h3 class="text-xl font-semibold mb-4">Utility Shortcuts</h3>
		<div class="space-y-4">
			<div class="border-default rounded-card p-4">
				<code class="text-sm bg-base-200 px-2 py-1 rounded">border-default rounded-card</code>
				<p class="mt-2 text-sm">Standard border and card border radius</p>
			</div>
			
			<div class="transition-smooth hover:shadow-lg p-4 bg-white rounded-lg border">
				<code class="text-sm bg-base-200 px-2 py-1 rounded">transition-smooth hover:shadow-lg</code>
				<p class="mt-2 text-sm">Hover to see smooth transition and shadow change</p>
			</div>
			
			<div class="interactive-lift p-4 bg-white rounded-lg border">
				<code class="text-sm bg-base-200 px-2 py-1 rounded">interactive-lift</code>
				<p class="mt-2 text-sm">Hover to see lift effect with shadow and transform</p>
			</div>
		</div>
	</section>
</div>