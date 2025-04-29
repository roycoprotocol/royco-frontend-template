"use client";

import React, { useMemo } from "react";
import { useAtomValue } from "jotai";

import { cn } from "@/lib/utils";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import formatNumber from "@/utils/numbers";
import { SlideUpWrapper } from "@/components/animations";

import {
  vaultManagerAtom,
  vaultMetadataAtom,
} from "@/store/vault/vault-manager";
import { AlertIndicator, TokenDisplayer } from "@/components/common";
import { GradientText } from "../../../common/gradient-text";
import { InfoSquareIcon } from "../../../assets/info-square";
import toast from "react-hot-toast";
import { ErrorAlert } from "@/components/composables";
import { VaultPositionUnclaimedRewardToken } from "@/app/api/royco/data-contracts";
import { useVaultManager } from "@/store/vault/use-vault-manager";
import { useBoringVaultActions } from "@/app/vault/providers/boring-vault/boring-vault-action-provider";
import { Button } from "@/components/ui/button";

export const Rewards = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const vault = useAtomValue(vaultManagerAtom);
  const { data } = useAtomValue(vaultMetadataAtom);

  const { setTransactions } = useVaultManager();

  const { getClaimIncentiveTransaction } = useBoringVaultActions();

  const incentives = useMemo(() => {
    return {
      data: vault?.account?.rewards?.unclaimedRewardTokens || [],
    };
  }, [vault]);

  const handleClaimIncentive = async (
    incentive: VaultPositionUnclaimedRewardToken
  ) => {
    if (!incentive) {
      toast.custom(<ErrorAlert message="Incentive is required" />);
      return;
    }

    const claimIncentiveTransactions = await getClaimIncentiveTransaction(
      incentive.rewardIds
    );

    if (
      claimIncentiveTransactions &&
      claimIncentiveTransactions.steps.length > 0
    ) {
      const transactions = {
        type: "claimIncentives" as const,
        title: "Claim Incentive",
        successTitle: "Incentive Claimed",
        description: claimIncentiveTransactions.description,
        steps: claimIncentiveTransactions.steps || [],
        metadata: claimIncentiveTransactions.metadata,
        token: {
          data: incentive,
          amount: incentive.tokenAmount,
        },
      };

      setTransactions(transactions);
    }
  };

  return (
    <div ref={ref} {...props} className={cn(className)}>
      <PrimaryLabel className="text-2xl font-medium text-_primary_">
        Rewards
      </PrimaryLabel>

      {/**
       * Estimated APY
       */}
      <div className="mt-4">
        <SecondaryLabel className="text-xs font-medium text-_secondary_">
          ESTIMATED APY
        </SecondaryLabel>

        <PrimaryLabel className="mt-2 text-2xl font-normal">
          <GradientText>
            {formatNumber(data.yieldRate, {
              type: "percent",
            })}
          </GradientText>
        </PrimaryLabel>

        <SecondaryLabel className="mt-2 text-xs font-medium text-_secondary_">
          <div className="flex items-center gap-1">
            <span className="flex gap-1">
              Calculated on
              <span className="border-b-2 border-dotted border-current">
                Base
              </span>
              Assumptions
            </span>
            <InfoSquareIcon />
          </div>
        </SecondaryLabel>
      </div>

      {/**
       * Rewards
       */}
      <div className="mt-4 grid grid-cols-1 gap-x-6 sm:grid-cols-2">
        {incentives.data && incentives.data.length > 0 ? (
          incentives.data.map((incentive, index) => (
            <SlideUpWrapper key={index} delay={0.3 + index * 0.1}>
              <div className="flex items-center justify-between border-b border-_divider_ py-4">
                <PrimaryLabel className="text-base font-normal text-_primary_">
                  <div className="flex items-center gap-3 ">
                    <TokenDisplayer
                      size={6}
                      tokens={[incentive]}
                      symbols={false}
                    />

                    <span>
                      {formatNumber(
                        incentive.tokenAmount,
                        { type: "number" },
                        {
                          average: false,
                        }
                      )}
                    </span>

                    <span>{incentive.symbol}</span>
                  </div>
                </PrimaryLabel>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm font-semibold hover:bg-success/10 hover:text-primary"
                  onClick={() => handleClaimIncentive(incentive)}
                >
                  <GradientText>Claim</GradientText>
                </Button>
              </div>
            </SlideUpWrapper>
          ))
        ) : (
          <AlertIndicator className="col-span-full rounded-sm border border-_divider_ py-10">
            <span className="text-base">No rewards available</span>
          </AlertIndicator>
        )}
      </div>
    </div>
  );
});
