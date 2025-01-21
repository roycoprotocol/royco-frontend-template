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

export const FormEmail = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    royaltyForm: UseFormReturn<z.infer<typeof RoyaltyFormSchema>>;
  }
>(({ className, royaltyForm, ...props }, ref) => {
  return (
    <FormField
      control={royaltyForm.control}
      name="email"
      render={({ field }) => (
        <FormItem className={cn("", className)}>
          <FormInputLabel className="mb-2" label="Email" />

          <FormControl>
            <Input
              className=""
              placeholder="anon_whale@protonmail.com"
              {...field}
            />
          </FormControl>

          <FormDescription className="mt-2">
            This is private. We'll reach out when it's your time.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
});
