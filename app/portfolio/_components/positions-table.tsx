"use client";

import React, { useState } from "react";
import {
  PrimaryLabel,
  TertiaryLabel,
} from "../../market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { MarketType, MarketUserType, useMarketManager } from "@/store";
import { Switch } from "@/components/ui/switch";
import { SlideUpWrapper } from "@/components/animations";
import { cn } from "@/lib/utils";
import { PositionsRecipeManager } from "./positions-recipe-manager";
import { PositionsVaultManager } from "./positions-vault-manager";
import { PositionsBoycoManager } from "./positions-boyco-manager";
// import { Profile } from "./account-profile";

export const PositionsTable = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { userType, setUserType } = useMarketManager();

  const [marketType, setMarketType] = useState(MarketType.recipe.id);

  return (
    <div className={cn("flex w-full flex-col gap-4", className)}>
      <div className="flex flex-col gap-4 lg:flex-row-reverse lg:gap-4">
        {/* <div className="w-full flex-shrink-0 lg:w-[400px]">
          <div className="mb-3 flex flex-row justify-between">
            <SlideUpWrapper
              layout="position"
              layoutId="motion:portfolio:profile"
              className={cn("flex flex-col")}
            >
              <PrimaryLabel>Profile</PrimaryLabel>
            </SlideUpWrapper>

            <SlideUpWrapper
              layout="position"
              layoutId="motion:position:user-type"
              className={cn("flex flex-col")}
            >
              <div className=" flex flex-row items-center justify-end gap-2">
                <div className="font-gt text-sm font-light text-secondary">
                  Incentive Provider
                </div>
                <Switch
                  checked={userType === MarketUserType.ip.id}
                  onCheckedChange={() => {
                    setUserType(
                      userType === MarketUserType.ap.id
                        ? MarketUserType.ip.id
                        : MarketUserType.ap.id
                    );
                  }}
                />
              </div>
            </SlideUpWrapper>
          </div>

          <Profile />
        </div> */}

        <div
          className={cn(
            "flex min-w-0 flex-1 gap-10",
            process.env.NEXT_PUBLIC_FRONTEND_TAG === "boyco"
              ? "flex-col-reverse"
              : "flex-col"
          )}
        >
          <div>
            <div className="mb-3 flex flex-col-reverse justify-between gap-3 md:flex-row">
              <div className={cn("flex min-w-52 flex-col")}>
                <PrimaryLabel>Your Positions: Boyco</PrimaryLabel>
              </div>
            </div>

            <PositionsBoycoManager />
          </div>

          <div>
            <div className="mb-3 flex flex-col-reverse justify-between gap-3 md:flex-row">
              <div className={cn("flex min-w-52 flex-col")}>
                <PrimaryLabel>
                  {process.env.NEXT_PUBLIC_FRONTEND_TAG === "boyco"
                    ? "Your Positions: 4626 Vaults"
                    : "Your Positions: Supply to Vault"}
                </PrimaryLabel>
              </div>
            </div>

            <PositionsVaultManager />
          </div>

          <div>
            <div className="mb-3 flex flex-col-reverse justify-between gap-3 md:flex-row">
              <div className={cn("flex min-w-52 flex-col")}>
                <PrimaryLabel>
                  {process.env.NEXT_PUBLIC_FRONTEND_TAG === "boyco"
                    ? "Your Positions"
                    : "Your Positions: All Other Actions"}
                </PrimaryLabel>
              </div>
            </div>

            <PositionsRecipeManager />
          </div>
        </div>
      </div>
    </div>
  );
});
