<script lang="ts">

	import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '$lib/components/ui/empty/index.js';
</script>

<Empty>
	<EmptyHeader>
		<EmptyMedia
			variant="icon"
			class="bg-orange-200"
		>
			<div class="i-lucide:check bg-orange-800"></div>
		</EmptyMedia>
		<EmptyTitle class="font-semibold text-lg">You're all set</EmptyTitle>
		<EmptyDescription class="text-sm text-muted-foreground">
			Everything's ready. Step in and start planning the things that matter, one moment at a time.
		</EmptyDescription>
	</EmptyHeader>
</Empty>
