"use client";

import React from "react";

import { cn } from "@/lib/utils";

import { z } from "zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { type UseFormReturn } from "react-hook-form";

import { Textarea } from "@/components/ui/textarea";

import { type MarketBuilderFormSchema } from "../../market-builder-form";
import { FormInputLabel } from "@/components/composables";

export const FormMarketDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketBuilderForm: UseFormReturn<z.infer<typeof MarketBuilderFormSchema>>;
  }
>(({ className, marketBuilderForm, ...props }, ref) => {
  return (
    <FormField
      control={marketBuilderForm.control}
      name="market_description"
      render={({ field }) => (
        <FormItem className={cn("", className)}>
          <FormInputLabel className="mb-2" label="Market Description" />

          <FormControl>
            <Textarea
              rows={4}
              className=""
              placeholder="i.e. When assets are supplied to the market, they are sent to an escrow contract and locked for three months."
              {...field}
            />
          </FormControl>

          <FormDescription className="mt-2">
            Describe how you'll manage the assets
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
});
