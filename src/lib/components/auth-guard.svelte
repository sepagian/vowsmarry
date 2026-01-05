<script lang="ts">
  import type { Session, User } from "better-auth/types";
  import type { Snippet } from "svelte";
  import { goto } from "$app/navigation";

  type Props = {
    requireAuth?: boolean;
    redirectTo?: string;
    loadingContent?: Snippet;
    unauthenticatedContent?: Snippet;
    children: Snippet;
    user?: User | null;
    session?: Session | null;
  };

  let {
    requireAuth = false,
    redirectTo = "/login",
    loadingContent,
    unauthenticatedContent,
    children,
    user = null,
    session = null,
  }: Props = $props();

  let isLoading = $derived(user === undefined);
  let isAuth = $derived(user !== null && session !== null);

  $effect(() => {
    if (!isLoading && requireAuth && !isAuth) {
      goto(redirectTo);
    }
  });
</script>

{#if isLoading}
  {#if loadingContent}
    {@render loadingContent()}
  {:else}
    <div class="flex items-center justify-center p-4">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
      ></div>
    </div>
  {/if}
{:else if requireAuth}
  {#if isAuth}
    {@render children()}
  {/if}
{:else if isAuth}
  {@render children()}
{:else if unauthenticatedContent}
  {@render unauthenticatedContent()}
{:else}
  {@render children()}
{/if}
