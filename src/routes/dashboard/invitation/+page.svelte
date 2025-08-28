<script lang="ts">
	// Dummy invitation dashboard data
	const invitationProgress = {
		overall: 65,
		steps: [
			{ name: 'Template Selection', completed: true, url: '/dashboard/invitation/templates' },
			{ name: 'Couple Information', completed: true, url: '/dashboard/invitation/couple' },
			{ name: 'Love Story', completed: false, url: '/dashboard/invitation/love-story' },
			{ name: 'Photo Gallery', completed: true, url: '/dashboard/invitation/gallery' },
			{ name: 'Guest List', completed: false, url: '/dashboard/invitation/guest' },
			{ name: 'RSVP Setup', completed: false, url: '/dashboard/invitation/rsvp' },
			{ name: 'Gift Registry', completed: true, url: '/dashboard/invitation/gift' }
		]
	};

	const invitationStats = {
		template: { selected: 'Classic Elegance', status: 'completed' },
		photos: { uploaded: 18, total: 25, status: 'in-progress' },
		guests: { added: 142, invited: 89, responded: 56, status: 'in-progress' },
		story: { chapters: 5, published: 3, status: 'draft' },
		gifts: { items: 45, purchased: 28, status: 'active' },
		rsvp: { responses: 56, attending: 48, declined: 8, status: 'active' }
	};

	const recentActivity = [
		{
			action: 'Template selected',
			item: 'Classic Elegance',
			time: '2 hours ago',
			type: 'template'
		},
		{
			action: 'Photos uploaded',
			item: '5 new engagement photos',
			time: '1 day ago',
			type: 'gallery'
		},
		{
			action: 'Guest responded',
			item: 'Michael Johnson - Attending',
			time: '2 days ago',
			type: 'rsvp'
		},
		{
			action: 'Gift purchased',
			item: 'Coffee Maker by Smith Family',
			time: '3 days ago',
			type: 'gift'
		},
		{ action: 'Story chapter added', item: 'The Proposal', time: '5 days ago', type: 'story' }
	];

	const quickActions = [
		{
			title: 'Preview Invitation',
			description: 'See how your invitation looks',
			icon: '👁️',
			action: 'preview',
			primary: true
		},
		{
			title: 'Send Test Invitation',
			description: 'Send a test to yourself',
			icon: '📧',
			action: 'test',
			primary: false
		},
		{
			title: 'Share Preview Link',
			description: 'Get shareable preview link',
			icon: '🔗',
			action: 'share',
			primary: false
		},
		{
			title: 'Download PDF',
			description: 'Download printable version',
			icon: '📄',
			action: 'download',
			primary: false
		}
	];

	function getStatusColor(status: string) {
		switch (status) {
			case 'completed':
				return 'bg-green-100 text-green-800';
			case 'in-progress':
				return 'bg-yellow-100 text-yellow-800';
			case 'active':
				return 'bg-blue-100 text-blue-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}
</script>

<div class="flex flex-1 flex-col gap-4 p-4">
	<!-- Header -->
	<div class="flex flex-col gap-2">
		<h1 class="text-2xl font-semibold">Invitation Dashboard</h1>
		<p class="text-muted-foreground">Manage all aspects of your wedding invitation in one place.</p>
	</div>

	<!-- Progress Overview -->
	<div class="rounded-lg border bg-card p-4">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-lg font-semibold">Invitation Progress</h2>
			<span class="text-2xl font-bold">{invitationProgress.overall}%</span>
		</div>

		<div class="w-full bg-muted rounded-full h-3 mb-4">
			<div
				class="bg-foreground h-3 rounded-full transition-all duration-300"
				style="width: {invitationProgress.overall}%"
			></div>
		</div>

		<div class="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
			{#each invitationProgress.steps as step}
				<a
					href={step.url}
					class="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
				>
					<div
						class="w-2 h-2 rounded-full {step.completed ? 'bg-green-500' : 'bg-muted-foreground'}"
					></div>
					<span
						class="text-sm font-medium {step.completed
							? 'text-foreground'
							: 'text-muted-foreground'}">{step.name}</span
					>
				</a>
			{/each}
		</div>
	</div>

	<!-- Key Statistics -->
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		<!-- Template Status -->
		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-3">
				<h3 class="font-semibold">Template</h3>
				<span
					class="px-2 py-1 text-xs font-medium rounded {getStatusColor(
						invitationStats.template.status
					)}"
				>
					{invitationStats.template.status}
				</span>
			</div>
			<p class="text-sm text-muted-foreground mb-2">Selected Template</p>
			<p class="font-medium">{invitationStats.template.selected}</p>
			<a
				href="/dashboard/invitation/templates"
				class="text-sm text-blue-600 hover:underline mt-2 inline-block"
			>
				Change Template →
			</a>
		</div>

		<!-- Photo Gallery Status -->
		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-3">
				<h3 class="font-semibold">Photos</h3>
				<span
					class="px-2 py-1 text-xs font-medium rounded {getStatusColor(
						invitationStats.photos.status
					)}"
				>
					{invitationStats.photos.status}
				</span>
			</div>
			<p class="text-sm text-muted-foreground mb-2">Photo Progress</p>
			<p class="font-medium">
				{invitationStats.photos.uploaded} of {invitationStats.photos.total} uploaded
			</p>
			<a
				href="/dashboard/invitation/gallery"
				class="text-sm text-blue-600 hover:underline mt-2 inline-block"
			>
				Manage Photos →
			</a>
		</div>

		<!-- Guest List Status -->
		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-3">
				<h3 class="font-semibold">Guests</h3>
				<span
					class="px-2 py-1 text-xs font-medium rounded {getStatusColor(
						invitationStats.guests.status
					)}"
				>
					{invitationStats.guests.status}
				</span>
			</div>
			<p class="text-sm text-muted-foreground mb-2">Guest Management</p>
			<p class="font-medium">{invitationStats.guests.added} guests added</p>
			<a
				href="/dashboard/invitation/guest"
				class="text-sm text-blue-600 hover:underline mt-2 inline-block"
			>
				Manage Guests →
			</a>
		</div>

		<!-- Love Story Status -->
		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-3">
				<h3 class="font-semibold">Love Story</h3>
				<span
					class="px-2 py-1 text-xs font-medium rounded {getStatusColor(
						invitationStats.story.status
					)}"
				>
					{invitationStats.story.status}
				</span>
			</div>
			<p class="text-sm text-muted-foreground mb-2">Story Progress</p>
			<p class="font-medium">
				{invitationStats.story.published} of {invitationStats.story.chapters} published
			</p>
			<a
				href="/dashboard/invitation/love-story"
				class="text-sm text-blue-600 hover:underline mt-2 inline-block"
			>
				Edit Story →
			</a>
		</div>

		<!-- Gift Registry Status -->
		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-3">
				<h3 class="font-semibold">Gift Registry</h3>
				<span
					class="px-2 py-1 text-xs font-medium rounded {getStatusColor(
						invitationStats.gifts.status
					)}"
				>
					{invitationStats.gifts.status}
				</span>
			</div>
			<p class="text-sm text-muted-foreground mb-2">Registry Progress</p>
			<p class="font-medium">
				{invitationStats.gifts.purchased} of {invitationStats.gifts.items} purchased
			</p>
			<a
				href="/dashboard/invitation/gift"
				class="text-sm text-blue-600 hover:underline mt-2 inline-block"
			>
				View Registry →
			</a>
		</div>

		<!-- RSVP Status -->
		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-3">
				<h3 class="font-semibold">RSVP</h3>
				<span
					class="px-2 py-1 text-xs font-medium rounded {getStatusColor(
						invitationStats.rsvp.status
					)}"
				>
					{invitationStats.rsvp.status}
				</span>
			</div>
			<p class="text-sm text-muted-foreground mb-2">Response Status</p>
			<p class="font-medium">
				{invitationStats.rsvp.attending} attending, {invitationStats.rsvp.declined} declined
			</p>
			<a
				href="/dashboard/invitation/rsvp"
				class="text-sm text-blue-600 hover:underline mt-2 inline-block"
			>
				View Responses →
			</a>
		</div>
	</div>

	<!-- Quick Actions -->
	<div class="rounded-lg border bg-card p-4">
		<h2 class="text-lg font-semibold mb-4">Quick Actions</h2>
		<div class="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
			{#each quickActions as action}
				<button
					class="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left {action.primary
						? 'border-foreground bg-foreground/5'
						: ''}"
				>
					<div class="text-2xl">{action.icon}</div>
					<div>
						<p class="font-medium">{action.title}</p>
						<p class="text-sm text-muted-foreground">{action.description}</p>
					</div>
				</button>
			{/each}
		</div>
	</div>

	<!-- Recent Activity -->
	<div class="rounded-lg border bg-card p-4">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-lg font-semibold">Recent Activity</h2>
			<button class="text-sm font-medium hover:underline">View All</button>
		</div>

		<div class="space-y-3">
			{#each recentActivity as activity}
				<div class="flex items-start gap-3 p-3 border rounded-lg">
					<div class="w-2 h-2 rounded-full bg-muted-foreground mt-2"></div>
					<div class="flex-1">
						<p class="font-medium text-sm">{activity.action}</p>
						<p class="text-sm text-muted-foreground">{activity.item}</p>
						<p class="text-xs text-muted-foreground mt-1">{activity.time}</p>
					</div>
					<span class="px-2 py-1 text-xs bg-muted rounded">{activity.type}</span>
				</div>
			{/each}
		</div>
	</div>
</div>
