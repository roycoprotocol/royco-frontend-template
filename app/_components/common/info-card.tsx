"use client";

import React from "react";

import { cn } from "@/lib/utils";
import { InfoSquareIcon } from "@/app/vault/assets/info-square";
import { SecondaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables/common-labels";

interface InfoCardProps {}

export const InfoCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & InfoCardProps
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "flex flex-row items-center gap-4 rounded-sm bg-_surface_tertiary px-4 py-3",
        className
      )}
    >
      <InfoSquareIcon className={cn("h-6 w-6 shrink-0 text-secondary")} />

      <SecondaryLabel className="break-normal text-sm text-_secondary_">
        {children}
      </SecondaryLabel>
    </div>
  );
});
