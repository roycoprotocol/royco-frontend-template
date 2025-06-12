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
import { AlertIndicator, TokenDisplayer } from "@/components/common";
import { Button } from "@/components/ui/button";
import { loadableCampaignMarketPositionAtom } from "@/store/market/market";
import { GradientText } from "@/app/vault/common/gradient-text";
import { BaseEnrichedTokenDataWithClaimInfo } from "royco/api";
import { useCampaignActions } from "@/app/market/provider/campaign-action-provider";
import { ErrorAlert } from "@/components/composables";
import toast from "react-hot-toast";
import {
  MarketTransactionType,
  useMarketManager,
} from "@/store/market/use-market-manager";

export const Rewards = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isLoading, data: propData } = useAtomValue(
    loadableCampaignMarketPositionAtom
  );

  const { setTransactions } = useMarketManager();

  const { getClaimIncentiveTransaction } = useCampaignActions();

  const incentives = useMemo(() => {
    return {
      data: propData?.data[0]?.unclaimedIncentiveTokens || [],
    };
  }, [propData]);

  const handleClaimIncentive = async (
    incentive: BaseEnrichedTokenDataWithClaimInfo
  ) => {
    if (!incentive) {
      toast.custom(<ErrorAlert message="Incentive is required" />);
      return;
    }

    const claimIncentiveTransactions =
      await getClaimIncentiveTransaction(incentive);

    if (
      claimIncentiveTransactions &&
      claimIncentiveTransactions.steps.length > 0
    ) {
      const transactions = {
        type: MarketTransactionType.ClaimIncentives,
        title: "Claim Incentive",
        successTitle: "Incentive Claimed",
        description: claimIncentiveTransactions.description,
        steps: claimIncentiveTransactions.steps,
        metadata: claimIncentiveTransactions.metadata,
        warnings: claimIncentiveTransactions.warnings,
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
      <PrimaryLabel className="text-2xl font-medium  text-_primary_">
        Rewards
      </PrimaryLabel>

      {(incentives.data && incentives.data.length) > 0 ? (
        <div className="mt-4">
          <SecondaryLabel className="text-xs font-medium tracking-wide text-_secondary_">
            TOKENS
          </SecondaryLabel>

          {incentives.data.map((incentive, index) => (
            <SlideUpWrapper key={index} delay={0.2 + index * 0.1}>
              <div className="flex items-center justify-between border-b border-_divider_ py-4">
                <PrimaryLabel className="text-base font-normal text-_primary_">
                  <div className="flex items-center gap-3">
                    <TokenDisplayer
                      size={6}
                      tokens={[incentive]}
                      symbols={false}
                    />

                    {incentive.tokenAmount > 0 && (
                      <span>
                        {formatNumber(
                          incentive.tokenAmount,
                          { type: "number" },
                          {
                            average: false,
                          }
                        )}
                      </span>
                    )}

                    <span>{incentive.label || incentive.symbol}</span>
                  </div>
                </PrimaryLabel>

                {(incentive.rawMetadata as any)?.isClaimable === false ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm font-medium hover:bg-success/10 hover:text-primary"
                  >
                    <GradientText>
                      {(incentive.rawMetadata as any).claimText}
                    </GradientText>
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm font-medium hover:bg-success/10 hover:text-primary"
                    onClick={() => handleClaimIncentive(incentive)}
                  >
                    <GradientText>Claim</GradientText>
                  </Button>
                )}
              </div>
            </SlideUpWrapper>
          ))}
        </div>
      ) : (
        <AlertIndicator className="mt-4 rounded-sm border border-_divider_ py-10">
          <span className="text-base">No reward distributions yet.</span>
        </AlertIndicator>
      )}
    </div>
  );
});
