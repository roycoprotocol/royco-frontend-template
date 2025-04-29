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
import { ConnectWalletAlertModal } from "@/app/_components/common/connect-wallet-button/connect-wallet-alert-modal";

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
  const { isConnected, address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { disconnect } = useDisconnect();

  const [isConnectWalletAlertOpen, setIsConnectWalletAlertOpen] =
    useState(false);

  const connectWalletModal = async () => {
    try {
      const frontendTag = process.env.NEXT_PUBLIC_FRONTEND_TAG ?? "default";

      const nonGeoBlockedFrontendTags = ["dev", "internal", "testnet"];

      if (!nonGeoBlockedFrontendTags.includes(frontendTag)) {
        const response = await fetch("https://freeipapi.com/api/json/");
        const data = await response.json();

        if (
          data.countryCode &&
          restrictedCountries.includes(data.countryCode)
        ) {
          setIsConnectWalletAlertOpen(true);
          return;
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
