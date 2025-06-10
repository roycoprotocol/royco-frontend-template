import React, { createContext, useContext, ReactNode, useMemo } from "react";
import toast from "react-hot-toast";
import { ErrorAlert } from "@/components/composables";
import { useAccount } from "wagmi";
import { MarketTransactionType } from "@/store/market/use-market-manager";
import { IncentiveLockerABI } from "../components/campaign/constants/abi";
import { BaseEnrichedTokenDataWithClaimInfo } from "royco/api";
import { AbiCoder } from "ethers";

export function CampaignActionProvider({ children }: { children: ReactNode }) {
  const { address } = useAccount();

  const getClaimIncentiveTransaction = async (
    incentive: BaseEnrichedTokenDataWithClaimInfo
  ) => {
    try {
      if (!address) {
        toast.custom(
          <ErrorAlert message="No account found. Please connect your wallet and try again." />
        );
        return;
      }

      const transactions = [];

      const claimInfo = incentive.claimInfo?.v2;

      if (!claimInfo) {
        toast.custom(<ErrorAlert message="Claim info not found." />);
        return;
      }

      const [, , campaignId] = claimInfo?.rawMarketRefId.split("_") || [];

      if (!campaignId) {
        toast.custom(<ErrorAlert message="Campaign ID not found." />);
        return;
      }

      const claimParams = AbiCoder.defaultAbiCoder().encode(
        ["uint256[]", "uint256", "bytes32[]"],
        [
          claimInfo.cumulativeAmounts || [],
          claimInfo.epoch,
          claimInfo.proof || [],
        ]
      );

      transactions.push({
        type: MarketTransactionType.ClaimIncentives,
        label: `Claim ${incentive.symbol} Incentive`,
        data: {
          address: incentive.contractAddress,
          abi: IncentiveLockerABI,
          functionName: "claimIncentives",
          args: [campaignId, address, claimParams],
        },
      });

      return { steps: transactions };
    } catch (error) {
      console.log({ error });
      toast.custom(<ErrorAlert message="Failed to claim incentive." />);
      return { steps: [] };
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

type TypeCampaignTransactionReturn = {
  description?: string;
  steps: any[];
  metadata?: {
    label: string;
    value: string;
  }[];
  warnings?: React.ReactNode;
};

interface CampaignActions {
  getClaimIncentiveTransaction: (
    incentive: BaseEnrichedTokenDataWithClaimInfo
  ) => Promise<TypeCampaignTransactionReturn | undefined>;
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
