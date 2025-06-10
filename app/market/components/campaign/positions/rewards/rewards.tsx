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
import { accountAddressAtom } from "@/store/global";
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
  const accountAddress = useAtomValue(accountAddressAtom);
  const { data: propData } = useAtomValue(loadableCampaignMarketPositionAtom);
  const { setTransactions } = useMarketManager();

  console.log({ propData });

  const { getClaimIncentiveTransaction } = useCampaignActions();

  const incentives = useMemo(() => {
    return {
      data:
        (propData?.data[0]
          ?.unclaimedIncentiveTokens as unknown as BaseEnrichedTokenDataWithClaimInfo[]) ||
        [],
    };

    return {
      data: [
        {
          id: "1-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          fdv: 60979967658.32,
          tag: null,
          name: "USDC",
          type: "token",
          image: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
          owner: null,
          price: 0.9998079671270521,
          source: "coinmarketcap",
          symbol: "USDC",
          chainId: 1,
          issuers: [],
          decimals: 6,
          searchId: "3408",
          rawAmount: "0",
          yieldRate: 0.012437694470514115,
          description: null,
          lastUpdated: "2025-06-10 21:38:00",
          rawMetadata: {
            claimChainId: 1,
            claimContract: "0xec3e31756ac393c1d8aac83d6401328d6baa3cff",
            rewardPerHour: "160256410",
            submissionChainId: 10,
            submissionContract: "0x599ca18ff6a9122416e16ddf61ea520d6ad26ffe",
          },
          searchIndex:
            "1-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48 usdc usdc 1 0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48 token ethereum",
          subTokenIds: null,
          tokenAmount: 0,
          totalSupply: 60991680065.86748,
          endTimestamp: "1751041200",
          perInputToken: 0,
          startTimestamp: "1748794800",
          tokenAmountUsd: 0,
          annualTokenRate: 0,
          contractAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          remainingRawAmount: "0",
          remainingTokenAmount: 0,
          remainingTokenAmountUsd: 0,
          isUnlocked: true,
          claimInfo: {
            v2: {
              rawMarketRefId: "1_2_3e184579c7529da3",
              submissionChainId: 10,
              submissionContract: "0x599ca18ff6a9122416e16ddf61ea520d6ad26ffe",
              claimChainId: 1,
              claimContract: "0xec3e31756ac393c1d8aac83d6401328d6baa3cff",
              epoch: 0,
              cumulativeAmounts: null,
              proof: null,
            },
          },
        },
      ],
    };
  }, [propData]);

  console.log({ incentives });

  const handleClaimIncentive = async (
    incentive: BaseEnrichedTokenDataWithClaimInfo
  ) => {
    if (accountAddress) {
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
    }
  };

  return (
    <div ref={ref} {...props} className={cn(className)}>
      <PrimaryLabel className="text-2xl font-medium  text-_primary_">
        Rewards
      </PrimaryLabel>

      {/**
       * Token Rewards
       */}

      {incentives.data.length ? (
        <div>
          {(incentives.data && incentives.data.length) > 0 && (
            <div className="mt-7">
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
          )}
        </div>
      ) : (
        <AlertIndicator className="mt-7 rounded-sm border border-_divider_ py-10">
          <span className="text-base">No reward distributions yet.</span>
        </AlertIndicator>
      )}
    </div>
  );
});
