import React from "react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { SlideUpWrapper } from "@/components/animations";
import { FormInputLabel } from "@/components/composables";
import { TimestampSelector } from "./timestamp-selector";
import { UseFormReturn } from "react-hook-form";
import { MarketActionFormSchema } from "../..";
import { Switch } from "@/components/ui/switch";
import { SecondaryLabel } from "../../../../composables";

export const InputExpirySelector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    delay: number;
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
  }
>(({ className, delay, marketActionForm, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("mt-5", className)} {...props}>
      <SlideUpWrapper
        layout="position"
        layoutId="motion:market:input-expiry-selector"
        delay={delay}
      >
        <FormInputLabel label="Expiry" info="The expiry of the offer" />

        <div className={cn("mt-2 flex flex-row items-center justify-between")}>
          <SecondaryLabel>Never Expire?</SecondaryLabel>

          <Switch
            onCheckedChange={(e) => {
              if (marketActionForm.watch("no_expiry") === false) {
                marketActionForm.setValue("no_expiry", true);
              } else {
                marketActionForm.setValue("no_expiry", false);
              }
            }}
            checked={marketActionForm.watch("no_expiry")}
          />
        </div>

        <TimestampSelector
          className="mt-3"
          customValue={
            marketActionForm.watch("no_expiry") ? "Never Expire" : undefined
          }
          currentValue={marketActionForm.watch("expiry")}
          setCurrentValue={(date) => {
            if (date && marketActionForm.watch("no_expiry") === true) {
              marketActionForm.setValue("no_expiry", false);
            }
            marketActionForm.setValue("expiry", date);
          }}
        />
      </SlideUpWrapper>
    </div>
  );
});
