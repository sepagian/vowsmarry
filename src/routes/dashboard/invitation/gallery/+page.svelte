<script lang="ts">
	// Dummy gallery data
	const photoCategories = [
		{ name: 'All', count: 24 },
		{ name: 'Engagement', count: 8 },
		{ name: 'Pre-wedding', count: 12 },
		{ name: 'Couple', count: 4 }
	];

	const photos = [
		{
			id: 1,
			title: 'Sunset Engagement',
			category: 'Engagement',
			uploadDate: '2024-08-15',
			size: '2.4 MB',
			dimensions: '1920x1080',
			photographer: 'John Photography',
			location: 'Beach Resort',
			isSelected: false,
			isFavorite: true
		},
		{
			id: 2,
			title: 'Garden Romance',
			category: 'Pre-wedding',
			uploadDate: '2024-08-18',
			size: '3.1 MB',
			dimensions: '1920x1280',
			photographer: 'Sarah Studios',
			location: 'Botanical Garden',
			isSelected: false,
			isFavorite: false
		},
		{
			id: 3,
			title: 'City Lights',
			category: 'Engagement',
			uploadDate: '2024-08-20',
			size: '2.8 MB',
			dimensions: '1920x1080',
			photographer: 'Urban Lens',
			location: 'Downtown',
			isSelected: false,
			isFavorite: true
		},
		{
			id: 4,
			title: 'Vintage Love',
			category: 'Pre-wedding',
			uploadDate: '2024-08-22',
			size: '2.2 MB',
			dimensions: '1920x1080',
			photographer: 'Classic Moments',
			location: 'Old Town',
			isSelected: false,
			isFavorite: false
		},
		{
			id: 5,
			title: 'Natural Beauty',
			category: 'Couple',
			uploadDate: '2024-08-25',
			size: '3.5 MB',
			dimensions: '1920x1280',
			photographer: 'Nature Focus',
			location: 'Mountain View',
			isSelected: false,
			isFavorite: true
		},
		{
			id: 6,
			title: 'Golden Hour',
			category: 'Pre-wedding',
			uploadDate: '2024-08-28',
			size: '2.9 MB',
			dimensions: '1920x1080',
			photographer: 'Light & Love',
			location: 'Countryside',
			isSelected: false,
			isFavorite: false
		}
	];

	let selectedCategory = 'All';
	let viewMode = 'grid'; // 'grid' or 'list'
	let selectedPhotos = [];

	$: filteredPhotos = selectedCategory === 'All' 
		? photos 
		: photos.filter(p => p.category === selectedCategory);

	$: favoritePhotos = photos.filter(p => p.isFavorite);
</script>

