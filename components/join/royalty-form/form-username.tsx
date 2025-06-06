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

import { RoyaltyFormSchema } from "./royalty-form-schema";
import { FormInputLabel } from "@/components/composables";

export const FormUsername = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    royaltyForm: UseFormReturn<z.infer<typeof RoyaltyFormSchema>>;
  }
>(({ className, royaltyForm, ...props }, ref) => {
  return (
    <FormField
      control={royaltyForm.control}
      name="username"
      render={({ field }) => (
        <FormItem className={cn("", className)}>
          <FormInputLabel className="mb-2" label="Nickname" />

          <FormControl>
            <Input className="" placeholder="BigRoycoFan" {...field} />
          </FormControl>

          <FormDescription className="mt-2">
            This will be public.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
});
