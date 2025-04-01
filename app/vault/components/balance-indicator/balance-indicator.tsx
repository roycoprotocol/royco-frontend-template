import { motion, AnimatePresence } from "framer-motion";
import { ChevronsUpDown } from "lucide-react";
import React, { useState } from "react";
import { useAtomValue } from "jotai";

import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { cn } from "@/lib/utils";
import formatNumber from "@/utils/numbers";
import { vaultManagerAtom } from "@/store/vault/vault-manager";

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
  const vault = useAtomValue(vaultManagerAtom);

  const [showPrincipleBreakdown, setShowPrincipleBreakdown] = useState(false);
  const [showIncentivesBreakdown, setShowIncentivesBreakdown] = useState(false);

  return (
    <div ref={ref} className={cn("rounded-2xl p-6", className)} {...props}>
      {/**
       * Total Balance
       */}
      <div>
        <SecondaryLabel className="text-xs font-medium">
          Your Value
        </SecondaryLabel>

        <PrimaryLabel className="mt-2 text-3xl font-medium">
          {formatNumber(
            232142.12,
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
                <span>
                  {formatNumber(
                    22000,
                    { type: "currency" },
                    {
                      average: false,
                    }
                  )}
                </span>

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
              <DropdownAnimationWrapper className="mt-3 rounded-lg border border-divider p-4">
                <div>
                  <SecondaryLabel className="text-xs font-medium">
                    Available to Withdraw
                  </SecondaryLabel>

                  <PrimaryLabel className="mt-3 text-base font-normal">
                    0 USDC
                  </PrimaryLabel>
                </div>

                <div className="mt-4">
                  <SecondaryLabel className="text-xs font-medium">
                    Locked
                  </SecondaryLabel>

                  <div className="mt-3 flex items-center justify-between">
                    <PrimaryLabel className="text-base font-normal">
                      220000.79 USDC
                    </PrimaryLabel>

                    <SecondaryLabel className="text-base font-normal">
                      Until Mar 1, 2025
                    </SecondaryLabel>
                  </div>
                </div>
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
                <span>
                  {formatNumber(
                    12142.12,
                    { type: "currency" },
                    {
                      average: false,
                    }
                  )}
                </span>

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
              <DropdownAnimationWrapper className="mt-3 rounded-lg border border-divider p-4">
                <div>
                  <SecondaryLabel className="text-xs font-medium">
                    Available to Withdraw
                  </SecondaryLabel>

                  <PrimaryLabel className="mt-3 text-base font-normal">
                    0 USDC
                  </PrimaryLabel>
                </div>

                <div className="mt-4">
                  <SecondaryLabel className="text-xs font-medium">
                    Locked
                  </SecondaryLabel>

                  <div className="mt-3 flex items-center justify-between">
                    <PrimaryLabel className="text-base font-normal">
                      220000.79 USDC
                    </PrimaryLabel>

                    <SecondaryLabel className="text-base font-normal">
                      Until Mar 1, 2025
                    </SecondaryLabel>
                  </div>
                </div>
              </DropdownAnimationWrapper>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
});
