<script lang="ts">
	import * as Empty from '$lib/components/ui/empty/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
</script>

<Empty.Root>
	<Empty.Header>
		<Empty.Media
			variant="icon"
			class="bg-orange-200"
		>
			<div class="i-lucide:check bg-orange-800"></div>
		</Empty.Media>
		<Empty.Title class="font-semibold text-lg">You’re all set</Empty.Title>
		<Empty.Description class="text-sm text-muted-foreground">
			Everything’s ready. Step in and start planning the things that matter, one moment at a time.
		</Empty.Description>
	</Empty.Header>
</Empty.Root>
