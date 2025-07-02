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
import {
  FormActionType,
  FormCreateActions,
  FormIncentiveSchedule,
} from "./form-selectors";
import { FormLockupTime } from "./form-lockup-time";
import { AnimatePresence, motion } from "framer-motion";

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

      {/**
       * Vault markets are deprecated, so all markets are recipe markets now
       */}
      {/* {process.env.NEXT_PUBLIC_FRONTEND_TAG !== "boyco" && (
        <MotionWrapper delay={0.2}>
          <FormActionType
            className="mt-9"
            marketBuilderForm={marketBuilderForm}
          />
        </MotionWrapper>
      )}

      {marketBuilderForm.watch("action_type") === "recipe" && (
        <MotionWrapper delay={0.3}>
          <FormCreateActions
            className="mt-9"
            marketBuilderForm={marketBuilderForm}
          />
        </MotionWrapper>
      )} */}

      {process.env.NEXT_PUBLIC_FRONTEND_TAG !== "boyco" && (
        <MotionWrapper delay={0.3}>
          <FormChain className="mt-9" marketBuilderForm={marketBuilderForm} />
        </MotionWrapper>
      )}

      {process.env.NEXT_PUBLIC_FRONTEND_TAG !== "boyco" && (
        <MotionWrapper delay={0.4}>
          <FormIncentiveSchedule
            className="mt-9"
            marketBuilderForm={marketBuilderForm}
          />
        </MotionWrapper>
      )}

      <MotionWrapper
        delay={process.env.NEXT_PUBLIC_FRONTEND_TAG === "boyco" ? 0.2 : 0.5}
      >
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height:
                marketBuilderForm.watch("action_type") === "recipe"
                  ? "auto"
                  : 0,
              opacity:
                marketBuilderForm.watch("action_type") === "recipe" ? 1 : 0,
            }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration:
                process.env.NEXT_PUBLIC_FRONTEND_TAG === "boyco" ? 0.3 : 0.5,
              height: {
                type: "spring",
                damping: 25,
                stiffness: 200,
              },
            }}
            style={{ overflow: "hidden" }}
          >
            <FormAsset className="mt-9" marketBuilderForm={marketBuilderForm} />

            {process.env.NEXT_PUBLIC_FRONTEND_TAG !== "boyco" && (
              <FormLockupTime
                className="mt-9"
                marketBuilderForm={marketBuilderForm}
              />
            )}
          </motion.div>
        </AnimatePresence>
        {/* <FormExpiry className="mt-9" marketBuilderForm={marketBuilderForm} /> */}
      </MotionWrapper>
    </div>
  );
});
