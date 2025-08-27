<script lang="ts">
	// Dummy dresscode data
	const dressCodes = [
		{
			id: 1,
			eventName: 'Wedding Ceremony',
			description: 'Formal attire required. Men in suits, women in elegant dresses.',
			colorTheme: 'Navy Blue & Gold',
			imageUrl: '/images/ceremony-dresscode.jpg',
			guestInstructions: 'Please wear formal attire in navy blue or gold tones. Avoid white, cream, or ivory.',
			createdDate: '2024-08-15'
		},
		{
			id: 2,
			eventName: 'Wedding Reception',
			description: 'Semi-formal to formal attire. Cocktail dresses and dress shirts welcome.',
			colorTheme: 'Blush Pink & Sage Green',
			imageUrl: '/images/reception-dresscode.jpg',
			guestInstructions: 'Semi-formal attire in blush pink or sage green. Dancing shoes recommended!',
			createdDate: '2024-08-16'
		},
		{
			id: 3,
			eventName: 'Engagement Party',
			description: 'Smart casual attire. Comfortable yet stylish clothing.',
			colorTheme: 'Pastels & Neutrals',
			imageUrl: '/images/engagement-dresscode.jpg',
			guestInstructions: 'Smart casual in pastel or neutral colors. Garden party vibes!',
			createdDate: '2024-08-10'
		},
		{
			id: 4,
			eventName: 'Bridal Shower',
			description: 'Casual chic attire. Light and airy clothing preferred.',
			colorTheme: 'White & Soft Pink',
			imageUrl: '/images/bridal-shower-dresscode.jpg',
			guestInstructions: 'Casual chic in white or soft pink. Brunch-appropriate attire.',
			createdDate: '2024-08-12'
		}
	];

	const weddingPartyOutfits = [
		{
			role: 'Bride',
			outfit: 'Ivory silk wedding gown with cathedral train',
			designer: 'Vera Wang',
			status: 'ordered',
			fittingDate: '2024-09-15'
		},
		{
			role: 'Groom',
			outfit: 'Navy blue three-piece suit with gold accents',
			designer: 'Hugo Boss',
			status: 'fitted',
			fittingDate: '2024-08-25'
		},
		{
			role: 'Maid of Honor',
			outfit: 'Blush pink floor-length dress',
			designer: 'Dessy Collection',
			status: 'ordered',
			fittingDate: '2024-09-10'
		},
		{
			role: 'Best Man',
			outfit: 'Navy blue suit matching groom',
			designer: 'Hugo Boss',
			status: 'pending',
			fittingDate: '2024-09-05'
		}
	];

	function getStatusIcon(status: string) {
		switch (status) {
			case 'fitted':
				return '✅';
			case 'ordered':
				return '📦';
			default:
				return '⏳';
		}
	}
</script>

