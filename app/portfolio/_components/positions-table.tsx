"use client";

import React, { useState } from "react";
import { HorizontalTabs } from "@/components/composables";
import { TertiaryLabel } from "../../market/[chain_id]/[market_type]/[market_id]/_components/composables";
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
      <div className="mb-3 flex flex-col-reverse justify-between gap-3 md:flex-row">
        <SlideUpWrapper
          layout="position"
          layoutId="motion:position:market-type"
          className={cn("mt-5 flex min-w-52 flex-col")}
        >
          <HorizontalTabs
            className={cn("")}
            size="sm"
            key="position:market-type:container"
            baseId="position:market-type"
            tabs={Object.values(MarketType)}
            activeTab={marketType}
            setter={setMarketType}
          />
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

      <div className="w-full overflow-y-scroll rounded-2xl border border-divider bg-white p-2">
        <TertiaryLabel className="mb-5 mt-5 px-5">POSITIONS</TertiaryLabel>

        {marketType === MarketType.recipe.id && (
          <PositionsRecipeTable marketType={marketType} userType={userType} />
        )}

        {marketType === MarketType.vault.id && (
          <PositionsVaultTable marketType={marketType} userType={userType} />
        )}
      </div>
    </div>
  );
});
