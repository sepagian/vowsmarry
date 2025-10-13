<script lang="ts">
	import SectionCards from '$lib/components/section/section-cards.svelte';
	import SectionTodo from '$lib/components/section/section-todo.svelte';
	import SectionBudget from '$lib/components/section/section-budget.svelte';
	import { tasksStore } from '$lib/stores/tasks';
	import { vendorsStore } from '$lib/stores/vendors';
	import { documentsStore } from '$lib/stores/documents';
	import { expensesStore } from '$lib/stores/expenses';
	import { toast } from 'svelte-sonner';
	import { onMount } from 'svelte';
	import { authToasts } from '$lib/utils/auth-toasts';

	const overviewTitle = 'Project Overview';

	let { data } = $props();

	// Show success message from URL parameter if present (e.g., from email verification)
	onMount(() => {
		if (data.message) {
			// Handle different message types with appropriate toast styling
			const messageType = new URLSearchParams(window.location.search).get('messageType');
			
			switch (messageType) {
				case 'login_success':
					authToasts.success.login();
					break;
				case 'email_verification_success':
				case 'signup_verification_success':
					authToasts.success.emailVerification();
					break;
				default:
					toast.success(data.message);
			}
		}
	});

	// Reactive overviewCards based on stores
	let overviewCards = $derived(() => {
		return [
			{
				title: $tasksStore.length.toString(),
				description: 'Tasks',
				action: 'Total',
				footer: 'Updated just now',
			},
			{
				title: `${$expensesStore
					.filter((e) => e['payment-status'] === 'paid')
					.reduce((sum, e) => sum + e.amount, 0)
					.toLocaleString('id-ID', {
						style: 'currency',
						currency: 'IDR',
						minimumFractionDigits: 0,
						maximumFractionDigits: 0,
					})}`,
				description: 'Budget Spent',
				action: 'Total',
				footer: 'Updated just now',
			},
			{
				title: $documentsStore.length.toString(),
				description: 'Documents',
				action: 'Total',
				footer: 'Updated just now',
			},
			{
				title: $vendorsStore.length.toString(),
				description: 'Vendors',
				action: 'Total',
				footer: 'Updated just now',
			},
		];
	});
</script>

<div class="flex flex-1 flex-col gap-4 py-4 max-w-screen-xl mx-auto">
	<SectionCards
		{overviewCards}
		{overviewTitle}
		columns={4}
	/>
	<SectionTodo {data} />
	<SectionBudget {data} />
</div>
