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
          <FormInputLabel className="mb-2" label="Description" />

          <FormControl>
            <Textarea
              rows={4}
              className=""
              placeholder="i.e. When USDC is supplied to the market, it is deposited into Compound Finance USDC Mainnet Pool. Users may withdraw at any time."
              {...field}
            />
          </FormControl>

          <FormDescription className="mt-2">
            Detailed description of the action. This should tell users what you
            are incentivizing.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
});
