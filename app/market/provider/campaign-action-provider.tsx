import React, { createContext, useContext, ReactNode, useMemo } from "react";
import toast from "react-hot-toast";
import { ErrorAlert } from "@/components/composables";
import { useAccount } from "wagmi";
import { MarketTransactionType } from "@/store/market/use-market-manager";
import { BaseEnrichedTokenDataWithClaimInfo } from "royco/api";
import { AbiCoder } from "ethers";
import { IncentiveLockerABI } from "../constants/abi";
import { TypeTransactionDetail } from "@/store/global/use-transaction-manager";
import { v4 as uuid } from "uuid";

export function CampaignActionProvider({ children }: { children: ReactNode }) {
  const { address } = useAccount();

  const getClaimIncentiveTransaction = async (
    incentive: BaseEnrichedTokenDataWithClaimInfo
  ): Promise<TypeTransactionDetail | undefined> => {
    try {
      if (!address) {
        toast.custom(
          <ErrorAlert message="No account found. Please connect your wallet and try again." />
        );
        return;
      }

      const claimInfo = incentive.claimInfo?.v2;
      if (!claimInfo) {
        toast.custom(
          <ErrorAlert message="Incentive claim information not found." />
        );
        return;
      }

      const [, , campaignId] = claimInfo?.rawMarketRefId.split("_") || [];
      if (!campaignId) {
        toast.custom(<ErrorAlert message="Campaign ID not found." />);
        return;
      }

      const incentiveLocker = claimInfo.incentiveLocker;
      if (!incentiveLocker) {
        toast.custom(
          <ErrorAlert message="Incentive locker contract not found." />
        );
        return;
      }

      let claimParams = null;
      if (
        Number(claimInfo.claimChainId) !== Number(claimInfo.submissionChainId)
      ) {
        claimParams = AbiCoder.defaultAbiCoder().encode(
          ["uint256[]", "uint256", "bytes32[]"],
          [
            claimInfo.cumulativeAmounts || [],
            claimInfo.epoch,
            claimInfo.proof || [],
          ]
        );
      }

      const steps: any[] = [];

      steps.push({
        id: uuid(),
        type: MarketTransactionType.ClaimIncentives,
        label: `Claim ${incentive.symbol} Incentive`,
        chainId: Number(claimInfo.claimChainId),
        data: {
          address: incentiveLocker,
          abi: IncentiveLockerABI,
          functionName: "claimIncentives",
          args: [campaignId, address, claimParams],
        },
      });

      return {
        type: MarketTransactionType.ClaimIncentives,
        title: "Claim Incentive",
        successTitle: "Incentive Claimed",
        steps,
        token: {
          data: incentive,
          amount: incentive.tokenAmount,
        },
      };
    } catch (error) {
      toast.custom(<ErrorAlert message="Failed to claim incentive." />);
      return;
    }
  };

  return (
    <CampaignActionContext.Provider
      value={{
        getClaimIncentiveTransaction,
      }}
    >
      {children}
    </CampaignActionContext.Provider>
  );
}

interface CampaignActions {
  getClaimIncentiveTransaction: (
    incentive: BaseEnrichedTokenDataWithClaimInfo
  ) => Promise<TypeTransactionDetail | undefined>;
}

const CampaignActionContext = createContext<CampaignActions | null>(null);

export function useCampaignActions() {
  const context = useContext(CampaignActionContext);

  if (!context) {
    throw new Error(
      "useCampaignActions must be used within a CampaignActionProvider"
    );
  }

  return context;
}
