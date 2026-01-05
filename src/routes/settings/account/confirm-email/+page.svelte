<script lang="ts">
  import { enhance } from "$app/forms";
  import { Button } from "$lib/components/ui/button/";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card/";
  import { toast } from "svelte-sonner";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  let isSubmitting = $state(false);

  function handleConfirm() {
    isSubmitting = true;
  }
</script>

<div class="min-h-screen flex items-center justify-center p-4">
  <Card>
    <CardHeader>
      <CardTitle>Confirm Email Change</CardTitle>
      <CardDescription>
        Click the button below to confirm your new email address
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form
        method="POST"
        use:enhance={() => {
          return async ({ result }) => {
            if (result.type === "success" && result.data?.success) {
              toast.success(
                (result.data.message as string) || "Email updated successfully",
              );
              // Redirect after success
              setTimeout(() => {
                window.location.href = "/settings/account";
              }, 1500);
            } else if (result.type === "failure") {
              toast.error(
                (result.data?.message as string) ||
                  "Failed to confirm email change",
              );
              isSubmitting = false;
            }
          };
        }}
        onsubmit={handleConfirm}
      >
        <input type="hidden" name="token" value={data.session?.token} />
        <Button type="submit" class="w-full" disabled={isSubmitting}>
          {#if isSubmitting}
            Confirming...
          {:else}
            Confirm Email Change
          {/if}
        </Button>
      </form>
    </CardContent>
  </Card>
</div>
