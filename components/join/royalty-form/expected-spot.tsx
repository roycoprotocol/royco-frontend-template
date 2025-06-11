"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { RoyaltyFormSchema } from "./royalty-form-schema";
import { z } from "zod";
import { lodableExpectedRankAtom } from "@/store/royalty";
import { useAtomValue } from "jotai";

export const ExpectedSpot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    royaltyForm: UseFormReturn<z.infer<typeof RoyaltyFormSchema>>;
  }
>(({ className, royaltyForm, ...props }, ref) => {
  const { data, isLoading } = useAtomValue(lodableExpectedRankAtom);

  return (
    <div ref={ref} {...props} className={cn("flex w-full flex-col", className)}>
      <div className="flex flex-row items-center text-lg font-medium text-black">
        Expected Spot: #{data?.rank ?? 0}
      </div>

      <div className="text-sm font-light text-tertiary">
        Connect more assets to move up.
      </div>
    </div>
  );
});
