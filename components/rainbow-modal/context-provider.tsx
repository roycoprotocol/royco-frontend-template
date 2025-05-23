"use client";

import {
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { config } from "./modal-config";
import { ReactNode, useMemo } from "react";
import { WagmiProvider } from "wagmi";
import { ConnectWalletProvider } from "@/app/_containers/providers/connect-wallet-provider";
import { createSiweMessage } from "viem/siwe";
import { useAtom, useAtomValue } from "jotai";
import { authenticationStatusAtom, sessionTokenAtom } from "@/store/global";

export default function WalletProvider({ children }: { children: ReactNode }) {
  const authenticationStatus = useAtomValue(authenticationStatusAtom);

  const [sessionToken, setSessionToken] = useAtom(sessionTokenAtom);

  const authenticationAdapter = useMemo(() => {
    return createAuthenticationAdapter({
      getNonce: async () => {
        // const response = await fetch("/api/nonce");
        // return await response.text();

        return "asdsadsafdsafsaf";
      },

      createMessage: ({ nonce, address, chainId }) => {
        return createSiweMessage({
          domain: window.location.host,
          address,
          statement: "Sign in with Ethereum to the app.",
          uri: window.location.origin,
          version: "1",
          chainId,
          nonce,
        });
      },

      verify: async ({ message, signature }) => {
        // const verifyRes = await fetch("/api/verify", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ message, signature }),
        // });

        // return Boolean(verifyRes.ok);

        setSessionToken(signature);

        return true;
      },

      signOut: async () => {
        setSessionToken(null);
        // await fetch("/api/logout");
      },
    });
  }, []);

  return (
    <WagmiProvider
      reconnectOnMount={true}
      config={config}
      // initialState={initialState}
    >
      {/* <RainbowKitAuthenticationProvider
        adapter={authenticationAdapter}
        status={authenticationStatus}
      > */}
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
      {/* </RainbowKitAuthenticationProvider> */}
    </WagmiProvider>
  );
}
