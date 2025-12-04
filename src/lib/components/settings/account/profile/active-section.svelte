<script lang="ts">
	import { Separator } from '$lib/components/ui/separator/index';
	import { Button } from '$lib/components/ui/button/index';
</script>

<div class="flex flex-row items-center justify-between">
	<div class="flex flex-col">
		<h1 class="font-extrabold text-xl">Active Sessions</h1>
		<span class="text-muted-foreground text-sm text-balance"
			>Review recent devices and sign out of anything you don’t recognize.</span
		>
	</div>
	<Button>View Sessions</Button>
</div>
<Separator />
