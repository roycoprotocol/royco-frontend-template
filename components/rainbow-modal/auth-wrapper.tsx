"use client";

import {
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
} from "@rainbow-me/rainbowkit";
import { ReactNode, useMemo } from "react";
import { useAccount } from "wagmi";
import { createSiweMessage } from "viem/siwe";
import { useAtom } from "jotai";
import { authenticationStatusAtom, sessionAtom } from "@/store/global";
import { api } from "@/app/api/royco";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { defaultQueryOptions } from "@/utils/query";
import { isAuthEnabledAtom, parentSessionAtom } from "@/store/global";
import { isEqual } from "lodash";
import { queryClientAtom } from "jotai-tanstack-query";

export default function WalletProvider({ children }: { children: ReactNode }) {
  const [authenticationStatus, setAuthenticationStatus] = useAtom(
    authenticationStatusAtom
  );

  const [parentSession, setParentSession] = useAtom(parentSessionAtom);
  const [session, setSession] = useAtom(sessionAtom);
  const [isAuthEnabled, setIsAuthEnabled] = useAtom(isAuthEnabledAtom);

  const { address, isConnected } = useAccount();

  const [queryClient] = useAtom(queryClientAtom);

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
            // parentSession: parentSession ?? undefined,
          });

          setSession(response.data.session);
          setAuthenticationStatus("authenticated");
          queryClient.refetchQueries({ queryKey: ["userInfo"] });

          return true;
        } catch (error) {
          console.error(error);
          return false;
        }
      },

      signOut: async () => {
        // try {
        //   if (!session?.id) {
        //     throw new Error("No session found");
        //   }

        //   await api.authControllerLogout();
        // } catch (error) {
        //   console.error(error);
        // }
        setAuthenticationStatus("unauthenticated");
      },
    });
  }, []);

  // console.log("isConnected", isConnected);
  // console.log("address", address);
  // console.log("session", session);
  // console.log("authenticationStatus", authenticationStatus);

  const propsAuthStatus = useQuery({
    queryKey: ["auth-status-check"],
    queryFn: async () => {
      try {
        if (!session?.id) {
          throw new Error("No session id found");
        }

        const response = await api.authControllerGetSession();

        if (response.data.isActive === false) {
          setSession(null);
          setAuthenticationStatus("unauthenticated");
        } else {
          if (!isEqual(session, response.data)) {
            setSession(response.data);
          }
        }
      } catch (error) {
        console.error(error);
        setSession(null);
        setAuthenticationStatus("unauthenticated");
      }

      return true;
    },
    ...defaultQueryOptions,
    enabled: !!session?.id,
  });

  return (
    <RainbowKitAuthenticationProvider
      adapter={authenticationAdapter}
      status={authenticationStatus}
      enabled={isAuthEnabled}
    >
      {children}
    </RainbowKitAuthenticationProvider>
  );
}
