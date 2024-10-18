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

import { Input } from "@/components/ui/input";

import { type MarketBuilderFormSchema } from "../../market-builder-form";
import { FormInputLabel } from "@/components/composables";

export const FormMarketName = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketBuilderForm: UseFormReturn<z.infer<typeof MarketBuilderFormSchema>>;
  }
>(({ className, marketBuilderForm, ...props }, ref) => {
  return (
    <FormField
      control={marketBuilderForm.control}
      name="market_name"
      render={({ field }) => (
        <FormItem className={cn("", className)}>
          <FormInputLabel className="mb-2" label="Market Name" />

          <FormControl>
            <Input className="" placeholder="Enter Market Name" {...field} />
          </FormControl>

          <FormDescription className="mt-2">
            How the market will be shown across interfaces
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
});
