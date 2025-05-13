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
import { TriangleAlert } from "lucide-react";

export const WithdrawAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
  }
>(({ className, marketActionForm, ...props }, ref) => {
  const { currentMarketData } = useActiveMarket();

  if (
    currentMarketData.id ===
    "42161_0_0x8ad5d3b1e7da39ce148c0e1809d4e3814f97a285e88098e1973e9df19eedd009"
  ) {
    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full grow flex-row items-center justify-between gap-2",
          className
        )}
        {...props}
      >
        <div className="flex w-full flex-col gap-2 rounded-xl border border-divider bg-z2 p-3 text-black transition-all duration-200 ease-in-out hover:bg-focus">
          <div className="flex flex-row items-center gap-2">
            <TriangleAlert className="h-5 w-5 text-error" />
            <div className="font-bold text-error">WARNING</div>
          </div>

          <div className="text-light text-secondary">
            Withdrawals have been disabled for this market. Get in touch with{" "}
            <a
              href="https://t.me/SGOliveio"
              target="_blank"
              rel="noopener noreferrer"
              className="font-normal text-black underline underline-offset-2"
            >
              @SGOliveio
            </a>{" "}
            on Telegram from YieldFi for next steps.
          </div>
        </div>
      </div>
    );
  }

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
