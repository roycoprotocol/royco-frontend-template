import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { FormInputLabel } from "@/components/composables";
import { MarketOfferType, MarketVaultIncentiveAction } from "@/store";
import { useMarketManager } from "@/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { FallMotion } from "@/components/animations";
import { TypedRoycoMarketVaultIncentiveAction } from "@/sdk/market";
import { useActiveMarket } from "../../../hooks";
import { BigNumber } from "ethers";

export const ActionTypeSelector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { vaultIncentiveActionType, setVaultIncentiveActionType } =
    useMarketManager();

  const { currentMarketData } = useActiveMarket();

  let availableActionTypes = [MarketVaultIncentiveAction.add];

  if (
    currentMarketData?.base_incentive_ids &&
    currentMarketData.base_incentive_ids.length > 0
  ) {
    let availableIncentivesThatCanBeRefunded =
      currentMarketData.base_incentive_ids.filter((incentive_id, index) => {
        const currentTimestamp = BigNumber.from(Math.floor(Date.now() / 1000));
        const startTimestamp = BigNumber.from(
          currentMarketData.base_start_timestamps![index] ?? "0"
        );

        if (currentTimestamp.gt(startTimestamp)) {
          return true;
        } else {
          return false;
        }
      });

    if (availableIncentivesThatCanBeRefunded.length > 0) {
      availableActionTypes = [
        MarketVaultIncentiveAction.add,
        MarketVaultIncentiveAction.extend,
        MarketVaultIncentiveAction.refund,
      ];
    } else {
      availableActionTypes = [
        MarketVaultIncentiveAction.add,
        MarketVaultIncentiveAction.extend,
      ];
    }
  }

  return (
    <div ref={ref} className={cn("", className)} {...props}>
      <FormInputLabel
        size="sm"
        label="Action Type"
        info="The type of action you want to perform"
      />

      <Select
        onOpenChange={(open) => {
          return open;
        }}
        onValueChange={(e) => {
          setVaultIncentiveActionType(
            e as TypedRoycoMarketVaultIncentiveAction
          );
        }}
        value={vaultIncentiveActionType}
      >
        <SelectTrigger
          className={cn(
            "mt-2 w-full bg-white py-0 pl-3 pr-2 text-sm font-light text-black"
          )}
        >
          <div className="w-full">
            <FallMotion
              customKey={`market:vault:action-type-selector:${vaultIncentiveActionType}`}
              height="2rem"
              motionClassName="flex flex-col items-start"
              contentClassName="text-left"
            >
              {MarketVaultIncentiveAction[vaultIncentiveActionType]
                ? MarketVaultIncentiveAction[vaultIncentiveActionType].label
                : "Select Action Type"}
            </FallMotion>
          </div>
        </SelectTrigger>

        <SelectContent className="w-full">
          {availableActionTypes.map((option) => (
            <SelectItem className="text-sm" key={option.id} value={option.id}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
});
