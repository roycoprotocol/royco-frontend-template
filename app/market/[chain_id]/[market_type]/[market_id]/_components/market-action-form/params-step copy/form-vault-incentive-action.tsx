import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { MarketFormSchema } from "../market-form-schema";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  MarketActionType,
  MarketOfferType,
  MarketType,
  MarketUserType,
  MarketVaultIncentiveAction,
  MarketViewType,
} from "@/store";
import { useMarketManager } from "@/store";
import { FallMotion } from "@/components/animations";
import { useActiveMarket } from "../../hooks";
import { FormLabel } from "@/components/ui/form";
import { BASE_MARGIN_TOP, FormInputLabel, InputLabel } from "../../composables";
import {
  RoycoMarketVaultIncentiveAction,
  TypedRoycoMarketOfferType,
  TypedRoycoMarketVaultIncentiveAction,
} from "@/sdk/market";
import { EnrichedMarketDataType } from "@/sdk/queries";

const options = [MarketOfferType.market, MarketOfferType.limit];

export const canAddIncentives = ({
  enrichedMarket,
}: {
  enrichedMarket: EnrichedMarketDataType | undefined;
}) => {
  if (!enrichedMarket) return false;
  return (enrichedMarket.base_incentive_ids || []).length <= 20;
};

export const canIncreaseIncentives = ({
  enrichedMarket,
}: {
  enrichedMarket: EnrichedMarketDataType | undefined;
}) => {
  if (!enrichedMarket) return false;

  const incentive_ids = enrichedMarket.base_incentive_ids || [];
  const incentive_amounts = enrichedMarket.base_incentive_amounts || [];
  const incentive_rates = enrichedMarket.base_incentive_rates || [];
  const incentive_start_timestamps = enrichedMarket.base_start_timestamps || [];
  const incentive_end_timestamps = enrichedMarket.base_end_timestamps || [];

  for (let i = 0; i < incentive_ids.length; i++) {
    if (incentive_start_timestamps[i] && incentive_end_timestamps[i]) {
      return false;
    }
  }
  return (
    incentive_ids.length >= 20 &&
    incentive_start_timestamps.length === incentive_end_timestamps.length
  );
};

export const FormVaultIncentiveAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketForm: UseFormReturn<z.infer<typeof MarketFormSchema>>;
  }
>(({ className, marketForm, ...props }, ref) => {
  const { viewType, setViewType, userType } = useMarketManager();
  const { marketMetadata, propsEnrichedMarket } = useActiveMarket();

  return (
    <div
      ref={ref}
      className={cn(
        "flex w-full flex-col",
        viewType === MarketViewType.simple.id ? "flex-col" : "flex-col",
        // "flex-row items-center",
        className
      )}
    >
      <FormInputLabel
        size="sm"
        label="Action"
        info="The type of action you want to perform on incentives"
      />

      <Select
        onOpenChange={(open) => {
          return open;
        }}
        onValueChange={(e) => {
          marketForm.setValue(
            "vault_incentive_action",
            e as TypedRoycoMarketVaultIncentiveAction
          );
        }}
        value={
          marketForm.watch(
            "vault_incentive_action"
          ) as TypedRoycoMarketVaultIncentiveAction
        }
      >
        <SelectTrigger
          // noIcon={
          //   marketMetadata.market_type === MarketType.vault.id ? true : false
          // }
          className={cn(
            "w-full bg-white py-0 pl-3 pr-2 text-sm font-light text-black",
            BASE_MARGIN_TOP.XS
          )}
        >
          <div className="w-full">
            <FallMotion
              customKey={`${marketMetadata.market_type}:vault-incentive-action-selector:${marketForm.watch("vault_incentive_action")}`}
              height="2rem"
              motionClassName="flex flex-col items-start"
              contentClassName="text-left"
            >
              {MarketVaultIncentiveAction[
                marketForm.watch("vault_incentive_action")
              ]
                ? MarketVaultIncentiveAction[
                    marketForm.watch("vault_incentive_action")
                  ].label
                : "Select Incentive Action"}
            </FallMotion>
          </div>
        </SelectTrigger>

        <SelectContent>
          {Object.values(MarketVaultIncentiveAction).map((option) => (
            <SelectItem className="text-sm" key={option.id} value={option.id}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
});
