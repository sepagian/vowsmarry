<script lang="ts">
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import { AlertCircle } from 'lucide-svelte';

	let { onAddDataClick } = $props();
</script>

<Alert.Root class="border-orange-200 bg-orange-50 text-orange-800">
	<AlertCircle class="h-4 w-4" />
	<Alert.Title>Wedding Data Required</Alert.Title>
	<Alert.Description class="mt-2">
		<p class="mb-3">
			To get started with planning your wedding, please add your wedding information including your partner's name, wedding date, and other details.
		</p>
		<Button 
			variant="outline" 
			size="sm" 
			class="border-orange-300 bg-white text-orange-800 hover:bg-orange-100"
			onclick={onAddDataClick}
		>
			Add Wedding Data
		</Button>
	</Alert.Description>
</Alert.Root>