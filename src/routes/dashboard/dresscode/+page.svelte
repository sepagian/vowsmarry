<script lang="ts">
	let { data } = $props();

	const dressCodes = data.dresscodes;
	const dresscodeStats = data.dresscodeStats;

	function getDresscodeTypeIcon(type: string | null) {
		switch (type) {
			case 'formal':
				return '🤵';
			case 'semi_formal':
				return '👗';
			case 'casual':
				return '👖';
			case 'traditional':
				return '🌿';
			default:
				return '🎨';
		}
	}

	function formatDate(dateString: string | Date | null) {
		if (!dateString) return 'No date set';
		return new Date(dateString).toLocaleDateString('id-ID');
	}

	function getColorDisplay(colors: string[] | null) {
		if (!colors || colors.length === 0) return 'No colors set';
		return colors.join(', ');
	}
</script>

<div class="flex flex-1 flex-col gap-4 p-4">
	<!-- Header -->
	<div class="flex flex-col gap-2">
		<h1 class="text-2xl font-semibold">Dresscode & Attire</h1>
		<p class="text-muted-foreground">Manage dress codes for different events and track wedding party outfits.</p>
	</div>

	<!-- Dresscode Statistics -->
	<div class="grid gap-4 md:grid-cols-4">
		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Total Dresscodes</p>
				<span class="text-lg">👗</span>
			</div>
			<p class="text-2xl font-bold">{dresscodeStats.total}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Formal Events</p>
				<span class="text-lg">🤵</span>
			</div>
			<p class="text-2xl font-bold">{(dresscodeStats.byType as any)?.formal || 0}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Traditional Events</p>
				<span class="text-lg">🌿</span>
			</div>
			<p class="text-2xl font-bold">{(dresscodeStats.byType as any)?.traditional || 0}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Custom Types</p>
				<span class="text-lg">🎨</span>
			</div>
			<p class="text-2xl font-bold">{(dresscodeStats.byType as any)?.custom || 0}</p>
		</div>
	</div>

	<!-- Event Dress Codes -->
	<div class="rounded-lg border bg-card p-4">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-lg font-semibold">Event Dress Codes</h2>
			<button class="text-sm font-medium hover:underline">Add Dress Code</button>
		</div>
		
		<div class="space-y-4">
			{#if dressCodes.length > 0}
				{#each dressCodes as dresscode}
				<div class="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
					<div class="flex items-start gap-4">
						<div class="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
							<span class="text-2xl">{getDresscodeTypeIcon(dresscode.dresscodeType)}</span>
						</div>
						
						<div class="flex-1">
							<div class="flex items-start justify-between mb-2">
								<div>
									<h3 class="font-semibold">{dresscode.eventName}</h3>
									<p class="text-sm text-muted-foreground">{dresscode.description}</p>
								</div>
								<span class="px-2 py-1 text-xs font-medium rounded bg-muted text-muted-foreground">
									{getColorDisplay(dresscode.colorScheme)}
								</span>
							</div>
							
							{#if dresscode.guestInstructions}
								<div class="p-3 bg-muted rounded-lg mb-3">
									<p class="text-sm"><strong>Guest Instructions:</strong></p>
									<p class="text-sm text-muted-foreground">{dresscode.guestInstructions}</p>
								</div>
							{/if}
							
							<div class="flex items-center justify-between text-sm text-muted-foreground">
								<div class="flex items-center gap-2">
									<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
									</svg>
									<span>Created: {formatDate(dresscode.createdAt)}</span>
								</div>
								<div class="flex gap-2">
									<span class="px-2 py-1 text-xs font-medium rounded bg-muted text-muted-foreground">
										{dresscode.dresscodeType || 'custom'}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/each}
			{:else}
				<div class="text-center py-8 text-muted-foreground">
					<div class="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3">
						<span class="text-2xl">👗</span>
					</div>
					<p class="font-medium mb-2">No dress codes yet</p>
					<p class="text-sm">Add your first dress code to get started!</p>
				</div>
			{/if}
		</div>
	</div>



	<!-- Add New Dress Code -->
	<div class="rounded-lg border bg-card p-4">
		<h3 class="text-lg font-semibold mb-3">Add New Dress Code</h3>
		<div class="grid gap-3 md:grid-cols-2">
			<div>
				<label for="dresscode-event-name" class="text-sm font-medium text-muted-foreground">Event Name</label>
				<input id="dresscode-event-name" type="text" placeholder="e.g., Wedding Ceremony" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
			<div>
				<label for="dresscode-color-theme" class="text-sm font-medium text-muted-foreground">Color Theme</label>
				<input id="dresscode-color-theme" type="text" placeholder="e.g., Navy Blue & Gold" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
		</div>
		<div class="mt-3">
			<label for="dresscode-description" class="text-sm font-medium text-muted-foreground">Description</label>
			<input id="dresscode-description" type="text" placeholder="Brief description of the dress code..." class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
		</div>
		<div class="mt-3">
			<label for="dresscode-instructions" class="text-sm font-medium text-muted-foreground">Guest Instructions</label>
			<textarea id="dresscode-instructions" placeholder="Detailed instructions for guests..." class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" rows="3"></textarea>
		</div>
		<div class="mt-3">
			<label for="dresscode-image" class="text-sm font-medium text-muted-foreground">Upload Inspiration Image</label>
			<input id="dresscode-image" type="file" accept=".jpg,.png,.jpeg" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
		</div>
		<button class="mt-3 px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors">
			Add Dress Code
		</button>
	</div>
</div>