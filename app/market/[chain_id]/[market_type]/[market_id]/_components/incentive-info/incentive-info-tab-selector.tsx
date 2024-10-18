"use client";

import React, { Fragment } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { MarketIncentiveType, useMarketManager } from "@/store";
import { ActionsTypeMap } from "@/store/use-market-manager";

const Tabs = Object.values(MarketIncentiveType);

export const IncentiveInfoTabSelector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { incentiveType, setIncentiveType } = useMarketManager();

  return (
    <div
      ref={ref}
      className={cn(
        "grid h-8 w-full list-none grid-cols-2 items-center justify-between overflow-hidden rounded-md border border-divider bg-z2 p-1 font-gt text-xs font-400 uppercase",
        className
      )}
    >
      {Tabs.map((tab, index) => {
        const BASE_KEY = `incentive-info:incentive-type-selector:${tab.id}`;

        return (
          <motion.li
            key={BASE_KEY}
            tabIndex={0}
            onClick={() => setIncentiveType(tab.id)}
            className={cn(
              "relative flex !h-6 w-full cursor-pointer flex-row place-content-center items-center text-center",
              "px-2 transition-colors duration-200 ease-in-out",
              incentiveType === tab.id ? "text-black" : "text-secondary"
            )}
          >
            <div className="z-20 h-5">
              <span className="leading-5 text-inherit">{tab.label}</span>
            </div>

            <div className="absolute inset-0 h-full w-full">
              {incentiveType === tab.id ? (
                <motion.div
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    type: "spring",
                    bounce: 0,
                    damping: 25,
                    stiffness: 300,
                  }}
                  layoutId={`market:incentive-info:indicator`}
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
