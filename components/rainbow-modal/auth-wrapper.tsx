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
  connectedWalletsAtom,
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
  const [connectedWallets, setConnectedWallets] = useAtom(connectedWalletsAtom);

  const [linkWallet, setLinkWallet] = useAtom(linkWalletAtom);

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal, connectModalOpen } = useConnectModal();

  const [queryClient] = useAtom(queryClientAtom);

  const authenticationAdapter = useMemo(() => {
    return createAuthenticationAdapter({
      getNonce: async () => {
        const response = await api.authControllerGetNonce();

        if (response.data.isAlreadyLoggedIn) {
          setAuthenticationStatus("authenticated");
          queryClient.refetchQueries({ queryKey: ["userInfo"] });
          setLinkWallet(undefined);

          // Save wallet info
          const existingWalletIndex = connectedWallets.findIndex(
            (wallet) => wallet.id === response.data.walletInfo.id
          );
          let newConnectedWallets = connectedWallets;

          if (existingWalletIndex !== -1) {
            newConnectedWallets[existingWalletIndex].balanceUsd =
              response.data.walletInfo.balanceUsd;
          } else {
            newConnectedWallets.push({
              ...response.data.walletInfo,
              signature: response.data.signature,
            });
          }
          setConnectedWallets(newConnectedWallets);
        }

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
          statement:
            "Sign in with Ethereum to Royco app. Primary Type: Royco:AcceptTerms",
          uri: window.location.origin,
          version: "1",
          chainId,
          nonce,
          scheme: "https",
        });
      },

      verify: async ({ message, signature }) => {
        try {
          const response = await api
            .authControllerLogin({
              message,
              signature,
              linkWallet: linkWallet,
            })
            .then((res) => res.data);

          setAuthenticationStatus("authenticated");
          queryClient.refetchQueries({ queryKey: ["userInfo"] });
          setLinkWallet(undefined);

          // Save wallet info
          const existingWalletIndex = connectedWallets.findIndex(
            (wallet) => wallet.id === response.walletInfo.id
          );
          let newConnectedWallets = connectedWallets;

          if (existingWalletIndex !== -1) {
            newConnectedWallets[existingWalletIndex].balanceUsd =
              response.walletInfo.balanceUsd;
          } else {
            newConnectedWallets.push({
              ...response.walletInfo,
              signature: response.signature,
            });
          }
          setConnectedWallets(newConnectedWallets);

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

          setAuthenticationStatus("authenticated");

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
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    enabled: isAuthenticated && isAuthEnabled,
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
