"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Provider } from "react-redux";

import type { AppProvidersProps } from "@/src/core/providers/models/providers.models";
import { SessionBootstrap } from "@/src/features/authentication/components/session-bootstrap";
import { store } from "@/src/store";

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SessionBootstrap>{children}</SessionBootstrap>
      </QueryClientProvider>
    </Provider>
  );
}