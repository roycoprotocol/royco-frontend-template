import React, { createContext, useContext, ReactNode } from "react";
import { useBoringVaultV1 } from "boring-vault-ui";
import { useEthersSigner } from "../../hook/useEthersSigner";
import toast from "react-hot-toast";
import { ErrorAlert } from "@/components/composables";
import { useAtomValue } from "jotai";
import { boringVaultAtom } from "@/store/vault/atom/boring-vault";

interface BoringVaultActions {
  deposit: (amount: number) => Promise<void>;
  withdraw: (amount: number) => Promise<void>;
}

const BoringVaultActionContext = createContext<BoringVaultActions | null>(null);

export function BoringVaultActionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const signer = useEthersSigner();

  const { deposit: boringDeposit, queueBoringWithdraw } = useBoringVaultV1();

  const boringVault = useAtomValue(boringVaultAtom);

  const deposit = async (amount: number) => {
    if (!signer) {
      toast.custom(
        <ErrorAlert message="No signer found. Please connect your wallet and try again." />
      );
      return;
    }

    try {
      const token = boringVault?.base_asset as any;

      const response = await boringDeposit(signer, amount.toString(), token);

      if (response.error) {
        toast.custom(<ErrorAlert message={response.error} />);
      }
    } catch (error) {
      toast.custom(<ErrorAlert message="Deposit failed" />);
      throw error;
    }
  };

  const withdraw = async (amount: number) => {
    if (!signer) {
      toast.custom(
        <ErrorAlert message="No signer found. Please connect your wallet and try again." />
      );
      return;
    }

    if (!boringVault) {
      toast.custom(<ErrorAlert message="Vault data not available" />);
      return;
    }

    try {
      const discount = "0.001";
      const validDays = "4";

      const token = boringVault?.base_asset as any;

      const shares =
        (amount * 10 ** token.decimals) /
        (boringVault.share_price * 10 ** boringVault.decimals);

      await queueBoringWithdraw(
        signer,
        shares.toString(),
        token,
        discount,
        validDays
      );
    } catch (error) {
      toast.custom(<ErrorAlert message="Withdrawal failed" />);
      throw error;
    }
  };

  return (
    <BoringVaultActionContext.Provider value={{ deposit, withdraw }}>
      {children}
    </BoringVaultActionContext.Provider>
  );
}

// Hook to use the vault actions
export function useBoringVaultActions() {
  const context = useContext(BoringVaultActionContext);

  if (!context) {
    throw new Error(
      "useBoringVaultActions must be used within a BoringVaultActionProvider"
    );
  }

  return context;
}
