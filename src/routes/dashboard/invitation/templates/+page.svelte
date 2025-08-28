<script lang="ts">
	// Dummy template data
	const templates = [
		{
			id: 1,
			name: 'Classic Elegance',
			category: 'Traditional',
			style: 'Formal',
			colors: ['Gold', 'Cream', 'White'],
			preview: '/placeholder-template-1.jpg',
			price: 150000,
			features: ['Digital Download', 'Print Ready', 'Customizable Text', 'RSVP Card'],
			rating: 4.8,
			reviews: 124,
			isPopular: true
		},
		{
			id: 2,
			name: 'Modern Minimalist',
			category: 'Contemporary',
			style: 'Casual',
			colors: ['Black', 'White', 'Gray'],
			preview: '/placeholder-template-2.jpg',
			price: 120000,
			features: ['Digital Download', 'Mobile Optimized', 'Social Media Ready'],
			rating: 4.6,
			reviews: 89,
			isPopular: false
		},
		{
			id: 3,
			name: 'Floral Romance',
			category: 'Romantic',
			style: 'Semi-formal',
			colors: ['Pink', 'Green', 'White'],
			preview: '/placeholder-template-3.jpg',
			price: 180000,
			features: ['Digital Download', 'Print Ready', 'Watercolor Design', 'Thank You Card'],
			rating: 4.9,
			reviews: 156,
			isPopular: true
		},
		{
			id: 4,
			name: 'Rustic Charm',
			category: 'Rustic',
			style: 'Casual',
			colors: ['Brown', 'Cream', 'Green'],
			preview: '/placeholder-template-4.jpg',
			price: 135000,
			features: ['Digital Download', 'Kraft Paper Style', 'Hand-drawn Elements'],
			rating: 4.7,
			reviews: 92,
			isPopular: false
		},
		{
			id: 5,
			name: 'Luxury Gold',
			category: 'Luxury',
			style: 'Formal',
			colors: ['Gold', 'Black', 'White'],
			preview: '/placeholder-template-5.jpg',
			price: 250000,
			features: ['Digital Download', 'Foil Effect', 'Premium Design', 'Full Suite'],
			rating: 4.9,
			reviews: 78,
			isPopular: true
		},
		{
			id: 6,
			name: 'Beach Vibes',
			category: 'Destination',
			style: 'Casual',
			colors: ['Blue', 'Sand', 'White'],
			preview: '/placeholder-template-6.jpg',
			price: 110000,
			features: ['Digital Download', 'Tropical Theme', 'Destination Ready'],
			rating: 4.5,
			reviews: 67,
			isPopular: false
		}
	];

	const categories = ['All', 'Traditional', 'Contemporary', 'Romantic', 'Rustic', 'Luxury', 'Destination'];
	let selectedCategory = 'All';
	let selectedTemplate = null;

	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(amount);
	}

	$: filteredTemplates = selectedCategory === 'All' 
		? templates 
		: templates.filter(t => t.category === selectedCategory);
</script>

<div class="flex flex-1 flex-col gap-4 p-4">
	<!-- Header -->
	<div class="flex flex-col gap-2">
		<h1 class="text-2xl font-semibold">Invitation Templates</h1>
		<p class="text-muted-foreground">Choose from our collection of beautiful wedding invitation templates.</p>
	</div>

	<!-- Template Stats -->
	<div class="grid gap-4 md:grid-cols-4">
		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Total Templates</p>
				<svg class="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
				</svg>
			</div>
			<p class="text-2xl font-bold">{templates.length}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Popular</p>
				<span class="text-lg">⭐</span>
			</div>
			<p class="text-2xl font-bold">{templates.filter(t => t.isPopular).length}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Categories</p>
				<svg class="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
					<path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
				</svg>
			</div>
			<p class="text-2xl font-bold">{categories.length - 1}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Avg Rating</p>
				<span class="text-lg">⭐</span>
			</div>
			<p class="text-2xl font-bold">{(templates.reduce((sum, t) => sum + t.rating, 0) / templates.length).toFixed(1)}</p>
		</div>
	</div>

	<!-- Category Filter -->
	<div class="rounded-lg border bg-card p-4">
		<h2 class="text-lg font-semibold mb-3">Filter by Category</h2>
		<div class="flex flex-wrap gap-2">
			{#each categories as category}
				<button
					class="px-3 py-1 text-sm font-medium rounded-lg border transition-colors {selectedCategory === category ? 'bg-foreground text-background' : 'hover:bg-muted/50'}"
					on:click={() => selectedCategory = category}
				>
					{category}
				</button>
			{/each}
		</div>
	</div>

	<!-- Template Grid -->
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each filteredTemplates as template}
			<div class="rounded-lg border bg-card overflow-hidden hover:shadow-lg transition-shadow">
				<!-- Template Preview -->
				<div class="aspect-[3/4] bg-muted relative">
					{#if template.isPopular}
						<div class="absolute top-2 left-2 px-2 py-1 bg-foreground text-background text-xs font-medium rounded">
							Popular
						</div>
					{/if}
					<div class="absolute inset-0 flex items-center justify-center">
						<svg class="w-16 h-16 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
						</svg>
					</div>
				</div>
				
				<!-- Template Info -->
				<div class="p-4">
					<div class="flex items-start justify-between mb-2">
						<div>
							<h3 class="font-semibold">{template.name}</h3>
							<p class="text-sm text-muted-foreground">{template.category} • {template.style}</p>
						</div>
						<div class="text-right">
							<p class="font-bold">{formatCurrency(template.price)}</p>
						</div>
					</div>
					
					<!-- Colors -->
					<div class="flex items-center gap-2 mb-3">
						<span class="text-xs text-muted-foreground">Colors:</span>
						{#each template.colors as color}
							<span class="px-2 py-0.5 text-xs bg-muted rounded">{color}</span>
						{/each}
					</div>
					
					<!-- Rating -->
					<div class="flex items-center gap-2 mb-3">
						<div class="flex items-center gap-1">
							<span class="text-sm">⭐</span>
							<span class="text-sm font-medium">{template.rating}</span>
						</div>
						<span class="text-xs text-muted-foreground">({template.reviews} reviews)</span>
					</div>
					
					<!-- Features -->
					<div class="mb-4">
						<p class="text-xs text-muted-foreground mb-1">Features:</p>
						<div class="flex flex-wrap gap-1">
							{#each template.features as feature}
								<span class="px-1 py-0.5 text-xs bg-muted rounded">{feature}</span>
							{/each}
						</div>
					</div>
					
					<!-- Actions -->
					<div class="flex gap-2">
						<button class="flex-1 px-3 py-2 border rounded-lg hover:bg-muted/50 transition-colors text-sm">
							Preview
						</button>
						<button class="flex-1 px-3 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors text-sm">
							Select
						</button>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Custom Template Option -->
	<div class="rounded-lg border bg-card p-4">
		<div class="text-center">
			<svg class="w-12 h-12 mx-auto mb-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
			</svg>
			<h3 class="text-lg font-semibold mb-2">Need Something Custom?</h3>
			<p class="text-muted-foreground mb-4">Work with our designers to create a unique invitation just for you.</p>
			<button class="px-6 py-2 border rounded-lg hover:bg-muted/50 transition-colors">
				Request Custom Design
			</button>
		</div>
	</div>
</div>