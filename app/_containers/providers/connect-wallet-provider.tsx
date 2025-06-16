"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { SANCTIONED_ADDRESSES } from "@celo/compliance";
import { useAccount, useDisconnect } from "wagmi";
import { ConnectWalletAlertModal } from "@/app/_components/header/connect-wallet-button/connect-wallet-alert-modal";
import { authenticationStatusAtom } from "@/store/global";
import { useAtom } from "jotai";
import { queryClientAtom } from "jotai-tanstack-query";
import { useAtomValue } from "jotai";
import { api } from "@/app/api/royco";
import { linkWalletAtom } from "@/store/global";
import { connectedWalletsAtom } from "@/store/global";

export const restrictedCountries = ["US", "CU", "IR", "KP", "RU", "SY", "IQ"];

interface ConnectWalletContextType {
  connectWalletModal: () => Promise<void>;
  connectAccountModal: () => Promise<void>;
}

const ConnectWalletContext = createContext<
  ConnectWalletContextType | undefined
>(undefined);

export const ConnectWalletProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const queryClient = useAtomValue(queryClientAtom);
  const [linkWallet, setLinkWallet] = useAtom(linkWalletAtom);

  const [authenticationStatus, setAuthenticationStatus] = useAtom(
    authenticationStatusAtom
  );

  const { isConnected, address } = useAccount();
  const { openConnectModal, connectModalOpen } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { disconnect } = useDisconnect();
  const [connectedWallets, setConnectedWallets] = useAtom(connectedWalletsAtom);

  const [isConnectWalletAlertOpen, setIsConnectWalletAlertOpen] =
    useState(false);

  const connectWalletModal = async () => {
    try {
      const frontendTag = process.env.NEXT_PUBLIC_FRONTEND_TAG ?? "default";

      const nonGeoBlockedFrontendTags = ["dev", "internal", "testnet"];

      if (!nonGeoBlockedFrontendTags.includes(frontendTag)) {
        try {
          const response = await fetch("https://freeipapi.com/api/json/");
          const data = await response.json();

          if (
            data.countryCode &&
            restrictedCountries.includes(data.countryCode)
          ) {
            setIsConnectWalletAlertOpen(true);
            return;
          }
        } catch (e) {
          console.log("error", e);
        }
      }

      openConnectModal?.();
    } catch (e) {
      console.log(e);
    }
  };

  const connectAccountModal = async () => {
    openAccountModal?.();
  };

  const disconnectWalletIfSanctioned = async () => {
    if (
      isConnected &&
      !!address &&
      [...SANCTIONED_ADDRESSES].includes(address.toLowerCase() as any)
    ) {
      disconnect();
    }
  };

  const reconnectSession = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (
      address &&
      authenticationStatus === "unauthenticated" &&
      !connectModalOpen
    ) {
      try {
        const response = await api
          .authControllerRevalidateSession()
          .then((res) => res.data);

        if (response.status) {
          setAuthenticationStatus("authenticated");

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
        }
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
      }
    }
  };

  useEffect(() => {
    reconnectSession();
  }, [address, isConnected]);

  useEffect(() => {
    disconnectWalletIfSanctioned();
  }, [isConnected, address]);

  return (
    <ConnectWalletContext.Provider
      value={{
        connectWalletModal,
        connectAccountModal,
      }}
    >
      {/* <button
        onClick={() => {
          console.log("disconnecting");
          disconnect();
          // setAuthenticationStatus("unauthenticated");
          // setSession(null);
        }}
      >
        Click Me to disconnect
      </button> */}

      {children}

      <ConnectWalletAlertModal
        isOpen={isConnectWalletAlertOpen}
        onOpenModal={(open) => {
          setIsConnectWalletAlertOpen(open);
        }}
      />
    </ConnectWalletContext.Provider>
  );
};

export const useConnectWallet = () => {
  const context = useContext(ConnectWalletContext);
  if (context === undefined) {
    throw new Error(
      "useConnectWallet must be used within a ConnectWalletProvider"
    );
  }
  return context;
};
