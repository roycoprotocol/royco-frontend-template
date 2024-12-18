"use client";

import React, { useState } from "react";
import { HorizontalTabs } from "@/components/composables";
import {
  PrimaryLabel,
  TertiaryLabel,
} from "../../market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { MarketType, MarketUserType, useMarketManager } from "@/store";
import { Switch } from "@/components/ui/switch";
import { SlideUpWrapper } from "@/components/animations";
import { cn } from "@/lib/utils";
import { PositionsRecipeTable } from "./positions-recipe-table";
import { PositionsVaultTable } from "./positions-vault-table";

export const PositionsTable = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { userType, setUserType } = useMarketManager();

  const [marketType, setMarketType] = useState(MarketType.recipe.id);

  return (
    <div className="w-full">
      <div>
        <div className="mb-3 flex flex-col-reverse justify-between gap-3 md:flex-row">
          <SlideUpWrapper
            layout="position"
            layoutId="motion:position:market-type"
            className={cn("mt-5 flex min-w-52 flex-col")}
          >
            <PrimaryLabel>Recipe Markets</PrimaryLabel>
          </SlideUpWrapper>
          <SlideUpWrapper
            layout="position"
            layoutId="motion:position:user-type"
            className={cn("mt-5 flex min-w-52 flex-col")}
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

        <div className="w-full overflow-y-scroll rounded-2xl border border-divider bg-white p-1 md:p-2">
          <TertiaryLabel className="mb-5 mt-5 px-5">POSITIONS</TertiaryLabel>

          <PositionsRecipeTable marketType={marketType} userType={userType} />
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-3 flex flex-col-reverse justify-between gap-3 md:flex-row">
          <SlideUpWrapper
            layout="position"
            layoutId="motion:position:market-type"
            className={cn("mt-5 flex min-w-52 flex-col")}
          >
            <PrimaryLabel>Vault Markets</PrimaryLabel>
          </SlideUpWrapper>
        </div>

        <div className="w-full overflow-y-scroll rounded-2xl border border-divider bg-white p-1 md:p-2">
          <TertiaryLabel className="mb-5 mt-5 px-5">POSITIONS</TertiaryLabel>

          <PositionsVaultTable marketType={marketType} userType={userType} />
        </div>
      </div>
    </div>
  );
});
