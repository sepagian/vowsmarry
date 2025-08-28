<script lang="ts">
	// Dummy love story data
	const loveStory = {
		title: 'Our Love Story',
		subtitle: 'How We Met and Fell in Love',
		chapters: [
			{
				id: 1,
				title: 'First Meeting',
				date: '2018-05-12',
				location: 'Downtown Coffee Shop',
				content: 'It was a rainy Saturday morning when Sarah walked into the coffee shop where John was working on his laptop. Their eyes met across the crowded room, and something magical happened. John spilled his coffee, Sarah laughed, and the rest is history.',
				image: '/placeholder-meeting.jpg',
				isPublished: true
			},
			{
				id: 2,
				title: 'First Date',
				date: '2018-08-20',
				location: 'Italian Restaurant',
				content: 'Three months after their first meeting, John finally gathered the courage to ask Sarah out. They spent hours talking over pasta and wine, discovering they had so much in common. The conversation flowed as naturally as the wine.',
				image: '/placeholder-date.jpg',
				isPublished: true
			},
			{
				id: 3,
				title: 'Becoming Official',
				date: '2019-02-14',
				location: 'Central Park',
				content: 'On Valentine\'s Day, during a romantic walk in Central Park, John asked Sarah to be his girlfriend. With snow gently falling around them, she said yes, and they shared their first kiss as an official couple.',
				image: '/placeholder-official.jpg',
				isPublished: true
			},
			{
				id: 4,
				title: 'Moving In Together',
				date: '2020-12-25',
				location: 'Our First Home',
				content: 'Christmas 2020 brought the best gift of all - moving in together. They found a cozy apartment and made it their home, filled with love, laughter, and countless memories.',
				image: '/placeholder-home.jpg',
				isPublished: false
			},
			{
				id: 5,
				title: 'The Proposal',
				date: '2023-06-10',
				location: 'Sunset Beach',
				content: 'As the sun set over the ocean, John got down on one knee and asked Sarah to marry him. With tears of joy and the sound of waves in the background, she said yes to forever.',
				image: '/placeholder-proposal.jpg',
				isPublished: true
			}
		]
	};

	let editingChapter = null;
</script>

<div class="flex flex-1 flex-col gap-4 p-4">
	<!-- Header -->
	<div class="flex flex-col gap-2">
		<h1 class="text-2xl font-semibold">Love Story</h1>
		<p class="text-muted-foreground">Share your beautiful love story with your wedding guests.</p>
	</div>

	<!-- Story Overview -->
	<div class="grid gap-4 md:grid-cols-3">
		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Total Chapters</p>
				<svg class="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
					<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
			</div>
			<p class="text-2xl font-bold">{loveStory.chapters.length}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Published</p>
				<span class="text-lg">📖</span>
			</div>
			<p class="text-2xl font-bold">{loveStory.chapters.filter(c => c.isPublished).length}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Years Together</p>
				<span class="text-lg">💕</span>
			</div>
			<p class="text-2xl font-bold">6</p>
		</div>
	</div>

	<!-- Story Header -->
	<div class="rounded-lg border bg-card p-4">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-lg font-semibold">Story Header</h2>
			<button class="text-sm font-medium hover:underline">Edit</button>
		</div>
		<div class="text-center">
			<h3 class="text-xl font-semibold mb-2">{loveStory.title}</h3>
			<p class="text-muted-foreground">{loveStory.subtitle}</p>
		</div>
	</div>

	<!-- Story Chapters -->
	<div class="rounded-lg border bg-card p-4">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-lg font-semibold">Story Chapters</h2>
			<button class="text-sm font-medium hover:underline">Add Chapter</button>
		</div>
		
		<div class="space-y-4">
			{#each loveStory.chapters as chapter}
				<div class="border rounded-lg p-4 {chapter.isPublished ? '' : 'opacity-60'}">
					<div class="flex items-start justify-between mb-3">
						<div class="flex items-center gap-3">
							<div class="w-2 h-2 rounded-full bg-foreground"></div>
							<div>
								<h3 class="font-semibold">{chapter.title}</h3>
								<p class="text-sm text-muted-foreground">{chapter.date} • {chapter.location}</p>
							</div>
						</div>
						<div class="flex items-center gap-2">
							{#if chapter.isPublished}
								<span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">Published</span>
							{:else}
								<span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">Draft</span>
							{/if}
							<button class="text-sm font-medium hover:underline">Edit</button>
						</div>
					</div>
					
					<p class="text-sm text-muted-foreground mb-3">{chapter.content}</p>
					
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2 text-xs text-muted-foreground">
							<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
							</svg>
							<span>Image attached</span>
						</div>
						<div class="flex gap-2">
							<button class="px-2 py-1 text-xs border rounded hover:bg-muted/50 transition-colors">
								Preview
							</button>
							{#if !chapter.isPublished}
								<button class="px-2 py-1 text-xs bg-foreground text-background rounded hover:bg-foreground/90 transition-colors">
									Publish
								</button>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>