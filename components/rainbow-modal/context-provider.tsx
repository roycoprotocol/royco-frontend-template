"use client";

import {
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { config } from "./modal-config";
import { ReactNode, useEffect, useMemo } from "react";
import { useAccount, WagmiProvider } from "wagmi";
import { ConnectWalletProvider } from "@/app/_containers/providers/connect-wallet-provider";
import { createSiweMessage } from "viem/siwe";
import { useAtom, useAtomValue } from "jotai";
import {
  accountAddressAtom,
  authenticationStatusAtom,
  sessionAtom,
} from "@/store/global";
import { api } from "@/app/api/royco";
import { useQuery } from "@tanstack/react-query";
import { defaultQueryOptions } from "@/utils/query";
import { Disconnector } from "./disconnector";

export default function WalletProvider({ children }: { children: ReactNode }) {
  const authenticationStatus = useAtomValue(authenticationStatusAtom);
  const accountAddress = useAtomValue(accountAddressAtom);
  const [session, setSession] = useAtom(sessionAtom);

  const authenticationAdapter = useMemo(() => {
    return createAuthenticationAdapter({
      getNonce: async () => {
        const response = await api.authControllerGetNonce();
        return response.data.nonce;
      },

      createMessage: ({ nonce, address, chainId }) => {
        return createSiweMessage({
          domain: window.location.host,
          address,
          statement: "Sign in with Ethereum to Royco app.",
          uri: window.location.origin,
          version: "1",
          chainId,
          nonce,
        });
      },

      verify: async ({ message, signature }) => {
        try {
          const response = await api.authControllerLogin({
            message,
            signature,
          });

          setSession(response.data.session);

          return true;
        } catch (error) {
          console.error(error);
          return false;
        }
      },

      signOut: async () => {
        try {
          if (!session?.id) {
            throw new Error("No session found");
          }

          await api.authControllerLogout({
            id: session?.id,
          });
        } catch (error) {
          console.error(error);
        }
        setSession(null);
      },
    });
  }, []);

  const propsAuthStatus = useQuery({
    queryKey: ["auth-status-check"],
    queryFn: async () => {
      try {
        if (!session?.id) {
          throw new Error("No session id found");
        }

        const response = await api.authControllerGetSession({
          id: session?.id,
        });

        if (response.data.isActive === false) {
          setSession(null);
        }
      } catch (error) {
        console.error(error);
        setSession(null);
      }

      return true;
    },
    ...defaultQueryOptions,
    enabled: !!session?.id,
  });

  return (
    <WagmiProvider
      reconnectOnMount={false}
      config={config}
      // initialState={initialState}
    >
      <RainbowKitAuthenticationProvider
        adapter={authenticationAdapter}
        status={authenticationStatus}
      >
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
          <ConnectWalletProvider>
            {children}

            <Disconnector />
          </ConnectWalletProvider>
        </RainbowKitProvider>
      </RainbowKitAuthenticationProvider>
    </WagmiProvider>
  );
}