<div class="flex flex-1 flex-col gap-4 p-4">
	<!-- Header -->
	<div class="flex flex-col gap-2">
		<h1 class="text-2xl font-semibold">Dresscode & Attire</h1>
		<p class="text-muted-foreground">Manage dress codes for different events and track wedding party outfits.</p>
	</div>

	<!-- Wedding Party Outfits -->
	<div class="rounded-lg border bg-card p-4">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-lg font-semibold">Wedding Party Outfits</h2>
			<button class="text-sm font-medium hover:underline">Add Outfit</button>
		</div>
		
		<div class="grid gap-4 md:grid-cols-2">
			{#each weddingPartyOutfits as outfit}
				<div class="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
					<div class="flex items-start justify-between mb-3">
						<div>
							<h3 class="font-semibold">{outfit.role}</h3>
							<p class="text-sm text-muted-foreground">{outfit.outfit}</p>
							<p class="text-sm text-muted-foreground">by {outfit.designer}</p>
						</div>
						<div class="flex items-center gap-2">
							<span class="px-2 py-1 text-xs font-medium rounded bg-muted text-muted-foreground">
								{outfit.status}
							</span>
							<span class="text-lg">{getStatusIcon(outfit.status)}</span>
						</div>
					</div>
					
					<div class="flex items-center gap-2 text-sm text-muted-foreground">
						<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
						</svg>
						<span>Fitting: {outfit.fittingDate}</span>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Event Dress Codes -->
	<div class="rounded-lg border bg-card p-4">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-lg font-semibold">Event Dress Codes</h2>
			<button class="text-sm font-medium hover:underline">Add Dress Code</button>
		</div>
		
		<div class="space-y-4">
			{#each dressCodes as dresscode}
				<div class="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
					<div class="flex items-start gap-4">
						<div class="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
							<svg class="w-8 h-8 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
							</svg>
						</div>
						
						<div class="flex-1">
							<div class="flex items-start justify-between mb-2">
								<div>
									<h3 class="font-semibold">{dresscode.eventName}</h3>
									<p class="text-sm text-muted-foreground">{dresscode.description}</p>
								</div>
								<span class="px-2 py-1 text-xs font-medium rounded bg-muted text-muted-foreground">
									{dresscode.colorTheme}
								</span>
							</div>
							
							<div class="p-3 bg-muted rounded-lg mb-3">
								<p class="text-sm"><strong>Guest Instructions:</strong></p>
								<p class="text-sm text-muted-foreground">{dresscode.guestInstructions}</p>
							</div>
							
							<div class="flex items-center justify-between text-sm text-muted-foreground">
								<div class="flex items-center gap-2">
									<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
									</svg>
									<span>Created: {dresscode.createdDate}</span>
								</div>
								<div class="flex gap-2">
									<button class="hover:underline">Edit</button>
									<button class="hover:underline">Share</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Color Palette -->
	<div class="rounded-lg border bg-card p-4">
		<h2 class="text-lg font-semibold mb-4">Wedding Color Palette</h2>
		
		<div class="grid gap-4 md:grid-cols-2">
			<div>
				<h3 class="font-medium mb-3">Primary Colors</h3>
				<div class="flex gap-3">
					<div class="flex flex-col items-center">
						<div class="w-12 h-12 rounded-lg bg-slate-700 border"></div>
						<span class="text-xs text-muted-foreground mt-1">Navy Blue</span>
					</div>
					<div class="flex flex-col items-center">
						<div class="w-12 h-12 rounded-lg bg-yellow-400 border"></div>
						<span class="text-xs text-muted-foreground mt-1">Gold</span>
					</div>
					<div class="flex flex-col items-center">
						<div class="w-12 h-12 rounded-lg bg-white border"></div>
						<span class="text-xs text-muted-foreground mt-1">Ivory</span>
					</div>
				</div>
			</div>
			
			<div>
				<h3 class="font-medium mb-3">Accent Colors</h3>
				<div class="flex gap-3">
					<div class="flex flex-col items-center">
						<div class="w-12 h-12 rounded-lg bg-pink-200 border"></div>
						<span class="text-xs text-muted-foreground mt-1">Blush Pink</span>
					</div>
					<div class="flex flex-col items-center">
						<div class="w-12 h-12 rounded-lg bg-green-300 border"></div>
						<span class="text-xs text-muted-foreground mt-1">Sage Green</span>
					</div>
					<div class="flex flex-col items-center">
						<div class="w-12 h-12 rounded-lg bg-gray-300 border"></div>
						<span class="text-xs text-muted-foreground mt-1">Silver</span>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Add New Dress Code -->
	<div class="rounded-lg border bg-card p-4">
		<h3 class="text-lg font-semibold mb-3">Add New Dress Code</h3>
		<div class="grid gap-3 md:grid-cols-2">
			<div>
				<label class="text-sm font-medium text-muted-foreground">Event Name</label>
				<input type="text" placeholder="e.g., Wedding Ceremony" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
			<div>
				<label class="text-sm font-medium text-muted-foreground">Color Theme</label>
				<input type="text" placeholder="e.g., Navy Blue & Gold" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
		</div>
		<div class="mt-3">
			<label class="text-sm font-medium text-muted-foreground">Description</label>
			<input type="text" placeholder="Brief description of the dress code..." class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
		</div>
		<div class="mt-3">
			<label class="text-sm font-medium text-muted-foreground">Guest Instructions</label>
			<textarea placeholder="Detailed instructions for guests..." class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" rows="3"></textarea>
		</div>
		<div class="mt-3">
			<label class="text-sm font-medium text-muted-foreground">Upload Inspiration Image</label>
			<input type="file" accept=".jpg,.png,.jpeg" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
		</div>
		<button class="mt-3 px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors">
			Add Dress Code
		</button>
	</div>
</div>