<script lang="ts">
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "$lib/components/ui/dialog";
  import { Button } from "$lib/components/ui/button";
  import type { Schedule } from "$lib/types";
  import { FormToasts } from "$lib/utils/toasts";

  interface Props {
    open: boolean;
    schedule: Schedule | null;
    onOpenChange: (open: boolean) => void;
    onConfirm?: () => void;
  }

  let {
    open = $bindable(),
    schedule = null,
    onOpenChange,
    onConfirm,
  }: Props = $props();

  let isDeleting = $state(false);

  const handleDelete = async () => {
    if (!schedule) return;

    isDeleting = true;
    const formData = new FormData();
    formData.append("id", schedule.id || "");

    try {
      const response = await fetch("?/deleteSchedule", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.type === "success") {
        FormToasts.success("Schedule deleted successfully!");
        onOpenChange(false);
        onConfirm?.();
      } else {
        FormToasts.error(result.error || "Failed to delete schedule");
      }
    } catch (error) {
      console.error("Delete error:", error);
      FormToasts.error("An error occurred while deleting the schedule");
    } finally {
      isDeleting = false;
    }
  };
</script>

<Dialog bind:open {onOpenChange}>
  <DialogContent class="sm:max-w-[400px]">
    <DialogHeader>
      <DialogTitle class="flex items-center gap-2">
        <span class="i-lucide:alert-triangle w-5 h-5 text-yellow-600"></span>
        Delete Schedule
      </DialogTitle>
      <DialogDescription>
        Are you sure you want to delete "{schedule?.scheduleName}"? This action
        cannot be undone.
      </DialogDescription>
    </DialogHeader>

    <div class="flex justify-end gap-2 pt-4">
      <Button
        type="button"
        variant="outline"
        onclick={() => onOpenChange(false)}
        disabled={isDeleting}
      >
        Cancel
      </Button>
      <Button
        type="button"
        variant="destructive"
        onclick={handleDelete}
        disabled={isDeleting}
      >
        {#if isDeleting}
          <span class="i-lucide:loader-2 w-4 h-4 mr-2 animate-spin"></span>
        {:else}
          <span class="i-lucide:trash-2 w-4 h-4 mr-2"></span>
        {/if}
        Delete
      </Button>
    </div>
  </DialogContent>
</Dialog>
