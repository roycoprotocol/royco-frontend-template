import React from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { MarketWithdrawType, TypedMarketWithdrawType } from "@/store";
import { useMarketManager } from "@/store";
import { FallMotion } from "@/components/animations";
import { useActiveMarket } from "../../../hooks";
import { BASE_MARGIN_TOP, FormInputLabel } from "../../../composables";

const options = [MarketWithdrawType.input_token, MarketWithdrawType.incentives];

export const SelectWithdrawType = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { withdrawType, setWithdrawType } = useMarketManager();
  const { marketMetadata, propsEnrichedMarket } = useActiveMarket();

  return (
    <div
      ref={ref}
      className={cn(
        "flex w-full flex-col",

        // "flex-row items-center",
        className
      )}
    >
      <FormInputLabel
        size="sm"
        label="Withdraw Type"
        info="The type of asset you want to withdraw"
      />

      <Select
        onValueChange={(e) => {
          setWithdrawType(e as TypedMarketWithdrawType);
        }}
        value={withdrawType}
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
              customKey={`${withdrawType}:withdraw-type-selector`}
              height="2rem"
              motionClassName="flex flex-col items-start"
              contentClassName="text-left"
            >
              {MarketWithdrawType[withdrawType]
                ? MarketWithdrawType[withdrawType].label
                : "Select Withdraw Type"}
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
