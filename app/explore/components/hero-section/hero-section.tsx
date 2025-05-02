"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";

export const HeroSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={cn("flex flex-col items-center", className)}
    >
      <PrimaryLabel className="font-shippori text-[40px] font-medium text-_primary_">
        Earn on Royco
      </PrimaryLabel>

      <SecondaryLabel className="mt-3 text-base font-normal text-_secondary_">
        Where capital meets its highest potential.
      </SecondaryLabel>
    </div>
  );
});
