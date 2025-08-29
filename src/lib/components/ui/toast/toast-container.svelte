<script lang="ts">
	import { toast } from '$lib/stores/toast';
	import Toast from './toast.svelte';

	// Subscribe to the toast store
	$: toasts = $toast;
</script>

<!-- Toast container - positioned fixed at top-right -->
<div
	class="pointer-events-none fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6"
	aria-live="assertive"
>
	<div class="flex w-full flex-col items-center space-y-4 sm:items-end">
		{#each toasts as toastItem (toastItem.id)}
			<Toast {toastItem} />
		{/each}
	</div>
</div>