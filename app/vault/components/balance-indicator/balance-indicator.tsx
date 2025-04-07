import { motion, AnimatePresence } from "framer-motion";
import { ChevronsUpDown } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useAtomValue } from "jotai";

import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { cn } from "@/lib/utils";
import formatNumber from "@/utils/numbers";
import { vaultManagerAtom } from "@/store/vault/vault-manager";
import { vaultMetadataAtom } from "@/store/vault/vault-metadata";
import { AlertIndicator, TokenDisplayer } from "@/components/common";
import { formatDate } from "date-fns";
import { Button } from "@/components/ui/button";
import { useVaultManager } from "@/store/vault/use-vault-manager";
import { VaultPositionUnclaimedRewardToken } from "@/app/api/royco/data-contracts";

const DropdownAnimationWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ overflow: "hidden" }}
    >
      <motion.div
        initial={{ y: -10 }}
        animate={{ y: 0 }}
        exit={{ y: -10 }}
        transition={{ duration: 0.3 }}
        ref={ref}
        className={cn(className)}
      >
        {children}
      </motion.div>
    </motion.div>
  );
});

export const BalanceIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { data } = useAtomValue(vaultMetadataAtom);

  const vault = useAtomValue(vaultManagerAtom);

  const { setTransaction } = useVaultManager();

  const token = useMemo(() => {
    return data?.depositTokens[0];
  }, [data]);

  const principle = useMemo(() => {
    const isLocked =
      (vault?.account.unlockTime || 0) > 0 &&
      (vault?.account.unlockTime || 0) > Date.now();

    return {
      amount: vault?.account.sharesInUsd || 0,
      tokenAmount: vault?.account.sharesInBaseAsset || 0,
      unlockTime: vault?.account.unlockTime || 0,
      isLocked,
    };
  }, [vault]);

  const incentives = useMemo(() => {
    const totalIncentives = vault?.account.rewards.unclaimedRewardTokens.reduce(
      (acc, curr) => acc + curr.tokenAmountUsd,
      0
    );

    return {
      amountInUsd: totalIncentives || 0,
      data: vault?.account?.rewards?.unclaimedRewardTokens || [],
    };
  }, [vault]);

  const [showPrincipleBreakdown, setShowPrincipleBreakdown] = useState(true);
  const [showIncentivesBreakdown, setShowIncentivesBreakdown] = useState(false);

  const handleClaim = (incentive: VaultPositionUnclaimedRewardToken) => {
    const transaction = {
      type: "claimIncentives" as const,
      steps: [
        {
          type: "claim",
          label: `Claim ${incentive.symbol}`,
        },
      ],
      form: {
        token: incentive,
        amount: incentive.tokenAmount,
      },
    };

    setTransaction(transaction);
  };

  return (
    <div ref={ref} className={cn("rounded-2xl p-6", className)} {...props}>
      {/**
       * Total Balance
       */}
      <div>
        <SecondaryLabel className="text-xs font-medium">
          Your Value
        </SecondaryLabel>

        <PrimaryLabel className="mt-2 text-[32px] font-medium">
          {formatNumber(
            principle.amount,
            { type: "currency" },
            {
              average: false,
            }
          )}
        </PrimaryLabel>
      </div>

      <div className={cn("mt-6")}>
        {/**
         * Principle
         */}
        <div>
          <div className="flex items-center justify-between">
            <SecondaryLabel className="text-base">Principle</SecondaryLabel>

            <PrimaryLabel
              onClick={() => {
                setShowPrincipleBreakdown(!showPrincipleBreakdown);
              }}
              className="cursor-pointer text-base font-normal"
            >
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-1">
                  <span>
                    {formatNumber(
                      principle.tokenAmount,
                      { type: "currency" },
                      {
                        average: false,
                      }
                    )}
                  </span>

                  <TokenDisplayer size={4} tokens={[token]} symbols={false} />
                </div>

                <motion.div
                  animate={{ rotate: showPrincipleBreakdown ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronsUpDown className="h-4 w-4 text-secondary" />
                </motion.div>
              </div>
            </PrimaryLabel>
          </div>

          {/**
           * Principle Breakdown
           */}
          <AnimatePresence>
            {showPrincipleBreakdown && (
              <DropdownAnimationWrapper className="mt-3 flex flex-col gap-4 rounded-lg border border-divider p-4">
                {!principle.isLocked && (
                  <div>
                    <SecondaryLabel className="text-xs font-medium">
                      Available to Withdraw
                    </SecondaryLabel>

                    <PrimaryLabel className="mt-3 text-sm font-normal">
                      <div className="flex items-center gap-1">
                        <TokenDisplayer
                          size={4}
                          tokens={[token]}
                          symbols={false}
                        />

                        <span>
                          {formatNumber(
                            principle.tokenAmount,
                            { type: "number" },
                            {
                              average: false,
                            }
                          )}
                        </span>

                        <span className="text-sm text-primary">
                          {token.symbol}
                        </span>
                      </div>
                    </PrimaryLabel>
                  </div>
                )}

                {principle.isLocked && (
                  <div>
                    <SecondaryLabel className="text-xs font-medium">
                      Locked
                    </SecondaryLabel>

                    <div className="mt-3 flex items-center justify-between">
                      <PrimaryLabel className="text-sm font-normal">
                        <div className="flex items-center gap-1">
                          <TokenDisplayer
                            size={4}
                            tokens={[token]}
                            symbols={false}
                          />

                          <span>
                            {formatNumber(
                              principle.tokenAmount,
                              { type: "number" },
                              {
                                average: false,
                              }
                            )}
                          </span>

                          <span className="text-sm text-primary">
                            {token.symbol}
                          </span>
                        </div>
                      </PrimaryLabel>

                      <SecondaryLabel className="text-base font-normal">
                        {`Until ${formatDate(principle.unlockTime, "MMM d, yyyy")}`}
                      </SecondaryLabel>
                    </div>
                  </div>
                )}
              </DropdownAnimationWrapper>
            )}
          </AnimatePresence>
        </div>

        {/**
         * Incentives
         */}
        <div className="mt-3">
          <div className="flex items-center justify-between">
            <SecondaryLabel className="text-base">Incentives</SecondaryLabel>

            <PrimaryLabel
              onClick={() => {
                setShowIncentivesBreakdown(!showIncentivesBreakdown);
              }}
              className="cursor-pointer text-base font-normal"
            >
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-1">
                  <span>
                    {formatNumber(
                      incentives.amountInUsd,
                      { type: "currency" },
                      {
                        average: false,
                      }
                    )}
                  </span>

                  <TokenDisplayer
                    size={4}
                    tokens={incentives.data}
                    symbols={false}
                  />
                </div>

                <motion.div
                  animate={{ rotate: showIncentivesBreakdown ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronsUpDown className="h-4 w-4 text-secondary" />
                </motion.div>
              </div>
            </PrimaryLabel>
          </div>

          {/**
           * Incentives Breakdown
           */}
          <AnimatePresence>
            {showIncentivesBreakdown && (
              <DropdownAnimationWrapper className="fex-col mt-3 flex gap-3 rounded-lg border border-divider p-4">
                {incentives.data && incentives.data.length === 0 && (
                  <AlertIndicator className="py-4">
                    No incentives available
                  </AlertIndicator>
                )}

                {incentives.data &&
                  incentives.data.length > 0 &&
                  incentives.data.map((item, index) => (
                    <div
                      key={index}
                      className="flex w-full items-center justify-between"
                    >
                      <PrimaryLabel className="text-sm font-normal">
                        <div className="flex items-center gap-1">
                          <TokenDisplayer
                            size={4}
                            tokens={[item]}
                            symbols={false}
                          />

                          <span>
                            {formatNumber(
                              item.tokenAmount,
                              { type: "number" },
                              {
                                average: false,
                              }
                            )}
                          </span>

                          <span className="text-sm text-primary">
                            {item.symbol}
                          </span>
                        </div>
                      </PrimaryLabel>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-sm font-semibold text-success hover:bg-success/10 hover:text-primary"
                        onClick={() => handleClaim(item)}
                      >
                        Claim
                      </Button>
                    </div>
                  ))}
              </DropdownAnimationWrapper>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
});
