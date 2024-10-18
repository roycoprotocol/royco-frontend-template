"use client";

import React from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { FallMotion } from "@/components/animations";

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { TokenDisplayer } from "@/components/common";

import { useBaseChains } from "@/sdk/hooks";
import {
  LockupTimeMap,
  type MarketBuilderFormSchema,
} from "../../market-builder-form";

export const FormLockupTimeDurationType = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketBuilderForm: UseFormReturn<z.infer<typeof MarketBuilderFormSchema>>;
  }
>(({ className, marketBuilderForm, ...props }, ref) => {
  const [focusedId, setFocusedId] = React.useState<string | null>(null);

  return (
    <FormField
      control={marketBuilderForm.control}
      name="lockup_time"
      render={({ field }) => (
        <FormItem className="">
          <Select
            onValueChange={(e) => {
              marketBuilderForm.setValue("lockup_time", {
                ...field.value,
                duration_type: e,
              });
            }}
          >
            <SelectTrigger className="body-2 relative flex !h-10 w-fit flex-row gap-1 border-none pl-0 text-primary">
              <div className="pointer-events-none opacity-0">
                {LockupTimeMap[field.value.duration_type].label}
              </div>

              <div className="absolute left-0 top-0 h-10 w-full pr-2">
                <FallMotion
                  customKey={`lockup-time:${field.value.duration_type}`}
                  height="2.5rem"
                  contentClassName="text-left"
                >
                  {LockupTimeMap[field.value.duration_type].label}
                </FallMotion>
              </div>
            </SelectTrigger>

            <SelectContent align="end">
              <ul className="list gap-0">
                {Object.keys(LockupTimeMap)
                  /**
                   * @TODO Strictly type this
                   */
                  // @ts-ignore
                  .sort((a, b) => a.offer - b.offer)
                  .map((currKey, index) => {
                    const lockupTimeKey = `timelock:${LockupTimeMap[currKey].notation}`;

                    return (
                      <SelectItem
                        key={lockupTimeKey}
                        className={cn()}
                        value={currKey}
                      >
                        {LockupTimeMap[currKey].label}
                      </SelectItem>
                    );
                  })}
              </ul>
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
});
