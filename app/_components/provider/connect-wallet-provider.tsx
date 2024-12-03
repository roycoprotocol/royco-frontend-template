"use client";

import { useWeb3Modal } from "@web3modal/wagmi/react";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { ConnectWalletAlertModal } from "../ui/connect-wallet-alert-modal";
import { useAccount, useDisconnect } from "wagmi";

export const restrictedCountries = ["US", "CU", "IR", "KP", "RU", "SY", "IQ"];

interface ConnectWalletContextType {
  connectWallet: () => Promise<void>;
  isConnectWalletAlertOpen: boolean;
  setIsConnectWalletAlertOpen: (open: boolean) => void;
}

const ConnectWalletContext = createContext<
  ConnectWalletContextType | undefined
>(undefined);

export const ConnectWalletProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { open } = useWeb3Modal();
  const { isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const [isConnectWalletAlertOpen, setIsConnectWalletAlertOpen] =
    useState(false);

  useEffect(() => {
    if (isConnected && !connector) {
      disconnect();
    }
  }, [isConnected, connector, disconnect]);

  useEffect(() => {
    const checkRestriction = async () => {
      if (isConnected && process.env.NEXT_PUBLIC_IS_GEOBLOCKED === "TRUE") {
        try {
          const response = await fetch("https://freeipapi.com/api/json/");
          const data = await response.json();

          if (
            data.countryCode &&
            restrictedCountries.includes(data.countryCode)
          ) {
            setIsConnectWalletAlertOpen(true);
            disconnect();
          }
        } catch (e) {
          console.log(e);
        }
      }
    };

    checkRestriction();
  }, [isConnected]);

  const connectWallet = async () => {
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

      open();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ConnectWalletContext.Provider
      value={{
        connectWallet,
        isConnectWalletAlertOpen,
        setIsConnectWalletAlertOpen,
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
