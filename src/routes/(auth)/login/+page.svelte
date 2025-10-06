<script lang="ts">
	import LoginForm from '$lib/components/form/login-form.svelte';
	let { data } = $props();
</script>

<LoginForm {data} />
