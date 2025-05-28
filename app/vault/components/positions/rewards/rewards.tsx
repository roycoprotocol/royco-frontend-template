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
import toast from "react-hot-toast";
import { ErrorAlert } from "@/components/composables";
import { VaultPositionUnclaimedRewardToken } from "@/app/api/royco/data-contracts";
import {
  useVaultManager,
  VaultTransactionType,
} from "@/store/vault/use-vault-manager";
import { useBoringVaultActions } from "@/app/vault/providers/boring-vault/boring-vault-action-provider";
import { Button } from "@/components/ui/button";
import { InfoTip } from "@/app/_components/common/info-tip";

export const Rewards = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const vault = useAtomValue(vaultManagerAtom);
  const { data } = useAtomValue(vaultMetadataAtom);

  const { setTransactions } = useVaultManager();

  const { getClaimIncentiveTransaction } = useBoringVaultActions();

  const tokenIncentives = useMemo(() => {
    return {
      data: vault?.account?.rewards?.unclaimedRewardTokens || [],
    };
  }, [vault]);

  const pointIncentives = useMemo(() => {
    return {
      data: vault?.account?.rewards?.pointRewardTokens || [],
    };
  }, [vault]);

  const principle = useMemo(() => {
    return vault?.account.sharesInBaseAsset || 0;
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
        type: VaultTransactionType.ClaimIncentives,
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

      {/**
       * Estimated APY
       */}
      <div className="mt-7">
        <SecondaryLabel className="text-xs font-medium tracking-wide text-_secondary_">
          ESTIMATED APY
        </SecondaryLabel>

        <PrimaryLabel className="mt-2 text-2xl font-normal">
          <GradientText>
            {principle > 0
              ? formatNumber(data.yieldRate, {
                  type: "percent",
                })
              : "0%"}
          </GradientText>
        </PrimaryLabel>

        <SecondaryLabel className="mt-2 text-xs font-medium text-_secondary_">
          <div className="flex items-center gap-1">
            <span className="flex gap-1">
              Based on
              <span className="border-b-2 border-dotted border-current">
                Current
              </span>
              APY
            </span>

            <InfoTip contentClassName="max-w-[400px]">
              Estimated APY reflects the Vault's current performance based on
              token prices and market allocations. It excludes compounding,
              duration, and future changes in token value. Vault curators
              regularly rebalance and reallocate. Actual rewards may vary.
            </InfoTip>
          </div>
        </SecondaryLabel>
      </div>

      {/**
       * Token Rewards
       */}

      {tokenIncentives.data.length || pointIncentives.data.length ? (
        <div>
          {tokenIncentives.data.length > 0 && (
            <div className="mt-7">
              <SecondaryLabel className="text-xs font-medium tracking-wide text-_secondary_">
                TOKENS
              </SecondaryLabel>

              {tokenIncentives.data.map((incentive, index) => (
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

                        <span>{incentive.symbol}</span>
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

          {pointIncentives.data.length > 0 && (
            <div className="mt-7">
              <SecondaryLabel className="text-xs font-medium tracking-wide text-_secondary_">
                POINTS
              </SecondaryLabel>

              {pointIncentives.data.map((incentive, index) => (
                <SlideUpWrapper key={index} delay={0.2 + index * 0.1}>
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
                      className="text-sm font-medium hover:bg-success/10 hover:text-primary disabled:opacity-50"
                      disabled={true}
                    >
                      Claim
                    </Button>
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
