"use client";

import React, { Fragment, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { InfoIcon } from "lucide-react";
import { useAccountAirdrop } from "../hooks/use-account-airdrop";
import { useAccount } from "wagmi";
import { TransitionPanel } from "@/components/motion-primitives/transition-panel";
import { useClaimDetails } from "../hooks/use-claim-details";

export const ClaimStatus = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isConnected, address } = useAccount();
  const {
    data: accountAirdrop,
    isLoading: isLoadingAccountAirdrop,
    isError: isErrorAccountAirdrop,
  } = useAccountAirdrop();

  const [activeIndex, setActiveIndex] = useState(0);
  const TEXTS = [
    "Connect wallet to check your BERA airdrop status.",
    "Checking your BERA airdrop status...",
    "You have already claimed your BERA airdrop.",
    "You can claim your BERA airdrop now.",
    "You are not eligible for BERA airdrop for currently unlocked boyco markets.",
  ];

  useEffect(() => {
    if (!isConnected) {
      setActiveIndex(0);
    } else {
      if (isLoadingAccountAirdrop) {
        setActiveIndex(1);
      } else {
        if (!!accountAirdrop) {
          if (accountAirdrop?.is_claimed) {
            setActiveIndex(2);
          } else {
            setActiveIndex(3);
          }
        } else {
          setActiveIndex(4);
        }
      }
    }
  }, [isConnected, accountAirdrop, isLoadingAccountAirdrop]);

  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "flex w-full flex-row items-center justify-center rounded-xl border border-divider bg-white p-3",
        className
      )}
    >
      <InfoIcon
        strokeWidth={2}
        className="h-5 w-5 shrink-0 fill-tertiary stroke-white drop-shadow-sm"
      />

      <div className="ml-2 flex-1 overflow-hidden text-sm font-light text-secondary">
        <TransitionPanel
          activeIndex={activeIndex}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          variants={{
            enter: { opacity: 0, y: -50, filter: "blur(4px)" },
            center: { opacity: 1, y: 0, filter: "blur(0px)" },
            exit: { opacity: 0, y: 50, filter: "blur(4px)" },
          }}
        >
          {TEXTS.map((text, index) => (
            <Fragment key={index}>{text}</Fragment>
          ))}
        </TransitionPanel>
      </div>
    </div>
  );
});
