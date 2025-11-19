<script lang="ts">
	import ForgotPasswordForm from '$lib/components/form/forgot-password-form.svelte';
	let { data } = $props();
</script>

<ForgotPasswordForm {data} />
