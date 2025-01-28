"use client";

import { RPC_API_KEYS } from "@/components/constants";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { RoycoProvider } from "royco";

export const RoycoClientProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [randomIndex, setRandomIndex] = useState(Math.floor(Math.random() * 5));

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

  const getRandomOriginUrl = () => {
    if (randomIndex === 0) {
      return process.env.NEXT_PUBLIC_ROYCO_ORIGIN_URL_1!;
    } else if (randomIndex === 1) {
      return process.env.NEXT_PUBLIC_ROYCO_ORIGIN_URL_2!;
    } else if (randomIndex === 2) {
      return process.env.NEXT_PUBLIC_ROYCO_ORIGIN_URL_3!;
    } else if (randomIndex === 3) {
      return process.env.NEXT_PUBLIC_ROYCO_ORIGIN_URL_4!;
    } else {
      return process.env.NEXT_PUBLIC_ROYCO_ORIGIN_URL_5!;
    }
  };

  useEffect(() => {
    setRandomIndex(Math.floor(Math.random() * 5));
  }, []);

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
