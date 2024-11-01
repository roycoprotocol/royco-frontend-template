import React from "react";
import { cn } from "@/lib/utils";
import { FormInputLabel } from "@/components/composables";
import { MarketOfferType } from "@/store";
import { useMarketManager } from "@/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { FallMotion } from "@/components/animations";
import { TypedRoycoMarketOfferType } from "@/sdk/market";

export const OfferTypeSelector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { offerType, setOfferType } = useMarketManager();
  return (
    <div ref={ref} className={cn("", className)} {...props}>
      <FormInputLabel
        size="sm"
        label="Offer Type"
        info="The type of offer you want to place"
      />

      <Select
        onOpenChange={(open) => {
          return open;
        }}
        onValueChange={(e) => {
          setOfferType(e as TypedRoycoMarketOfferType);
        }}
        value={offerType}
      >
        <SelectTrigger
          className={cn(
            "mt-2 w-full bg-white py-0 pl-3 pr-2 text-sm font-light text-black"
          )}
        >
          <div className="w-full">
            <FallMotion
              customKey={`market:offer-type-selector:${offerType}`}
              height="2rem"
              motionClassName="flex flex-col items-start"
              contentClassName="text-left"
            >
              {MarketOfferType[offerType]
                ? MarketOfferType[offerType].label
                : "Select Offer Type"}
            </FallMotion>
          </div>
        </SelectTrigger>

        <SelectContent className="w-full">
          {Object.values(MarketOfferType).map((option) => (
            <SelectItem className="text-sm" key={option.id} value={option.id}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
});
