"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { loadableMarketMetadataAtom } from "@/store/market/market";
import { useAtomValue } from "jotai";
import { LoadingIndicator } from "@/app/_components/common/loading-indicator";
import { AlertIndicator } from "@/components/common/alert-indicator";
import { SlideUpWrapper } from "@/components/animations";
import { CampaignDetails } from "./details/campaign-details";
import { CustomHorizontalTabs } from "@/app/vault/common/custom-horizontal-tabs";
import {
  MarketDetailsOptionMap,
  TypeMarketDetailsOption,
  useMarketManager,
} from "@/store/market/use-market-manager";
import { Overview } from "./overview/overview";
import { CampaignActionForm } from "./campaign-action-form/action-form";
import { Positions } from "./positions/positions";
import { CampaignActionProvider } from "../../provider/campaign-action-provider";
import { TransactionModal } from "@/app/_components/transaction-modal/transaction-modal";

export const CampaignManager = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isLoading, isError, data } = useAtomValue(loadableMarketMetadataAtom);
  const { detailsOption, setDetailsOption } = useMarketManager();

  if (isLoading) {
    return (
      <div className="w-full ">
        <LoadingIndicator />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <SlideUpWrapper className="flex w-full flex-col place-content-center items-center pt-16">
        <AlertIndicator
          className={cn(
            "h-96 w-full rounded-2xl border border-divider bg-white"
          )}
        >
          Unable to load campaign data. Please check your connection and try
          again, or contact support if the issue persists.
        </AlertIndicator>
      </SlideUpWrapper>
    );
  }

  return (
    <CampaignActionProvider>
      <div ref={ref} {...props} className={cn("py-8", className)}>
        <div className="flex flex-col lg:flex-row lg:gap-x-10">
          <div className="w-full lg:w-2/3">
            <SlideUpWrapper>
              <CampaignDetails />
            </SlideUpWrapper>

            <SlideUpWrapper delay={0.1} className="mt-8">
              <CustomHorizontalTabs
                tabs={Object.values(MarketDetailsOptionMap).map((option) => ({
                  id: option.value,
                  label: option.label,
                }))}
                baseId="vault-details-option"
                activeTab={detailsOption}
                onTabChange={(id) =>
                  setDetailsOption(id as TypeMarketDetailsOption)
                }
              />
            </SlideUpWrapper>

            {(() => {
              if (detailsOption === TypeMarketDetailsOption.Overview) {
                return (
                  <div className="mt-8">
                    <Overview />
                  </div>
                );
              }

              if (detailsOption === TypeMarketDetailsOption.Positions) {
                return (
                  <div className="mt-8">
                    <Positions />
                  </div>
                );
              }
            })()}
          </div>

          <div className="mt-8 w-full lg:sticky lg:top-20 lg:mt-0 lg:w-1/3 lg:self-start">
            <SlideUpWrapper>
              <CampaignActionForm />
            </SlideUpWrapper>
          </div>
        </div>

        <TransactionModal />
      </div>
    </CampaignActionProvider>
  );
});
