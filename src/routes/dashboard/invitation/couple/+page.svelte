<script lang="ts">
	// Dummy couple data
	const coupleInfo = {
		bride: {
			name: 'Sarah Johnson',
			fullName: 'Sarah Elizabeth Johnson',
			nickname: 'Sarah',
			parents: 'Mr. & Mrs. Robert Johnson',
			birthDate: '1995-03-15',
			occupation: 'Marketing Manager',
			instagram: '@sarahjohnson',
			photo: '/placeholder-bride.jpg'
		},
		groom: {
			name: 'John Smith',
			fullName: 'John Michael Smith',
			nickname: 'John',
			parents: 'Mr. & Mrs. David Smith',
			birthDate: '1993-07-22',
			occupation: 'Software Engineer',
			instagram: '@johnsmith',
			photo: '/placeholder-groom.jpg'
		}
	};

	const relationshipMilestones = [
		{ date: '2018-05-12', event: 'First Met', description: 'Met at a coffee shop downtown' },
		{ date: '2018-08-20', event: 'First Date', description: 'Dinner at Italian restaurant' },
		{ date: '2019-02-14', event: 'Became Official', description: 'Valentine\'s Day confession' },
		{ date: '2020-12-25', event: 'Moved In Together', description: 'Christmas surprise' },
		{ date: '2023-06-10', event: 'Engagement', description: 'Proposal at sunset beach' }
	];
</script>

<div class="flex flex-1 flex-col gap-4 p-4">
	<!-- Header -->
	<div class="flex flex-col gap-2">
		<h1 class="text-2xl font-semibold">Couple Information</h1>
		<p class="text-muted-foreground">Manage bride and groom details for your wedding invitation.</p>
	</div>

	<!-- Couple Overview -->
	<div class="grid gap-4 md:grid-cols-2">
		<!-- Bride Information -->
		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center gap-3 mb-4">
				<div class="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
					<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
					</svg>
				</div>
				<div>
					<h2 class="text-lg font-semibold">Bride</h2>
					<p class="text-sm text-muted-foreground">Bride information</p>
				</div>
			</div>
			
			<div class="space-y-3">
				<div>
					<p class="text-sm font-medium text-muted-foreground">Full Name</p>
					<p class="font-medium">{coupleInfo.bride.fullName}</p>
				</div>
				<div>
					<p class="text-sm font-medium text-muted-foreground">Nickname</p>
					<p class="font-medium">{coupleInfo.bride.nickname}</p>
				</div>
				<div>
					<p class="text-sm font-medium text-muted-foreground">Parents</p>
					<p class="font-medium">{coupleInfo.bride.parents}</p>
				</div>
				<div>
					<p class="text-sm font-medium text-muted-foreground">Occupation</p>
					<p class="font-medium">{coupleInfo.bride.occupation}</p>
				</div>
				<div>
					<p class="text-sm font-medium text-muted-foreground">Instagram</p>
					<p class="font-medium">{coupleInfo.bride.instagram}</p>
				</div>
			</div>
			
			<button class="mt-4 w-full px-4 py-2 border rounded-lg hover:bg-muted/50 transition-colors">
				Edit Bride Info
			</button>
		</div>

		<!-- Groom Information -->
		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center gap-3 mb-4">
				<div class="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
					<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
					</svg>
				</div>
				<div>
					<h2 class="text-lg font-semibold">Groom</h2>
					<p class="text-sm text-muted-foreground">Groom information</p>
				</div>
			</div>
			
			<div class="space-y-3">
				<div>
					<p class="text-sm font-medium text-muted-foreground">Full Name</p>
					<p class="font-medium">{coupleInfo.groom.fullName}</p>
				</div>
				<div>
					<p class="text-sm font-medium text-muted-foreground">Nickname</p>
					<p class="font-medium">{coupleInfo.groom.nickname}</p>
				</div>
				<div>
					<p class="text-sm font-medium text-muted-foreground">Parents</p>
					<p class="font-medium">{coupleInfo.groom.parents}</p>
				</div>
				<div>
					<p class="text-sm font-medium text-muted-foreground">Occupation</p>
					<p class="font-medium">{coupleInfo.groom.occupation}</p>
				</div>
				<div>
					<p class="text-sm font-medium text-muted-foreground">Instagram</p>
					<p class="font-medium">{coupleInfo.groom.instagram}</p>
				</div>
			</div>
			
			<button class="mt-4 w-full px-4 py-2 border rounded-lg hover:bg-muted/50 transition-colors">
				Edit Groom Info
			</button>
		</div>
	</div>

	<!-- Relationship Timeline -->
	<div class="rounded-lg border bg-card p-4">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-lg font-semibold">Relationship Timeline</h2>
			<button class="text-sm font-medium hover:underline">Add Milestone</button>
		</div>
		
		<div class="space-y-4">
			{#each relationshipMilestones as milestone}
				<div class="flex items-start gap-4 p-3 border rounded-lg">
					<div class="w-2 h-2 rounded-full bg-foreground mt-2"></div>
					<div class="flex-1">
						<div class="flex items-center justify-between mb-1">
							<h3 class="font-medium">{milestone.event}</h3>
							<span class="text-sm text-muted-foreground">{milestone.date}</span>
						</div>
						<p class="text-sm text-muted-foreground">{milestone.description}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Photo Upload Section -->
	<div class="rounded-lg border bg-card p-4">
		<h2 class="text-lg font-semibold mb-4">Couple Photos</h2>
		<div class="grid gap-4 md:grid-cols-2">
			<div class="border-2 border-dashed border-muted rounded-lg p-8 text-center">
				<svg class="w-12 h-12 mx-auto mb-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
				</svg>
				<p class="text-sm font-medium mb-2">Upload Bride Photo</p>
				<p class="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
				<button class="mt-3 px-4 py-2 border rounded-lg hover:bg-muted/50 transition-colors">
					Choose File
				</button>
			</div>
			
			<div class="border-2 border-dashed border-muted rounded-lg p-8 text-center">
				<svg class="w-12 h-12 mx-auto mb-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
				</svg>
				<p class="text-sm font-medium mb-2">Upload Groom Photo</p>
				<p class="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
				<button class="mt-3 px-4 py-2 border rounded-lg hover:bg-muted/50 transition-colors">
					Choose File
				</button>
			</div>
		</div>
	</div>
</div>