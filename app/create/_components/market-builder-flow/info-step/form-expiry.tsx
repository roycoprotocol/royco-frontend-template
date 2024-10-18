"use client";

import React, { Fragment } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { MarketBuilderFormSchema } from "../../market-builder-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CircleHelpIcon } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { FormInputLabel } from "@/components/composables";

export const FormExpiry = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketBuilderForm: UseFormReturn<z.infer<typeof MarketBuilderFormSchema>>;
  }
>(({ className, marketBuilderForm, ...props }, ref) => {
  return (
    <FormField
      control={marketBuilderForm.control}
      name="expiry"
      render={({ field }) => (
        <FormItem className={cn("", className)}>
          <FormInputLabel
            className="mb-2"
            label="Expiry"
            info=" Only required for Recipe Action"
          />

          <FormControl>
            <div className={cn("relative flex flex-col")}>
              <DateTimePicker
                // disabled={!marketBuilderForm.watch("time_lock").enabled}
                // customValue={
                //   marketBuilderForm.watch("no_expiry") === true
                //     ? "Never Expire"
                //     : undefined
                // }
                date={field.value}
                setDate={(date: Date | undefined) => {
                  field.onChange(date);
                }}
                // Suffix={
                //   <Fragment>
                //     <div className="font-gt text-base font-400 text-secondary">
                //       Never Expire?
                //     </div>

                //     <Switch
                //       onCheckedChange={(e) => {
                //         if (marketBuilderForm.watch("no_expiry") === false) {
                //           marketBuilderForm.setValue("no_expiry", true);
                //         } else {
                //           marketBuilderForm.setValue("no_expiry", false);
                //         }
                //       }}
                //       checked={marketBuilderForm.watch("no_expiry")}
                //     />
                //   </Fragment>
                // }
              />

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

          <FormMessage />
        </FormItem>
      )}
    />
  );
});
