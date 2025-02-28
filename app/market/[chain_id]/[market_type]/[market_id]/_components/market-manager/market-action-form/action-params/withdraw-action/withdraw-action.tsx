"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { MarketActionFormSchema } from "../../market-action-form-schema";
import { WithdrawSection } from "./withdraw-section";
import { SlideUpWrapper } from "@/components/animations";
import { BoycoWithdrawSection } from "./boyco-withdraw-section";
import { useActiveMarket } from "../../../../hooks";

export const WithdrawAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
  }
>(({ className, marketActionForm, ...props }, ref) => {
  const { currentMarketData } = useActiveMarket();

  return (
    <div
      ref={ref}
      className={cn("flex flex-1 grow flex-col", className)}
      {...props}
    >
      <SlideUpWrapper className="mt-5 flex flex-1 grow flex-col overflow-y-scroll">
        {/* <WithdrawSection /> */}

        {currentMarketData?.category === "boyco" ? (
          <BoycoWithdrawSection />
        ) : (
          <WithdrawSection />
        )}
      </SlideUpWrapper>
    </div>
  );
});
