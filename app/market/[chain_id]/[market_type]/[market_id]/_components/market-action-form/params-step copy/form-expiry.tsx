"use client";

import React from "react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem } from "@/components/ui/form";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Switch } from "@/components/ui/switch";
import { MarketFormSchema } from "../market-form-schema";
import {
  BASE_MARGIN_TOP,
  InputLabel,
  SecondaryLabel,
  TertiaryLabel,
} from "../../composables";

export const FormExpiry = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketForm: UseFormReturn<z.infer<typeof MarketFormSchema>>;
  }
>(({ className, marketForm, ...props }, ref) => {
  return (
    <FormField
      control={marketForm.control}
      name="expiry"
      render={({ field }) => (
        <FormItem className={cn("", className)}>
          <InputLabel label="Expiry" />

          <div className={cn("relative mt-1 flex flex-col")}>
            <DateTimePicker
              className="text-sm font-300 text-black"
              customValue={
                marketForm.watch("no_expiry") ? "Never Expire" : undefined
              }
              date={field.value}
              setDate={(date: Date | undefined) => {
                field.onChange(date);
                marketForm.setValue("no_expiry", false);
              }}
              // Suffix={
              //   <Fragment>
              // <div className="font-gt text-sm font-400 text-secondary">
              //   Never Expire?
              // </div>

              // <Switch
              //   onCheckedChange={(e) => {
              //     if (marketForm.watch("no_expiry") === false) {
              //       marketForm.setValue("no_expiry", true);
              //     } else {
              //       marketForm.setValue("no_expiry", false);
              //     }
              //   }}
              //   checked={marketForm.watch("no_expiry")}
              // />
              //   </Fragment>
              // }
            />

            <div
              className={cn(
                "flex flex-row items-center justify-between",
                BASE_MARGIN_TOP.SM
              )}
            >
              <SecondaryLabel>Never Expire?</SecondaryLabel>

              <Switch
                onCheckedChange={(e) => {
                  if (marketForm.watch("no_expiry") === false) {
                    marketForm.setValue("no_expiry", true);
                  } else {
                    marketForm.setValue("no_expiry", false);
                  }
                }}
                checked={marketForm.watch("no_expiry")}
              />
            </div>
          </div>
        </FormItem>
      )}
    />
  );
});
