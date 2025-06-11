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
import { MarketUserType, MarketWithdrawType, useMarketManager } from "@/store";
import { AlertIndicator } from "@/components/common";
import { WithdrawTypeSelector } from "./withdraw-type-selector";
import { TriangleAlert } from "lucide-react";
import { RecoverFundsSection } from "./recover-funds-section";

export const WithdrawAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
  }
>(({ className, marketActionForm, ...props }, ref) => {
  const { data: enrichedMarket } = useAtomValue(loadableEnrichedMarketAtom);

  const { userType, withdrawType } = useMarketManager();

  if (
    enrichedMarket?.id ===
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
        {userType === MarketUserType.ap.id &&
          withdrawType === MarketWithdrawType.input_token.id &&
          enrichedMarket?.id ===
            "98866_0_0xa1d68accf80e16047bf8c609e9da79a7ad75576d7fec71f490d73ff1f7d1eee7" && (
            <RecoverFundsSection />
          )}

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
