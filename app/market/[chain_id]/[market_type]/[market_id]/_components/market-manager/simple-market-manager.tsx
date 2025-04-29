import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { MarketActionForm } from "./market-action-form";
import { MarketSteps, MarketViewType } from "@/store/market-manager-props";
import { MarketInfo } from "./market-info";
import { useMarketManager } from "@/store/use-market-manager";
import { SecondaryLabel } from "../composables/common-labels";
import { motion } from "framer-motion";
import { RoycoLogoWhiteIcon } from "@/assets/logo/royco-logo-white";

export const SimpleMarketManager = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { marketStep, viewType, setViewType } = useMarketManager();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeIn" }}
      key={`market-manager:${viewType}`}
      className={cn(
        "flex w-full max-w-lg flex-col rounded-2xl border border-divider bg-white md:min-h-[800px]"
      )}
    >
      {/**
       * Market Info
       */}
      {marketStep === MarketSteps.params.id && (
        <>
          <div className="p-3 md:p-6">
            <MarketInfo />
          </div>

          <hr />
        </>
      )}

      {/**
       * Market Action Form
       */}
      <div className="p-3 md:p-6">
        <MarketActionForm key={`market-form:simple`} />
      </div>

      {/**
       * Advanced View Switch
       */}
      <div
        className={cn(
          "rounded-b-2xl border-t border-divider bg-primary px-3 py-4 md:px-6 md:py-5"
        )}
      >
        <SecondaryLabel className="flex items-center justify-between gap-2 font-light text-white">
          <div className="flex items-center gap-1">
            <RoycoLogoWhiteIcon className="h-5" />
            <span>Advanced Mode</span>
          </div>

          <Switch
            checked={viewType === MarketViewType.advanced.id}
            onCheckedChange={() => {
              let updateViewType;
              if (viewType === MarketViewType.advanced.id) {
                updateViewType = MarketViewType.simple.id;
              } else {
                updateViewType = MarketViewType.advanced.id;
              }

              if (typeof window !== "undefined") {
                localStorage.setItem("royco_market_view_type", updateViewType);
              }

              setViewType(updateViewType);
            }}
          />
        </SecondaryLabel>
      </div>
    </motion.div>
  );
});
