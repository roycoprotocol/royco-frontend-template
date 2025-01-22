import React, { useMemo } from "react";
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
import { FormInputLabel } from "@/components/composables";
import { BASE_MARGIN_TOP } from "../../../../composables";

export const WithdrawTypeSelector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { withdrawType, setWithdrawType } = useMarketManager();

  const withdrawTypeOptions = useMemo(() => {
    return [MarketWithdrawType.input_token, MarketWithdrawType.incentives];
  }, []);

  const labelWithdrawType = useMemo(() => {
    if (MarketWithdrawType[withdrawType]) {
      return MarketWithdrawType[withdrawType].label;
    }

    return "Select Withdraw Type";
  }, [withdrawType]);

  return (
    <div ref={ref} className={cn("flex w-full flex-col", className)}>
      <FormInputLabel size="sm" label="Withdraw Type" />

      <Select
        onValueChange={(e) => {
          setWithdrawType(e as TypedMarketWithdrawType);
        }}
        value={withdrawType}
      >
        <SelectTrigger
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
              {labelWithdrawType}
            </FallMotion>
          </div>
        </SelectTrigger>

        <SelectContent>
          {withdrawTypeOptions.map((option) => (
            <SelectItem className="text-sm" key={option.id} value={option.id}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
});
