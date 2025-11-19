<script lang="ts">
	import RegisterForm from '$lib/components/form/register-form.svelte';
	let { data } = $props();
</script>

<RegisterForm {data} />
