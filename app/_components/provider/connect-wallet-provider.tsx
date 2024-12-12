"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { ConnectWalletAlertModal } from "../ui/connect-wallet-alert-modal";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";

export const restrictedCountries = [
  "US",
  "CU",
  "IR",
  "KP",
  "RU",
  "SY",
  "IQ",
  "CA",
];

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
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();

  const [isConnectWalletAlertOpen, setIsConnectWalletAlertOpen] =
    useState(false);

  const connectWalletModal = async () => {
    try {
      if (process.env.NEXT_PUBLIC_IS_GEOBLOCKED === "TRUE") {
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
