"use client";

import React from "react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { MarketBuilderFormSchema } from "../../market-builder-form";
import { UseFormReturn } from "react-hook-form";
import { FormLockupTimeDurationType } from "./form-lockup-time-duration-type";
import { isSolidityIntValid } from "royco/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CircleHelpIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FormInputLabel } from "@/components/composables";

export const FormLockupTime = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketBuilderForm: UseFormReturn<z.infer<typeof MarketBuilderFormSchema>>;
  }
>(({ className, marketBuilderForm, ...props }, ref) => {
  return (
    <FormField
      control={marketBuilderForm.control}
      name="lockup_time"
      render={({ field }) => (
        <FormItem className={cn("", className)}>
          <FormInputLabel
            className="mb-2"
            label="TimeLock"
            info="Only required for Recipe Action"
          />

          <FormControl>
            <div className={cn("relative flex flex-col")}>
              <div className="flex h-10 w-full flex-row items-center rounded-md border border-divider">
                <Input
                  onChange={(e) => {
                    let inputValue = e.target.value;

                    if (inputValue === "") {
                      marketBuilderForm.setValue("lockup_time", {
                        ...field.value,
                        duration: undefined,
                      });
                      return;
                    } else {
                      if (isSolidityIntValid("uint256", inputValue)) {
                        marketBuilderForm.setValue("lockup_time", {
                          ...field.value,
                          duration: inputValue,
                        });
                      }
                    }
                  }}
                  onInput={(e) => {
                    // Prevent invalid characters from being entered (e.g., --, .)
                    // @ts-ignore
                    e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Strip any non-numeric input
                  }}
                  value={marketBuilderForm.watch("lockup_time").duration || ""}
                  type="number"
                  min="0"
                  step="1"
                  containerClassName="shrink-0 flex-grow border-none"
                  placeholder="Enter Duration"
                />

                <FormLockupTimeDurationType
                  marketBuilderForm={marketBuilderForm}
                />
              </div>

              <AnimatePresence mode="popLayout">
                {marketBuilderForm.watch("action_type") !== "recipe" && (
                  <motion.div
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: "easeInOut",
                      type: "spring",
                      damping: 25,
                      stiffness: 300,
                    }}
                    className="absolute left-0 top-0 h-full w-full cursor-not-allowed bg-white bg-opacity-50 backdrop-saturate-0"
                  ></motion.div>
                )}
              </AnimatePresence>
            </div>
          </FormControl>
          <FormDescription className="mt-2">
            Time the input asset will be locked for.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
});
