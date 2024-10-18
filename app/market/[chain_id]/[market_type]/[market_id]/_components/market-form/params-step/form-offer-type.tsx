import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { MarketFormSchema } from ".././market-form-schema";
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
  MarketViewType,
} from "@/store";
import { useMarketManager } from "@/store";
import { FallMotion } from "@/components/animations";
import { useActiveMarket } from "../../hooks";
import { FormLabel } from "@/components/ui/form";
import { BASE_MARGIN_TOP, FormInputLabel, InputLabel } from "../../composables";
import { TypedRoycoMarketOfferType } from "@/sdk/market";

const options = [MarketOfferType.market, MarketOfferType.limit];

export const FormOfferType = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketForm: UseFormReturn<z.infer<typeof MarketFormSchema>>;
  }
>(({ className, marketForm, ...props }, ref) => {
  const { viewType, setViewType, userType } = useMarketManager();
  const { marketMetadata, propsEnrichedMarket } = useActiveMarket();

  // const resetOrderType = () => {
  //   if (
  //     !!propsEnrichedMarket.data &&
  //     marketMetadata.market_type === MarketType.vault.id
  //   ) {
  //     if (userType === MarketUserType.ap.id) {
  //       marketForm.setValue("offer_type", MarketOfferType.limit.id, {
  //         shouldValidate: true,
  //         shouldDirty: true,
  //       });
  //     } else {
  //       marketForm.setValue("offer_type", MarketOfferType.market.id, {
  //         shouldValidate: true,
  //         shouldDirty: true,
  //       });
  //     }
  //   }
  // };

  // useEffect(() => {
  //   resetOrderType();
  // }, [userType]);

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
        label="Offer Type"
        info="The type of offer you want to place"
      />

      <Select
        // open={
        //   marketMetadata.market_type === MarketType.vault.id ? false : undefined
        // }
        onOpenChange={(open) => {
          // if (marketMetadata.market_type === MarketType.vault.id) {
          //   return false;
          // } else {
          //   return open;
          // }
          return open;
        }}
        onValueChange={(e) => {
          marketForm.setValue("offer_type", e as TypedRoycoMarketOfferType);
        }}
        value={marketForm.watch("offer_type") as TypedRoycoMarketOfferType}
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
              customKey={`${marketMetadata.market_type}:offer-type-selector:${marketForm.watch("offer_type")}`}
              height="2rem"
              motionClassName="flex flex-col items-start"
              contentClassName="text-left"
            >
              {MarketOfferType[marketForm.watch("offer_type")]
                ? MarketOfferType[marketForm.watch("offer_type")].label
                : "Select Offer Type"}
            </FallMotion>
          </div>
        </SelectTrigger>

        <SelectContent>
          {options.map((option) => (
            <SelectItem className="text-sm" key={option.id} value={option.id}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
});
