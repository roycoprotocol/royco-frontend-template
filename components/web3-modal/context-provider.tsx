"use client";

import React, { ReactNode } from "react";
import { config, metadata, projectId } from "./modal-config";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Config, cookieToInitialState, State, WagmiProvider } from "wagmi";
import { ConnectWalletProvider } from "../../app/_components/provider/connect-wallet-provider";

export default function AppKitProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  // Setup queryClient
  const queryClient = new QueryClient();

  if (!projectId) throw new Error("Project ID is not defined");

  // Create modal
  createWeb3Modal({
    metadata,
    wagmiConfig: config,
    projectId,
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
    enableOnramp: true, // Optional - false as default
    allowUnsupportedChain: false,
  });

  const initialState = cookieToInitialState(config as Config, cookies);

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config} initialState={initialState}>
        <ConnectWalletProvider>{children}</ConnectWalletProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
