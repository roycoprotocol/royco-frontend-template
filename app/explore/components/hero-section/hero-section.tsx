"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { useAtomValue } from "jotai";
import { tagAtom } from "@/store/protector/protector";
import { PlumeBlackLogo } from "@/assets/logo/plume/plume-black";

export const HeroSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const tag = useAtomValue(tagAtom);

  const content = useMemo(() => {
    switch (tag) {
      case "boyco":
        return {
          title: "Earn on Boyco",
          description: "Pre-deposit to Berachain to earn incentives.",
        };
      case "sonic":
        return {
          title: "Earn on Sonic",
          description: "Explore Sonic Gems & Points Programs",
        };
      case "plume":
        return {
          title: (
            <div className="flex items-center gap-2">
              <span>Earn on Plume</span>
              <PlumeBlackLogo className="h-8 w-8" />
            </div>
          ),
          description:
            "Earn RWA yields, PLUME incentives, and ecosystem points.",
        };
      default:
        return {
          title: "Earn on Royco",
          description: "Where capital meets its potential.",
        };
    }
  }, [tag]);

  return (
    <div
      ref={ref}
      {...props}
      className={cn("flex flex-col items-center", className)}
    >
      <PrimaryLabel className="font-shippori text-[40px] font-medium text-_primary_">
        {content.title}
      </PrimaryLabel>

      <SecondaryLabel className="mt-3 text-base font-normal text-_secondary_">
        {content.description}
      </SecondaryLabel>
    </div>
  );
});
