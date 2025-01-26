"use client";

import { RPC_API_KEYS } from "@/components/constants";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { RoycoProvider } from "royco";

export const RoycoClientProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 3,
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: true,
            refetchOnReconnect: false,
            staleTime: 1000 * 60 * 60, // 1 hour
            gcTime: 1000 * 60 * 60 * 24, // 1 day
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <RoycoProvider
        originUrl={process.env.NEXT_PUBLIC_ROYCO_ORIGIN_URL!}
        originKey={process.env.NEXT_PUBLIC_ROYCO_ORIGIN_KEY!}
        originId={process.env.NEXT_PUBLIC_ROYCO_ORIGIN_ID!}
        rpcApiKeys={RPC_API_KEYS}
      >
        {children}
      </RoycoProvider>
    </QueryClientProvider>
  );
};
