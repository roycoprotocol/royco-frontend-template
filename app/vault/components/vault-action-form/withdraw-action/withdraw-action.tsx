import React from "react";

import { cn } from "@/lib/utils";
import { WithdrawActionForm } from "./withdraw-action-form/withdraw-action-form";
import {
  SecondaryLabel,
  TertiaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { Button } from "@/components/ui/button";

export const WithdrawAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  // TODO: Implement Hook
  const incentivesTokens = [
    {
      label: "GHO",
      value: "100,000 GHO",
    },
    {
      label: "GHO",
      value: "100,000 GHO",
    },
    {
      label: "GHO",
      value: "100,000 GHO",
    },
  ];

  const incentivesPoints = [
    {
      label: "GHO",
      value: "100,000 GHO",
    },
    {
      label: "GHO",
      value: "200,000 GHO",
    },
  ];

  return (
    <div ref={ref} className={cn("", className)} {...props}>
      <WithdrawActionForm />

      <div className="mt-5">
        <SecondaryLabel>Incentives - Tokens</SecondaryLabel>

        <div className="mt-3 space-y-2">
          {incentivesTokens.map((token) => (
            <div key={token.label} className="flex justify-between gap-2">
              <SecondaryLabel className="font-medium text-black">
                {token.label}
              </SecondaryLabel>

              <div className="flex items-center gap-2">
                <SecondaryLabel className="text-black">
                  {token.value}
                </SecondaryLabel>

                <Button className="h-fit w-fit px-5 py-1 text-sm">Claim</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <SecondaryLabel>Incentives - Points</SecondaryLabel>
        <TertiaryLabel className="mt-1 text-sm">
          Claimable once the points are transferrable.
        </TertiaryLabel>

        <div className="mt-3 space-y-2">
          {incentivesPoints.map((point) => (
            <div key={point.label} className="flex justify-between gap-2">
              <SecondaryLabel className="font-medium text-black">
                {point.label}
              </SecondaryLabel>

              <SecondaryLabel className="text-black">
                {point.value}
              </SecondaryLabel>
            </div>
          ))}
        </div>
      </div>

      <SecondaryLabel className="mt-10 break-normal text-center">
        Note: It may take up to 7 days to withdraw the principal. Incentives may
        take 7 days to appear.
      </SecondaryLabel>
    </div>
  );
});
