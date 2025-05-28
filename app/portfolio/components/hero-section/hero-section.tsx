"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { PrimaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { useAccount } from "wagmi";
import { CrownIcon } from "@/assets/icons/crown";

export const HeroSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { address } = useAccount();

  return (
    <div
      ref={ref}
      {...props}
      className={cn("flex flex-col items-center", className)}
    >
      <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-_surface_tertiary">
        <img
          src={`https://effigy.im/a/${address}.svg`}
          alt="profile image"
          className="h-full w-full rounded-full object-cover"
        />

        <div className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-_surface_">
          <CrownIcon className="h-6 w-6" />
        </div>
      </div>

      <PrimaryLabel className="mt-6 font-shippori text-3xl font-medium text-_primary_">
        {address
          ? `${address.slice(0, 6)}...${address.slice(-4)}`
          : "Connect Wallet"}
      </PrimaryLabel>
    </div>
  );
});
