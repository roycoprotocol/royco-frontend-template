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
  const [queryClient] = useState(() => new QueryClient());

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
