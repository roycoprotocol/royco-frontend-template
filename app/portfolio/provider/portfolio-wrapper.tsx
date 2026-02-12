"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { SlideUpWrapper } from "@/components/animations";
import { AlertIndicator } from "@/components/common";
import { LoadingIndicator } from "@/app/_components/common/loading-indicator";
import { useAtom, useAtomValue } from "jotai";
import {
  loadableActivityAtom,
  loadablePortfolioPositionsAtom,
} from "@/store/portfolio/portfolio";
import { useAccount } from "wagmi";
import { ConnectWalletButton } from "@/app/_components/header/connect-wallet-button/connect-wallet-button";
import { isAuthenticatedAtom } from "@/store/global";
import { linkWalletAtom } from "@/store/global";
import { isAuthEnabledAtom } from "@/store/global";

export const PortfolioWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const { isConnected } = useAccount();
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  // const isAuthEnabled = useAtomValue(isAuthEnabledAtom);
  const isAuthEnabled = false;
  const [linkWallet, setLinkWallet] = useAtom(linkWalletAtom);
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

  // if (isAuthEnabled && !isAuthenticated) {
  //   return (
  //     <SlideUpWrapper className="flex w-full flex-col place-content-center items-center pt-16">
  //       <AlertIndicator
  //         className={cn(
  //           "h-96 w-full rounded-2xl border border-divider bg-white"
  //         )}
  //       >
  //         <div className="flex flex-col items-center gap-5">
  //           <p>
  //             {linkWallet
  //               ? "Connect another wallet and it will be auto-linked to your royalty account"
  //               : "Please connect and verify your wallet to view your portfolio"}
  //           </p>
  //           <ConnectWalletButton className="h-10 w-fit rounded-sm" />
  //         </div>
  //       </AlertIndicator>
  //     </SlideUpWrapper>
  //   );
  // }

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
