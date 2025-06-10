"use client";

import {
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
  useConnectModal,
} from "@rainbow-me/rainbowkit";
import { ReactNode, useMemo } from "react";
import { useAccount } from "wagmi";
import { createSiweMessage } from "viem/siwe";
import { useAtom, useAtomValue } from "jotai";
import {
  authenticationStatusAtom,
  linkWalletAtom,
  isAuthenticatedAtom,
} from "@/store/global";
import { api } from "@/app/api/royco";
import { useQuery } from "@tanstack/react-query";
import { defaultQueryOptions } from "@/utils/query";
import { isAuthEnabledAtom } from "@/store/global";
import { queryClientAtom } from "jotai-tanstack-query";
import { useDisconnect } from "wagmi";

export default function WalletProvider({ children }: { children: ReactNode }) {
  const [authenticationStatus, setAuthenticationStatus] = useAtom(
    authenticationStatusAtom
  );

  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const [isAuthEnabled, setIsAuthEnabled] = useAtom(isAuthEnabledAtom);

  const [linkWallet, setLinkWallet] = useAtom(linkWalletAtom);

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal, connectModalOpen } = useConnectModal();

  const [queryClient] = useAtom(queryClientAtom);

  const authenticationAdapter = useMemo(() => {
    return createAuthenticationAdapter({
      getNonce: async () => {
        const response = await api.authControllerGetNonce();
        return response.data.nonce;
      },

      createMessage: ({ nonce, address, chainId }) => {
        const domain =
          process.env.NEXT_PUBLIC_API_ENV === "development"
            ? "localhost"
            : window.location.host;

        return createSiweMessage({
          domain,
          address,
          statement: "Sign in with Ethereum to Royco app.",
          uri: window.location.origin,
          version: "1",
          chainId,
          nonce,
          scheme: "https",
        });
      },

      verify: async ({ message, signature }) => {
        try {
          await api.authControllerLogin({
            message,
            signature,
            linkWallet: linkWallet,
          });

          setAuthenticationStatus("authenticated");
          queryClient.refetchQueries({ queryKey: ["userInfo"] });
          setLinkWallet(undefined);
          return true;
        } catch (error) {
          console.error(error);
          return false;
        }
      },

      signOut: async () => {
        setAuthenticationStatus("unauthenticated");
      },
    });
  }, [linkWallet, queryClient, setAuthenticationStatus, setLinkWallet]);

  const propsAuthStatus = useQuery({
    queryKey: ["auth-status-check"],
    queryFn: async () => {
      if (!linkWallet) {
        try {
          const response = await api
            .authControllerRevalidateSession()
            .then((res: { data: any }) => res.data);
          return response;
        } catch (error: any) {
          if (
            error?.response?.status === 401 ||
            error?.response?.status === 403
          ) {
            if (isConnected) {
              setAuthenticationStatus("unauthenticated");
              openConnectModal?.();
            }
          }
          throw error;
        }
      }
    },
    ...defaultQueryOptions,
    enabled: isAuthenticated,
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
