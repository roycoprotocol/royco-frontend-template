import React, { createContext, useContext, ReactNode, useMemo } from "react";
import toast from "react-hot-toast";
import { ErrorAlert } from "@/components/composables";
import { useAtomValue } from "jotai";
import { boringVaultAtom } from "@/store/vault/atom/boring-vault";
import BigNumber from "bignumber.js";
import { erc20Abi } from "viem";
import { readContract } from "@wagmi/core";
import { config } from "@/components/rainbow-modal/modal-config";
import { useAccount } from "wagmi";
import {
  BoringVaultABI,
  BoringTellerABI,
  BoringQueueABI,
} from "../../constants/abi";
import { formatDate } from "date-fns";
import { vaultMetadataAtom } from "@/store/vault/vault-manager";
import { VaultTransactionType } from "@/store/vault/use-vault-manager";

export function BoringVaultActionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { address } = useAccount();
  const { data } = useAtomValue(vaultMetadataAtom);

  const boringVault = useAtomValue(boringVaultAtom);

  const getDepositTransaction = async (amount: number) => {
    try {
      if (!address) {
        toast.custom(
          <ErrorAlert message="No account found. Please connect your wallet and try again." />
        );
        return;
      }

      if (!boringVault) {
        toast.custom(<ErrorAlert message="Vault data not available." />);
        return;
      }

      const transactions = [];

      const rawAmount = new BigNumber(amount).times(
        new BigNumber(10).pow(boringVault.baseAsset.decimals)
      );

      // @ts-ignore
      const allowance = await readContract(config, {
        address: boringVault.baseAsset.contractAddress,
        abi: erc20Abi,
        functionName: "allowance",
        args: [address, boringVault.contracts.vault],
      });

      if (new BigNumber(allowance.toString()).gte(rawAmount)) {
        transactions.push({
          type: VaultTransactionType.Approve,
          label: `Approve ${boringVault.baseAsset.symbol}`,
          txStatus: "success",
        });
      } else if (new BigNumber(allowance.toString()).lt(rawAmount)) {
        transactions.push({
          type: VaultTransactionType.Approve,
          label: `Approve ${boringVault.baseAsset.symbol}`,
          data: {
            address: boringVault.baseAsset.contractAddress,
            abi: erc20Abi,
            functionName: "approve",
            args: [boringVault.contracts.vault, rawAmount.toFixed(0)],
          },
        });
      }

      transactions.push({
        type: VaultTransactionType.Deposit,
        label: `Deposit ${boringVault.baseAsset.symbol}`,
        data: {
          address: boringVault.contracts.teller,
          abi: BoringTellerABI,
          functionName: "deposit",
          args: [
            boringVault.baseAsset.contractAddress,
            rawAmount.toFixed(0),
            0,
          ],
        },
      });

      const metadata = [
        {
          label: "Timing",
          value: "Instant",
        },
        {
          label: "Source",
          value: address.slice(0, 6) + "..." + address.slice(-4),
        },
      ];

      const warnings = [
        "Incentives start after next rebalance. APY shown reflects projected returns that will apply after rebalancing.",
        "Depositing funds resets a 24-hour lockup on your entire balance, delaying withdrawals until the period ends.",
        "Withdrawing funds before 90 days will result in forfeiture of all rewards earned during that period.",
      ];

      return { steps: transactions, metadata, warnings };
    } catch (error) {
      toast.custom(
        <ErrorAlert message="Failed to create deposit transaction." />
      );
      return { steps: [] };
    }
  };

  const getWithdrawalTransaction = async (amount: number) => {
    try {
      if (!address) {
        toast.custom(
          <ErrorAlert message="No account found. Please connect your wallet and try again." />
        );
        return;
      }

      if (!boringVault) {
        toast.custom(<ErrorAlert message="Vault data not available." />);
        return;
      }

      if (boringVault.account.unlockTime > Date.now()) {
        toast.custom(
          <ErrorAlert
            message={`Withdrawals cannot be queued until 24 hours after deposit. Please wait until ${formatDate(boringVault.account.unlockTime, "MMM dd, yyyy hh:mm aa")} to queue your withdrawal.`}
          />
        );
        return;
      }

      const transactions = [];

      const shares = new BigNumber(amount)
        .times(new BigNumber(10).pow(boringVault.baseAsset.decimals))
        .div(new BigNumber(boringVault.sharePriceInBaseAsset));

      // @ts-ignore
      const _assetParams: any = await readContract(config, {
        address: boringVault.contracts.boringQueue,
        abi: BoringQueueABI,
        functionName: "withdrawAssets",
        args: [boringVault.baseAsset.contractAddress],
      });

      const assetParams = {
        allowWithdraws: _assetParams[0],
        secondsToMaturity: Number(_assetParams[1]),
        minimumSecondsToDeadline: Number(_assetParams[2]),
        minDiscount: Number(_assetParams[3]),
        maxDiscount: Number(_assetParams[4]),
        minimumShares: new BigNumber(_assetParams[5]),
      };

      if (shares.lt(assetParams.minimumShares)) {
        const minimumSharesInBaseAsset = assetParams.minimumShares
          .times(new BigNumber(10).pow(boringVault.decimals))
          .times(new BigNumber(boringVault.sharePriceInBaseAsset))
          .div(new BigNumber(10).pow(boringVault.baseAsset.decimals));

        toast.custom(
          <ErrorAlert
            message={`Minimum withdrawal amount is ${minimumSharesInBaseAsset.toString()} ${boringVault.baseAsset.symbol}.`}
          />
        );
        return;
      }

      if (!assetParams.allowWithdraws) {
        toast.custom(
          <ErrorAlert
            message={`Withdrawals are not allowed for ${boringVault.baseAsset.symbol}.`}
          />
        );
        return;
      }

      const daysValid = new BigNumber(assetParams.minimumSecondsToDeadline)
        .div(86400)
        .ceil()
        .add(1);

      const minDiscount = new BigNumber(assetParams.minDiscount).div(100);
      const maxDiscount = new BigNumber(assetParams.maxDiscount).div(100);

      // @ts-ignore
      const allowance: bigint = await readContract(config, {
        address: boringVault.contracts.vault,
        abi: BoringVaultABI,
        functionName: "allowance",
        args: [address, boringVault.contracts.boringQueue],
      });

      if (new BigNumber(allowance.toString()).gte(shares)) {
        transactions.push({
          type: VaultTransactionType.Approve,
          label: `Approve ${data.name}`,
          txStatus: "success",
        });
      } else if (new BigNumber(allowance.toString()).lt(shares)) {
        transactions.push({
          type: VaultTransactionType.Approve,
          label: `Approve ${data.name}`,
          data: {
            address: boringVault.contracts.vault,
            abi: BoringVaultABI,
            functionName: "approve",
            args: [boringVault.contracts.boringQueue, shares.toFixed(0)],
          },
        });
      }

      transactions.push({
        type: VaultTransactionType.Withdraw,
        label: `Create ${boringVault.baseAsset.symbol} Withdraw Request`,
        data: {
          address: boringVault.contracts.boringQueue,
          abi: BoringQueueABI,
          functionName: "requestOnChainWithdraw",
          args: [
            boringVault.baseAsset.contractAddress,
            shares.toFixed(0),
            assetParams.maxDiscount.toFixed(0),
            new BigNumber(daysValid).times(86400).toFixed(0),
          ],
        },
      });

      const description = `Your withdrawal request will be submitted to the vault manager and processed within ${daysValid} business days. You will not earn rewards during this period.`;

      const metadata = [
        {
          label: "Slippage",
          value: `0% - ${maxDiscount}%`,
        },
        {
          label: "Timing",
          value: `Up to ${daysValid} Business Days`,
        },
        {
          label: "Destination",
          value: address.slice(0, 6) + "..." + address.slice(-4),
        },
      ];

      return {
        description,
        steps: transactions,
        metadata,
      };
    } catch (error) {
      toast.custom(
        <ErrorAlert message="Failed to create withdrawal transaction." />
      );
      return { steps: [] };
    }
  };

  const getCancelWithdrawalTransaction = async (metadata: any) => {
    try {
      if (!address) {
        toast.custom(
          <ErrorAlert message="No account found. Please connect your wallet and try again." />
        );
        return;
      }

      if (!boringVault) {
        toast.custom(<ErrorAlert message="Vault data not available." />);
        return;
      }

      const withdrawal = boringVault.account.withdrawals.find(
        (withdrawal: any) =>
          withdrawal.metadata.assetOut === metadata.assetOut &&
          withdrawal.metadata.creationTime === metadata.creationTime &&
          withdrawal.metadata.nonce === metadata.nonce
      );

      if (!withdrawal) {
        toast.custom(<ErrorAlert message="Withdrawal request not found." />);
        return;
      }

      if (withdrawal.status !== "initiated") {
        toast.custom(
          <ErrorAlert message={`Withdrawal request is ${withdrawal.status}.`} />
        );
        return;
      }

      const transactions = [];

      transactions.push({
        type: VaultTransactionType.CancelWithdraw,
        label: `Cancel ${boringVault.baseAsset.symbol} Withdraw Request`,
        data: {
          address: boringVault.contracts.boringQueue,
          abi: BoringQueueABI,
          functionName: "cancelOnChainWithdraw",
          args: [
            [
              withdrawal.metadata.nonce,
              withdrawal.metadata.user,
              withdrawal.metadata.assetOut,
              withdrawal.metadata.amountOfShares,
              withdrawal.metadata.amountOfAssets,
              withdrawal.metadata.creationTime,
              withdrawal.metadata.secondsToMaturity,
              withdrawal.metadata.secondsToDeadline,
            ],
          ],
        },
      });

      return {
        description: `The funds will return to vault.`,
        steps: transactions,
      };
    } catch (error) {
      toast.custom(
        <ErrorAlert message="Failed to cancel withdrawal request." />
      );
      return { steps: [] };
    }
  };

  const getRecoverWithdrawalTransaction = async (metadata: any) => {
    try {
      if (!address) {
        toast.custom(
          <ErrorAlert message="No account found. Please connect your wallet and try again." />
        );
        return;
      }

      if (!boringVault) {
        toast.custom(<ErrorAlert message="Vault data not available." />);
        return;
      }

      const withdrawal = boringVault.account.withdrawals.find(
        (withdrawal: any) =>
          withdrawal.metadata.assetOut === metadata.assetOut &&
          withdrawal.metadata.creationTime === metadata.creationTime &&
          withdrawal.metadata.nonce === metadata.nonce
      );

      if (!withdrawal) {
        toast.custom(<ErrorAlert message="Withdrawal request not found." />);
        return;
      }

      if (withdrawal.status !== "expired") {
        toast.custom(
          <ErrorAlert message={`Withdrawal request is ${withdrawal.status}.`} />
        );
        return;
      }

      const transactions = [];

      transactions.push({
        type: VaultTransactionType.RecoverWithdraw,
        label: `Recover ${boringVault.baseAsset.symbol} Withdraw Request`,
        data: {
          address: boringVault.contracts.boringQueue,
          abi: BoringQueueABI,
          functionName: "cancelOnChainWithdraw",
          args: [
            [
              withdrawal.metadata.nonce,
              withdrawal.metadata.user,
              withdrawal.metadata.assetOut,
              withdrawal.metadata.amountOfShares,
              withdrawal.metadata.amountOfAssets,
              withdrawal.metadata.creationTime,
              withdrawal.metadata.secondsToMaturity,
              withdrawal.metadata.secondsToDeadline,
            ],
          ],
        },
      });

      return {
        description: `The funds will return to your wallet.`,
        steps: transactions,
      };
    } catch (error) {
      toast.custom(<ErrorAlert message="Failed to recover withdrawal." />);
      return { steps: [] };
    }
  };

  const getClaimIncentiveTransaction = async (rewardIds: string[]) => {
    try {
      if (!address) {
        toast.custom(
          <ErrorAlert message="No account found. Please connect your wallet and try again." />
        );
        return;
      }

      if (!boringVault) {
        toast.custom(<ErrorAlert message="Vault data not available." />);
        return;
      }

      const transactions = [];

      transactions.push({
        type: VaultTransactionType.ClaimIncentives,
        label: `Claim ${boringVault.baseAsset.symbol} Incentive`,
        data: {
          address: boringVault.contracts.vault,
          abi: BoringVaultABI,
          functionName: "claimRewards",
          args: [rewardIds],
        },
      });

      const metadata = [
        {
          label: "Timing",
          value: "Instant",
        },
        {
          label: "Destination",
          value: address.slice(0, 6) + "..." + address.slice(-4),
        },
      ];

      return { steps: transactions, metadata };
    } catch (error) {
      toast.custom(<ErrorAlert message="Failed to claim incentive." />);
      return { steps: [] };
    }
  };

  return (
    <BoringVaultActionContext.Provider
      value={{
        getDepositTransaction,
        getWithdrawalTransaction,
        getCancelWithdrawalTransaction,
        getRecoverWithdrawalTransaction,
        getClaimIncentiveTransaction,
      }}
    >
      {children}
    </BoringVaultActionContext.Provider>
  );
}

type TypeVaultTransactionReturn = {
  description?: string;
  steps: any[];
  metadata?: {
    label: string;
    value: string;
  }[];
  warnings?: string[];
};

interface BoringVaultActions {
  getDepositTransaction: (
    amount: number
  ) => Promise<TypeVaultTransactionReturn | undefined>;
  getWithdrawalTransaction: (
    amount: number
  ) => Promise<TypeVaultTransactionReturn | undefined>;
  getCancelWithdrawalTransaction: (
    metadata: any
  ) => Promise<TypeVaultTransactionReturn | undefined>;
  getRecoverWithdrawalTransaction: (
    metadata: any
  ) => Promise<TypeVaultTransactionReturn | undefined>;
  getClaimIncentiveTransaction: (
    rewardIds: string[]
  ) => Promise<TypeVaultTransactionReturn | undefined>;
}

const BoringVaultActionContext = createContext<BoringVaultActions | null>(null);

export function useBoringVaultActions() {
  const context = useContext(BoringVaultActionContext);

  if (!context) {
    throw new Error(
      "useBoringVaultActions must be used within a BoringVaultActionProvider"
    );
  }

  return context;
}
