import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { MarketActionForm } from "./market-action-form";
import { MarketInfo } from "./market-info";
import { useMarketManager } from "@/store/use-market-manager";
import { MAX_SCREEN_WIDTH } from "@/components/constants/constants";
import { motion } from "framer-motion";
import { OfferVisualizer } from "./offer-visualizer";
import { BalanceIndicator } from "./balance-indicator";
import { StatsTables } from "./stats-tables/stats-tables";
import { MarketUserType } from "@/store/market-manager-props";

export const AdvanceMarketManager = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { viewType, userType } = useMarketManager();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeIn" }}
      key={`market-manager:${viewType}`}
      className={cn(
        "flex h-full w-full flex-col rounded-2xl border border-divider bg-white md:min-h-[70rem] md:divide-y xl:divide-y-0",
        MAX_SCREEN_WIDTH
      )}
    >
      <div className="flex w-full flex-1 flex-col divide-x-0 divide-y md:flex-row md:divide-x md:divide-y-0">
        {/**
         * Left section
         */}
        <div
          className={cn(
            "flex shrink-0 flex-col",
            "w-full md:w-[50%] xl:w-[25%]"
          )}
        >
          <MarketInfo className="flex-1 p-3 md:p-6" />
        </div>

        {/**
         * Middle section
         */}
        <div
          className={cn(
            "flex shrink-0 flex-col divide-y divide-divider md:hidden xl:flex",
            "w-full md:w-[40%] xl:w-[50%]"
          )}
        >
          <OfferVisualizer />

          <StatsTables className="max-h-[42rem] flex-1" />
        </div>

        {/**
         * Right section
         */}
        <div
          className={cn(
            "flex shrink-0 flex-col p-3 md:p-6",
            "md:w-[50%] xl:w-[25%]"
          )}
        >
          {userType === MarketUserType.ap.id && (
            <div className="mb-4">
              <BalanceIndicator />
            </div>
          )}

          <div className="flex-1">
            <MarketActionForm />
          </div>
        </div>
      </div>

      {/* Middle section (MD only) */}
      <div
        className={cn(
          "hidden w-full shrink-0 divide-y divide-divider md:flex md:flex-col xl:hidden",
          "w-full"
        )}
      >
        <OfferVisualizer />

        <StatsTables className="max-h-[24rem] flex-1" />
      </div>
    </motion.div>
  );
});
