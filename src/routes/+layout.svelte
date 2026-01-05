<script lang="ts">
  import { page } from "$app/state";
  import "uno.css";
  import { Progress } from "@friendofsvelte/progress";
  import type { User, Session } from "better-auth/types";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";
  import { setContext } from "svelte";

  import { browser } from "$app/environment";

  import { Toaster } from "$lib/components/ui/sonner";

  import favicon from "$lib/assets/favicon.svg";
  import { TOAST_CONFIG } from "$lib/constants/config";
  import {
    getBroadcastChannel,
    onBroadcastMessage,
  } from "$lib/utils/broadcast";

  let { data, children } = $props<{
    data: { pageTitle?: string };
  }>();

  type AuthContext = {
    user: User | null;
    session: Session | null;
  };

  const authState = $state<AuthContext>({
    user: data.user,
    session: data.session,
  });

  setContext("auth", authState);

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

  const pageTitle = $derived.by(() => {
    const path = page.url.pathname;

    const titleMap: Record<string, string> = {
      "/login": "Login | VowsMarry",
      "/register": "Register | VowsMarry",
      "/forgot-password": "Forgot Password | VowsMarry",
      "/reset-password": "Reset Password | VowsMarry",
      "/onboarding": "Setup Your Wedding | VowsMarry",
      "/dashboard": "Dashboard | VowsMarry",
    };

    if (path.startsWith("/dashboard")) {
      const section = path.split("/dashboard/")[1]?.split("/")[0];
      const sectionTitles: Record<string, string> = {
        task: "Tasks",
        document: "Document",
        finance: "Finance",
        vendor: "Vendor",
        schedule: "Schedule",
      };

      if (section && sectionTitles[section]) {
        return `${sectionTitles[section]} | VowsMarry`;
      }
      return "Dashboard | VowsMarry";
    }

    return titleMap[path] || "VowsMarry";
  });

  $effect(() => {
    authState.user = data.user;
    authState.session = data.session;
    if (browser) {
      getBroadcastChannel();
      onBroadcastMessage((queryKeys) => {
        console.log("[Broadcast] Invalidating:", queryKeys);
        queryClient.invalidateQueries();
      });
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
