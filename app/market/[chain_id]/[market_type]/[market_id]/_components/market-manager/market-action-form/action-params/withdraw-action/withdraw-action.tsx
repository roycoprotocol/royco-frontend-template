"use client";

import React, { Fragment } from "react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { MarketActionFormSchema } from "../../market-action-form-schema";
import { WithdrawSection } from "./withdraw-section";
import { SlideUpWrapper } from "@/components/animations";
import { BoycoWithdrawSection } from "./boyco-withdraw-section";
import { loadableEnrichedMarketAtom } from "@/store/market";
import { useAtomValue } from "jotai";
import { MarketUserType, useMarketManager } from "@/store";
import { AlertIndicator } from "@/components/common";
import { WithdrawTypeSelector } from "./withdraw-type-selector";

export const WithdrawAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
  }
>(({ className, marketActionForm, ...props }, ref) => {
  const { data: enrichedMarket } = useAtomValue(loadableEnrichedMarketAtom);

  const { userType } = useMarketManager();

  return (
    <div
      ref={ref}
      className={cn("flex flex-1 grow flex-col", className)}
      {...props}
    >
      <SlideUpWrapper className="mt-5 flex flex-1 grow flex-col overflow-y-scroll">
        {userType === MarketUserType.ap.id ? (
          enrichedMarket?.category === "boyco" ? (
            <BoycoWithdrawSection />
          ) : (
            <Fragment>
              <WithdrawTypeSelector />

              <WithdrawSection />
            </Fragment>
          )
        ) : (
          <Fragment>
            <div className="flex grow flex-col place-content-center items-center">
              <AlertIndicator>Only AP can withdraw</AlertIndicator>
            </div>
          </Fragment>
        )}
      </SlideUpWrapper>
    </div>
  );
});
