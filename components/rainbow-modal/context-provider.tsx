"use client";

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { config } from "./modal-config";
import { ReactNode } from "react";
import { cookieToInitialState, WagmiProvider } from "wagmi";
import { ConnectWalletProvider } from "@/app/_containers/providers/connect-wallet-provider";
import AuthWrapper from "./auth-wrapper";
import { Config } from "wagmi";

export default function WalletProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(config as Config, cookies);

  return (
    <WagmiProvider
      reconnectOnMount={true}
      config={config}
      initialState={initialState}
    >
      <AuthWrapper>
        <RainbowKitProvider
          appInfo={{
            appName: "Royco",
            // disclaimer: ({ Text, Link }) => (
            //   <div>
            //     By connecting your wallet, you agree to Royco's terms of service
            //     and privacy policy.
            //   </div>
            // ),
            learnMoreUrl: "https://royco.org",
          }}
        >
          <ConnectWalletProvider>{children}</ConnectWalletProvider>
        </RainbowKitProvider>
      </AuthWrapper>
    </WagmiProvider>
  );
}
