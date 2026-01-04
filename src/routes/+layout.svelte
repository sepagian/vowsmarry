<script lang="ts">
  import "uno.css";
  import { Progress } from "@friendofsvelte/progress";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";
  import { onMount } from "svelte";

  import { browser } from "$app/environment";

  import { Toaster } from "$lib/components/ui/sonner";

  import { authStore } from "$lib/stores/auth";

  import favicon from "$lib/assets/favicon.svg";
  import { TOAST_CONFIG } from "$lib/constants/config";
  import {
    getBroadcastChannel,
    onBroadcastMessage,
  } from "$lib/utils/broadcast";

  let { data, children } = $props<{
    data: { user: unknown; session: unknown; pageTitle?: string };
  }>();
  let { user, session, pageTitle } = $derived(data);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
        refetchOnWindowFocus: true,
      },
    },
  });

  onMount(() => {
    authStore.initialize(user, session);

    if (browser) {
      getBroadcastChannel();
      onBroadcastMessage((queryKeys) => {
        console.log("[Broadcast] Invalidating:", queryKeys);
        queryClient.invalidateQueries();
      });
    }
  });

  $effect(() => {
    if (authStore.getState().initialized) {
      authStore.setAuth(user, session);
    }
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>{pageTitle}</title>
</svelte:head>

<QueryClientProvider client={queryClient}>
  <SvelteQueryDevtools />
  <Progress size="md" color="blue" />
  {@render children()}
  <Toaster
    richColors
    position="top-right"
    expand={true}
    visibleToasts={3}
    closeButton={true}
    duration={TOAST_CONFIG.DEFAULT_DURATION}
  />
</QueryClientProvider>
