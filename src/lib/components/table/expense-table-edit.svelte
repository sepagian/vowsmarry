<script lang="ts">
    import { Button } from "$lib/components/ui/button/index";
    import * as Dialog from "$lib/components/ui/dialog/index";
    import * as Form from "$lib/components/ui/form/index";
    import * as Select from "$lib/components/ui/select/index";
    import { Input } from "$lib/components/ui/input/index";
    import { superForm } from "sveltekit-superforms";
    import { valibot } from "sveltekit-superforms/adapters";
    import { CrudToasts } from "$lib/utils/toasts";
    import type { Expense } from "$lib/types";
    import { useUpdateExpense } from "$lib/mutation/expense";

    import {
        expenseSchema,
        categoryEnum,
        expenseStatusEnum,
    } from "$lib/validation/planner";

    let { expense, data } = $props<{
        expense: Expense;
        data: any;
    }>();

    let dialogOpen = $state(false);

    const updateExpenseMutation = useUpdateExpense();

    const form = superForm(data.expenseForm, {
        validators: valibot(expenseSchema),
        resetForm: false,
    });
    const { form: formData } = form;

    $effect(() => {
        if (dialogOpen) {
            $formData.expenseDescription = expense.expenseDescription;
            $formData.expenseCategory = expense.expenseCategory;
            $formData.expenseAmount = expense.expenseAmount;
            $formData.expensePaymentStatus = expense.expensePaymentStatus;
            $formData.expenseDueDate = expense.expenseDueDate;
        }
    });

    async function handleSubmit() {
        try {
            await updateExpenseMutation.mutateAsync({
                id: expense.id,
                expenseDescription: $formData.expenseDescription,
                expenseCategory: $formData.expenseCategory,
                expenseAmount: $formData.expenseAmount,
                expensePaymentStatus: $formData.expensePaymentStatus,
                expenseDueDate: $formData.expenseDueDate,
            });
            CrudToasts.success("update", "expense", {
                itemName: $formData.expenseDescription,
            });
            dialogOpen = false;
        } catch (error) {
            console.error("Update error:", error);
            CrudToasts.error(
                "update",
                "An error occurred while updating the expense",
                "expense",
            );
        }
    }

    const isUpdating = $derived(updateExpenseMutation.isPending);

    const selectedCategory = $derived(
        categoryEnum.find((c) => c.value === $formData.expenseCategory)
            ?.label ?? "Choose category",
    );

    const selectedStatus = $derived(
        expenseStatusEnum.find(
            (s) => s.value === $formData.expensePaymentStatus,
        )?.label ?? "Select payment status",
    );
</script>

<Dialog.Root bind:open={dialogOpen}>
    <Dialog.Trigger>
        {#snippet child({ props })}
            <Button
                {...props}
                variant="outline"
                size="sm"
                class="h-8 w-8 p-0"
                title="Edit expense"
            >
                <div class="i-lucide:pencil h-4 w-4"></div>
            </Button>
        {/snippet}
    </Dialog.Trigger>
    <Dialog.Content class="sm:max-w-[425px]">
        <form
            onsubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
            class="flex flex-col gap-4"
        >
            <Dialog.Header>
                <Dialog.Title>Edit Expense</Dialog.Title>
                <Dialog.Description>
                    <p>Update the expense details below.</p>
                </Dialog.Description>
            </Dialog.Header>
            <Form.Field {form} name="expenseDescription">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Description</Form.Label>
                        <Input
                            {...props}
                            type="text"
                            bind:value={$formData.expenseDescription}
                        />
                    {/snippet}
                </Form.Control>
                <Form.FieldErrors class="text-xs text-red-500" />
            </Form.Field>
            <Form.Field {form} name="expenseAmount">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Amount</Form.Label>
                        <Input
                            {...props}
                            type="number"
                            pattern="[0-9]*"
                            bind:value={$formData.expenseAmount}
                        />
                    {/snippet}
                </Form.Control>
                <Form.FieldErrors class="text-xs text-red-500" />
            </Form.Field>
            <div class="flex w-full gap-4">
                <Form.Field
                    {form}
                    name="expenseCategory"
                    class="flex flex-col w-full"
                >
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Category</Form.Label>
                            <Select.Root
                                type="single"
                                bind:value={$formData.expenseCategory}
                                name={props.name}
                            >
                                <Select.Trigger {...props} class="w-full">
                                    {selectedCategory}
                                </Select.Trigger>
                                <Select.Content>
                                    {#each categoryEnum as option (option.value)}
                                        <Select.Item value={option.value}>
                                            {option.label}
                                        </Select.Item>
                                    {/each}
                                </Select.Content>
                            </Select.Root>
                        {/snippet}
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field
                    {form}
                    name="expensePaymentStatus"
                    class="flex flex-col w-full"
                >
                    <Form.Control>
                        {#snippet children({ props })}
                            <Form.Label>Payment Status</Form.Label>
                            <Select.Root
                                type="single"
                                bind:value={$formData.expensePaymentStatus}
                                name={props.name}
                            >
                                <Select.Trigger {...props} class="w-full">
                                    {selectedStatus}
                                </Select.Trigger>
                                <Select.Content class="w-full">
                                    {#each expenseStatusEnum as option (option.value)}
                                        <Select.Item value={option.value}>
                                            {option.label}
                                        </Select.Item>
                                    {/each}
                                </Select.Content>
                            </Select.Root>
                        {/snippet}
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
            </div>
            <Form.Field {form} name="expenseDueDate">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Due Date</Form.Label>
                        <Input
                            {...props}
                            type="date"
                            bind:value={$formData.expenseDueDate}
                        />
                    {/snippet}
                </Form.Control>
                <Form.FieldErrors class="text-xs text-red-500" />
            </Form.Field>
            <Dialog.Footer>
                <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? "Updating..." : "Update Expense"}
                </Button>
            </Dialog.Footer>
        </form>
    </Dialog.Content>
</Dialog.Root>
