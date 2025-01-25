import React from "react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { FormInputLabel } from "@/components/composables";
import { TimestampSelector } from "./timestamp-selector";
import { UseFormReturn } from "react-hook-form";
import { MarketActionFormSchema } from "../..";
import { Switch } from "@/components/ui/switch";
import { SecondaryLabel } from "../../../../composables";
import { SlideUpWrapper } from "@/components/animations";
import { useMarketManager } from "@/store/use-market-manager";

export const InputExpirySelector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
  }
>(({ className, marketActionForm, ...props }, ref) => {
  const { viewType } = useMarketManager();

  return (
    <div ref={ref} className={cn("", className)} {...props}>
      <div className={cn("flex flex-row items-center justify-between")}>
        <SecondaryLabel className="font-medium text-black">
          Offer Expiry?
        </SecondaryLabel>

        <Switch
          onCheckedChange={(e) => {
            if (marketActionForm.watch("no_expiry") === false) {
              marketActionForm.setValue("no_expiry", true);
            } else {
              marketActionForm.setValue("no_expiry", false);
            }
          }}
          checked={!marketActionForm.watch("no_expiry")}
        />
      </div>

      {!marketActionForm.watch("no_expiry") && (
        <SlideUpWrapper delay={0.1}>
          <TimestampSelector
            className="mt-3"
            customValue={
              marketActionForm.watch("no_expiry") ? "Never Expire" : undefined
            }
            currentValue={marketActionForm.watch("expiry")}
            setCurrentValue={(date) => {
              marketActionForm.setValue("expiry", date);
            }}
          />
        </SlideUpWrapper>
      )}
    </div>
  );
});
