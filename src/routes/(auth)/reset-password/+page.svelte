<script lang="ts">
	import ResetPasswordForm from '$lib/components/form/reset-password-form.svelte';
	let { data } = $props();
</script>

<ResetPasswordForm {data} />
