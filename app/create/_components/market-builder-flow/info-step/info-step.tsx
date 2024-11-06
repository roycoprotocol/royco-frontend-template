"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { MarketBuilderFormSchema } from "../../market-builder-form";
import { z } from "zod";
import { FormMarketName } from "./form-market-name";
import { FormMarketDescription } from "./form-market-description";

import { MotionWrapper } from "../animations";
import { FormChain } from "./form-chain";
import { UseFormReturn } from "react-hook-form";
import { FormAsset } from "./form-asset";
import { FormActionType, FormIncentiveSchedule } from "./form-selectors";
import { FormLockupTime } from "./form-lockup-time";
import { AnimatePresence, motion } from "framer-motion";
import { SectionSubtitle } from "../../../../_components/ui/composables";

export const InfoStep = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketBuilderForm: UseFormReturn<z.infer<typeof MarketBuilderFormSchema>>;
  }
>(({ className, marketBuilderForm, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "hide-scrollbar flex w-full shrink-0 grow flex-col overflow-y-scroll",
        className
      )}
      {...props}
    >
      <MotionWrapper>
        <div className={cn("subtitle-1 text-black")}>Market Details</div>
        <p className="caption text-tertiary">
          Learn more about creating your Royco Market{" "}
          <span className="underline">
            <a
              target="_blank"
              href="https://docs.royco.org/developers/creating-an-iam"
              rel="noopener noreferrer"
            >
              here
            </a>
          </span>
          .
        </p>

        <FormMarketName
          className="mt-9"
          marketBuilderForm={marketBuilderForm}
        />
      </MotionWrapper>

      <MotionWrapper delay={0.1}>
        <FormMarketDescription
          className="mt-9"
          marketBuilderForm={marketBuilderForm}
        />
      </MotionWrapper>

      <MotionWrapper delay={0.3}>
        <FormActionType
          className="mt-9"
          marketBuilderForm={marketBuilderForm}
        />
      </MotionWrapper>

      <div className="mt-9 grid grid-cols-2 gap-3">
        <MotionWrapper delay={0.2}>
          <FormChain className="" marketBuilderForm={marketBuilderForm} />
        </MotionWrapper>

        <MotionWrapper delay={0.2}>
          <FormAsset className="" marketBuilderForm={marketBuilderForm} />
        </MotionWrapper>
      </div>

      <MotionWrapper delay={0.4}>
        <FormIncentiveSchedule
          className="mt-9"
          marketBuilderForm={marketBuilderForm}
        />
      </MotionWrapper>

      <MotionWrapper delay={0.5}>
        <AnimatePresence>
          {marketBuilderForm.watch("action_type") === "recipe" && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
            >
              <FormLockupTime
                className="mt-9"
                marketBuilderForm={marketBuilderForm}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {/* <FormExpiry className="mt-9" marketBuilderForm={marketBuilderForm} /> */}
      </MotionWrapper>
    </div>
  );
});
