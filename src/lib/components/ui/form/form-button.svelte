<script lang="ts">
	import * as Button from '$lib/components/ui/button/index.js';

	let { ref = $bindable(null), ...restProps }: Button.ButtonElementProps = $props();
</script>

<Button.Root
	bind:ref
	type="submit"
	{...restProps}
/>
