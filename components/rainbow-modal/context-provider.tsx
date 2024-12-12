"use client";

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { config } from "./modal-config";
import { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
// import { ConnectWalletProvider } from "../../app/_components/provider/connect-wallet-provider";

export default function WalletProvider({ children }: { children: ReactNode }) {
  // const initialState = cookieToInitialState(config as Config, cookies);

  return (
    <WagmiProvider
      config={config}
      // initialState={initialState}
    >
      <RainbowKitProvider>
        {/* <ConnectWalletProvider> */}
        {children}
        {/* </ConnectWalletProvider> */}
      </RainbowKitProvider>
    </WagmiProvider>
  );
}
