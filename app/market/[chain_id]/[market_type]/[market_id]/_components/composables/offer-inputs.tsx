import { cn } from "@/lib/utils";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { MarketFormSchema } from "../market-form";
import { Input } from "@/components/ui/input";
import { DollarSign, PercentIcon } from "lucide-react";

export const DollarInput = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: any;
    onChange: any;
  }
>(({ className, value, onChange, ...props }, ref) => {
  return (
    <div ref={ref} className="contents">
      <Input
        newHeight="h-8"
        newLeading="leading-8"
        Prefix={() => {
          return (
            <div className="flex h-4 w-4 flex-col place-content-center items-center">
              <DollarSign
                strokeWidth={1.5}
                className="h-4 w-4 text-secondary"
              />
            </div>
          );
        }}
        value={value}
        type="number"
        step="any"
        placeholder="Enter your value"
        containerClassName="!h-8 grow gap-2 py-0 px-2 text-black"
        className="text-sm"
        onChange={onChange}
      />
    </div>
  );
});

export const PercentInput = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: any;
    onChange: any;
  }
>(({ className, value, onChange, ...props }, ref) => {
  return (
    <div ref={ref} className="contents">
      <Input
        Suffix={() => {
          return (
            <div className="flex h-4 w-4 flex-col place-content-center items-center">
              <PercentIcon
                strokeWidth={1.5}
                className="h-4 w-4 text-secondary"
              />
            </div>
          );
        }}
        newHeight="h-8"
        newLeading="leading-8"
        value={value}
        type="number"
        step="any"
        placeholder="Enter your value"
        containerClassName="!h-8 grow gap-2 py-0 px-2 text-black"
        className="text-sm"
        onChange={onChange}
      />
    </div>
  );
});
