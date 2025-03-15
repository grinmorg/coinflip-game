"use client";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

export default function QueryClientContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
      },
    },
  });

  return (
    <QueryClientProvider
      client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
