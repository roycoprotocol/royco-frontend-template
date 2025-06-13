"use client";

import React, { useMemo } from "react";
import { useAtomValue } from "jotai";
import { cn } from "@/lib/utils";
import formatNumber from "@/utils/numbers";
import { SlideUpWrapper } from "@/components/animations";
import { AlertIndicator, TokenDisplayer } from "@/components/common";
import { Button } from "@/components/ui/button";
import { loadableCampaignMarketPositionAtom } from "@/store/market/market";
import { GradientText } from "@/app/vault/common/gradient-text";
import { BaseEnrichedTokenDataWithClaimInfo } from "royco/api";
import { useCampaignActions } from "@/app/market/provider/campaign-action-provider";
import {
  PrimaryLabel,
  TertiaryLabel,
} from "@/app/_components/common/custom-labels";
import { LoadingIndicator } from "@/app/_components/common/loading-indicator";
import { useTransactionManager } from "@/store/global/use-transaction-manager";

interface RewardsProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Rewards = React.forwardRef<HTMLDivElement, RewardsProps>(
  ({ className, ...props }, ref) => {
    const { setTransactions } = useTransactionManager();

    const { isLoading, data: propData } = useAtomValue(
      loadableCampaignMarketPositionAtom
    );

    const { getClaimIncentiveTransaction } = useCampaignActions();

    const incentives = useMemo(() => {
      return {
        data: propData?.data[0]?.unclaimedIncentiveTokens || [],
      };
    }, [propData]);

    const handleClaimIncentive = async (
      incentive: BaseEnrichedTokenDataWithClaimInfo
    ) => {
      const claimIncentiveTransaction =
        await getClaimIncentiveTransaction(incentive);

      if (claimIncentiveTransaction) {
        setTransactions({ ...claimIncentiveTransaction });
      }
    };

    return (
      <div ref={ref} {...props} className={cn(className)}>
        <PrimaryLabel>Rewards</PrimaryLabel>

        {isLoading ? (
          <div className="mt-4 rounded-sm border border-_divider_">
            <LoadingIndicator />
          </div>
        ) : !incentives.data || incentives.data.length === 0 ? (
          <AlertIndicator className="mt-4 rounded-sm border border-_divider_ py-10">
            <span className="text-base">No reward distributions yet.</span>
          </AlertIndicator>
        ) : (
          <div className="mt-4">
            <TertiaryLabel>TOKENS</TertiaryLabel>

            <div className="mt-2">
              {incentives.data.map((incentive, index) => (
                <SlideUpWrapper key={index} delay={0.2 + index * 0.1}>
                  <div className="flex items-center justify-between border-b border-_divider_ py-4">
                    <PrimaryLabel className="text-base font-normal">
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
          </div>
        )}
      </div>
    );
  }
);
