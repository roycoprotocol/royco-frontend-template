"use client";

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { config } from "./modal-config";
import { ReactNode } from "react";
import { cookieToInitialState, WagmiProvider } from "wagmi";
import { ConnectWalletProvider } from "@/app/_containers/providers/connect-wallet-provider";
import AuthWrapper from "./auth-wrapper";
import { Config } from "wagmi";
import { GLOBAL_LINKS } from "@/constants";

export default function WalletProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  let initialState;
  try {
    initialState = cookieToInitialState(config as Config, cookies);
  } catch (error) {
    console.warn("Failed to parse wallet state from cookies:", error);
    initialState = undefined;
  }

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
            disclaimer: ({ Text, Link }) => (
              <div className="text-sm text-secondary">
                By connecting your wallet, you agree to our{" "}
                <a
                  className="underline underline-offset-2 transition-all duration-200 ease-in-out hover:opacity-70"
                  href={GLOBAL_LINKS.TERMS_OF_SERVICE}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  terms of service
                </a>{" "}
                and{" "}
                <a
                  className="underline underline-offset-2 transition-all duration-200 ease-in-out hover:opacity-70"
                  href={GLOBAL_LINKS.PRIVACY_POLICY}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  privacy policy
                </a>
                .
              </div>
            ),
            learnMoreUrl: "https://royco.org",
          }}
        >
          <ConnectWalletProvider>{children}</ConnectWalletProvider>
        </RainbowKitProvider>
      </AuthWrapper>
    </WagmiProvider>
  );
}
