import React, { createContext, useContext, ReactNode } from "react";
import { useBoringVaultV1 } from "boring-vault-ui";
import { useEthersSigner } from "../../hook/useEthersSigner";
import toast from "react-hot-toast";
import { ErrorAlert } from "@/components/composables";
import { useAtomValue } from "jotai";
import { boringVaultAtom } from "@/store/vault/atom/boring-vault";
import { ethers } from "ethers";
import { abi } from "@/app/vault/constants/abi/boring-vault";

interface BoringVaultActions {
  deposit: (amount: number) => Promise<any>;
  withdraw: (amount: number) => Promise<any>;
  cancelWithdraw: () => Promise<any>;
  claimIncentive: (rewardIds: string[]) => Promise<any>;
}

const BoringVaultActionContext = createContext<BoringVaultActions | null>(null);

export function BoringVaultActionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const signer = useEthersSigner();

  const {
    deposit: boringDeposit,
    queueBoringWithdraw: boringWithdraw,
    boringQueueCancel: boringCancelWithdraw,
  } = useBoringVaultV1();

  const boringVault = useAtomValue(boringVaultAtom);

  const deposit = async (amount: number) => {
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
      const token = {
        address: boringVault.baseAsset.address,
        decimals: boringVault.baseAsset.decimals,
      };

      const response = await boringDeposit(signer, amount.toString(), token);

      if (response.error) {
        const error =
          response.error.length > 50 ? "Deposit failed" : response.error;
        toast.custom(<ErrorAlert message={error} />);
      }

      return response;
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
      const discount = (boringVault.baseAsset.maxDiscount / 100).toString();
      const validDays = Math.ceil(
        1 + boringVault.baseAsset.minimumSecondsToDeadline / 86400
      ).toString();

      const token = {
        address: boringVault.baseAsset.address,
        decimals: boringVault.baseAsset.decimals,
      };

      const shares =
        (amount * 10 ** token.decimals) /
        (boringVault.sharePriceInBaseAsset * 10 ** boringVault.decimals);

      const response = await boringWithdraw(
        signer,
        shares.toString(),
        token,
        discount,
        validDays
      );

      if (response.error) {
        const error =
          response.error.length > 50 ? "Withdrawal failed" : response.error;
        toast.custom(<ErrorAlert message={error} />);
      }

      return response;
    } catch (error) {
      toast.custom(<ErrorAlert message="Withdrawal failed" />);
      throw error;
    }
  };

  const cancelWithdraw = async () => {
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
      const token = {
        address: boringVault.baseAsset.address,
        decimals: boringVault.baseAsset.decimals,
      };

      const response = await boringCancelWithdraw(signer, token);

      if (response.error) {
        const error =
          response.error.length > 50
            ? "Cancel withdrawal failed"
            : response.error;
        toast.custom(<ErrorAlert message={error} />);
      }

      return response;
    } catch (error) {
      toast.custom(<ErrorAlert message="Cancel withdrawal failed" />);
      throw error;
    }
  };

  const claimIncentive = async (rewardIds: string[]) => {
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
      const response = await claimRewards(
        signer,
        boringVault.account.rewards.vaultAddress,
        rewardIds
      );

      if (response.error) {
        const error =
          response.error.length > 50
            ? "Claim incentives failed"
            : response.error;
        toast.custom(<ErrorAlert message={error} />);
      }

      return response;
    } catch (error) {
      toast.custom(<ErrorAlert message="Claim incentives failed" />);
      throw error;
    }
  };

  return (
    <BoringVaultActionContext.Provider
      value={{ deposit, withdraw, cancelWithdraw, claimIncentive }}
    >
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

export const claimRewards = async (
  signer: any,
  vaultAddress: string,
  rewardIds: string[]
): Promise<{
  initiated: boolean;
  loading: boolean;
  success?: boolean;
  error?: string;
  tx_hash?: string;
}> => {
  try {
    const contract = new ethers.Contract(vaultAddress, abi, signer);
    const tx = await contract.claimRewards(rewardIds);

    const receipt = await tx.wait();

    return {
      initiated: false,
      loading: false,
      success: true,
      tx_hash: receipt.transactionHash,
    };
  } catch (error: any) {
    return {
      initiated: false,
      loading: false,
      success: false,
      error: error.message || "Failed to claim rewards.",
    };
  }
};