<div class="flex flex-1 flex-col gap-4 p-4">
	<!-- Header -->
	<div class="flex flex-col gap-2">
		<h1 class="text-2xl font-semibold">Photo Gallery</h1>
		<p class="text-muted-foreground">Manage your wedding photos for the invitation gallery.</p>
	</div>

	<!-- Gallery Stats -->
	<div class="grid gap-4 md:grid-cols-4">
		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Total Photos</p>
				<svg class="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
				</svg>
			</div>
			<p class="text-2xl font-bold">{photos.length}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Favorites</p>
				<span class="text-lg">❤️</span>
			</div>
			<p class="text-2xl font-bold">{favoritePhotos.length}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Categories</p>
				<svg class="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
					<path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
				</svg>
			</div>
			<p class="text-2xl font-bold">{photoCategories.length - 1}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Storage Used</p>
				<svg class="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
					<path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
				</svg>
			</div>
			<p class="text-2xl font-bold">18.2 MB</p>
			<p class="text-sm text-muted-foreground">of 100 MB</p>
		</div>
	</div>

	<!-- Controls -->
	<div class="rounded-lg border bg-card p-4">
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-4">
				<h2 class="text-lg font-semibold">Photo Collection</h2>
				<div class="flex items-center gap-2">
					<button
						class="p-2 rounded border {viewMode === 'grid' ? 'bg-foreground text-background' : 'hover:bg-muted/50'}"
						on:click={() => viewMode = 'grid'}
						aria-label="Switch to grid view"
					>
						<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
							<path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
						</svg>
					</button>
					<button
						class="p-2 rounded border {viewMode === 'list' ? 'bg-foreground text-background' : 'hover:bg-muted/50'}"
						on:click={() => viewMode = 'list'}
						aria-label="Switch to list view"
					>
						<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
						</svg>
					</button>
				</div>
			</div>
			<div class="flex gap-2">
				<button class="text-sm font-medium hover:underline">Upload Photos</button>
				<button class="text-sm font-medium hover:underline">Create Album</button>
			</div>
		</div>

		<!-- Category Filter -->
		<div class="flex flex-wrap gap-2 mb-4">
			{#each photoCategories as category}
				<button
					class="px-3 py-1 text-sm font-medium rounded-lg border transition-colors {selectedCategory === category.name ? 'bg-foreground text-background' : 'hover:bg-muted/50'}"
					on:click={() => selectedCategory = category.name}
				>
					{category.name} ({category.count})
				</button>
			{/each}
		</div>
	</div>

	<!-- Photo Grid/List -->
	{#if viewMode === 'grid'}
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each filteredPhotos as photo}
				<div class="rounded-lg border bg-card overflow-hidden hover:shadow-lg transition-shadow">
					<!-- Photo Preview -->
					<div class="aspect-[4/3] bg-muted relative">
						{#if photo.isFavorite}
							<div class="absolute top-2 right-2 text-red-500">
								<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
								</svg>
							</div>
						{/if}
						<div class="absolute inset-0 flex items-center justify-center">
							<svg class="w-12 h-12 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
							</svg>
						</div>
					</div>
					
					<!-- Photo Info -->
					<div class="p-3">
						<h3 class="font-medium mb-1">{photo.title}</h3>
						<div class="text-xs text-muted-foreground space-y-1">
							<p>{photo.category} • {photo.uploadDate}</p>
							<p>{photo.dimensions} • {photo.size}</p>
							<p>by {photo.photographer}</p>
						</div>
						
						<div class="flex gap-2 mt-3">
							<button class="flex-1 px-2 py-1 text-xs border rounded hover:bg-muted/50 transition-colors">
								Edit
							</button>
							<button class="flex-1 px-2 py-1 text-xs border rounded hover:bg-muted/50 transition-colors">
								Share
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="rounded-lg border bg-card">
			<div class="space-y-0">
				{#each filteredPhotos as photo, index}
					<div class="flex items-center gap-4 p-4 {index !== filteredPhotos.length - 1 ? 'border-b' : ''} hover:bg-muted/50 transition-colors">
						<div class="w-16 h-12 bg-muted rounded flex items-center justify-center">
							<svg class="w-6 h-6 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
							</svg>
						</div>
						
						<div class="flex-1">
							<div class="flex items-center gap-2 mb-1">
								<h3 class="font-medium">{photo.title}</h3>
								{#if photo.isFavorite}
									<span class="text-red-500">❤️</span>
								{/if}
							</div>
							<div class="flex items-center gap-4 text-sm text-muted-foreground">
								<span>{photo.category}</span>
								<span>{photo.uploadDate}</span>
								<span>{photo.dimensions}</span>
								<span>{photo.size}</span>
								<span>by {photo.photographer}</span>
							</div>
						</div>
						
						<div class="flex gap-2">
							<button class="px-3 py-1 text-sm border rounded hover:bg-muted/50 transition-colors">
								Edit
							</button>
							<button class="px-3 py-1 text-sm border rounded hover:bg-muted/50 transition-colors">
								Download
							</button>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Upload Area -->
	<div class="rounded-lg border bg-card p-8">
		<div class="text-center">
			<svg class="w-12 h-12 mx-auto mb-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
			</svg>
			<h3 class="text-lg font-semibold mb-2">Upload New Photos</h3>
			<p class="text-muted-foreground mb-4">Drag and drop your photos here, or click to browse</p>
			<button class="px-6 py-2 border rounded-lg hover:bg-muted/50 transition-colors">
				Choose Files
			</button>
			<p class="text-xs text-muted-foreground mt-2">Supports JPG, PNG up to 10MB each</p>
		</div>
	</div>
</div>