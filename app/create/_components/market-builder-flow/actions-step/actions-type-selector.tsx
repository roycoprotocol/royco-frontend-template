"use client";

import React, { Fragment } from "react";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMarketBuilderManager } from "@/store";
import { ActionsType, ActionsTypeMap } from "@/store";

const Tabs = Object.values(ActionsTypeMap);

export const ActionsTypeSelector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { actionsType, setActionsType } = useMarketBuilderManager();

  const { activeStep } = useMarketBuilderManager();

  return (
    <div
      ref={ref}
      className={cn(
        "grid w-full list-none grid-cols-2 items-center justify-between overflow-hidden rounded-lg border border-divider bg-z2 p-1 font-gt text-xs font-400 uppercase",
        className
      )}
    >
      {Tabs.map((tab, index) => {
        const BASE_KEY = `actions-type-selector:${activeStep}:${tab.id}`;

        return (
          <motion.li
            // layout="position"
            // layoutId={BASE_KEY}
            key={BASE_KEY}
            tabIndex={index}
            onClick={() => setActionsType(tab.id)}
            className={cn(
              "relative flex !h-7 w-full cursor-pointer flex-row place-content-center items-center text-center",
              "transition-colors duration-200 ease-in-out",
              actionsType === tab.id ? "text-primary" : "text-secondary"
            )}
          >
            <div className="z-20 h-5">
              <span className="leading-5 text-inherit">{tab.label}</span>
            </div>

            <div className="absolute inset-0 z-10 h-full w-full">
              {actionsType === tab.id ? (
                <motion.div
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    type: "spring",
                    bounce: 0,
                    damping: 25,
                    stiffness: 300,
                  }}
                  layoutId={`market-form:${activeStep}:action-type:indicator`}
                  className={cn(
                    "h-full w-full rounded-md bg-white drop-shadow-sm"
                  )}
                ></motion.div>
              ) : null}
            </div>
          </motion.li>
        );
      })}
    </div>
  );
});
