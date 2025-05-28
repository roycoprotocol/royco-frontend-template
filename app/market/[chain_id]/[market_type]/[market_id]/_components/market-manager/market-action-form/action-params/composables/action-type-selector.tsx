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
import { TypedRoycoMarketVaultIncentiveAction } from "royco/market";
import { loadableEnrichedMarketAtom } from "@/store/market";
import { useAtomValue } from "jotai";

export const ActionTypeSelector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { vaultIncentiveActionType, setVaultIncentiveActionType } =
    useMarketManager();

  const { data: enrichedMarket } = useAtomValue(loadableEnrichedMarketAtom);

  let availableActionTypes = [MarketVaultIncentiveAction.add];

  if (
    enrichedMarket?.vaultMetadata?.baseIncentives &&
    enrichedMarket?.vaultMetadata?.baseIncentives.length > 0
  ) {
    let availableIncentivesThatCanBeRefunded =
      enrichedMarket.vaultMetadata.baseIncentives.filter((incentive, index) => {
        const currentTimestamp = BigInt(Math.floor(Date.now() / 1000));
        const startTimestamp = BigInt(
          enrichedMarket.vaultMetadata.baseStartTimestamps![index] ?? "0"
        );

        if (currentTimestamp < startTimestamp) {
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
