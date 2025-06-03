"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { SlideUpWrapper } from "@/components/animations";
import { AlertIndicator } from "@/components/common";
import { LoadingIndicator } from "@/app/_components/common/loading-indicator";
import { useAtomValue } from "jotai";
import {
  loadableActivityAtom,
  loadablePortfolioPositionsAtom,
} from "@/store/portfolio/portfolio";
import { useAccount } from "wagmi";
import { ConnectWalletButton } from "@/app/_components/header/connect-wallet-button/connect-wallet-button";

export const PortfolioWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const { isConnected } = useAccount();
  const { data, isLoading, isError } = useAtomValue(
    loadablePortfolioPositionsAtom
  );

  const { data: activityData, isLoading: isActivityLoading } =
    useAtomValue(loadableActivityAtom);

  if (isLoading || isActivityLoading) {
    return (
      <div className="w-full">
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
          {!isConnected ? (
            <div className="flex flex-col items-center gap-5">
              <p>Please connect your wallet to view your portfolio</p>
              <ConnectWalletButton className="h-10 w-fit rounded-sm" />
            </div>
          ) : (
            "Unable to load portfolio data. Please check your connection and try again, or contact support if the issue persists."
          )}
        </AlertIndicator>
      </SlideUpWrapper>
    );
  }

  return (
    <div ref={ref} className={cn(className)} {...props}>
      {children}
    </div>
  );
});
