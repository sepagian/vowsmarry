<script lang="ts">
    import { Button } from "$lib/components/ui/button/index";
    import { confirmDelete } from "$lib/components/ui/confirm-delete-dialog";

    let { expenseId, expenseDescription, onDelete } = $props<{
        expenseId: string;
        expenseDescription: string;
        onDelete: (expenseId: string) => Promise<void>;
    }>();
</script>

<Button
    variant="outline"
    size="sm"
    class="h-8 w-8 p-0"
    title="Delete expense"
    onclick={() => {
        confirmDelete({
            title: "Delete Expense",
            description: `Are you sure you want to delete "${expenseDescription}"? This action cannot be undone.`,
            onConfirm: async () => {
                await onDelete(expenseId);
            },
        });
    }}
>
    <div class="i-lucide:trash-2 h-4 w-4 text-red-500"></div>
</Button>
