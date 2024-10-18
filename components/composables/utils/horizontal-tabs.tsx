"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const HorizontalTabs = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    tabs: {
      id: string;
      label: string;
    }[];
    baseId: string;
    activeTab: string;
    size?: "sm" | "md" | "lg";
    setter: any;
  }
>(
  (
    { className, tabs, size = "md", baseId, activeTab, setter, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid w-full list-none grid-cols-2 items-center justify-between overflow-hidden bg-z2  font-gt font-400",
          size === "sm" && "h-9 rounded-lg p-1 text-sm",
          size === "md" && "h-9 rounded-md p-1 text-base",
          className
        )}
        {...props}
      >
        {tabs.map((tab, tabIndex) => {
          const BASE_KEY = `${baseId}:tab-selector:${tab.id}:option`;

          return (
            <motion.li
              key={BASE_KEY}
              tabIndex={0}
              onClick={() => {
                setter(tab.id);
              }}
              className={cn(
                "relative flex w-full cursor-pointer flex-row place-content-center items-center text-center",
                "px-2 transition-colors duration-200 ease-in-out",
                size === "sm" && "!h-7",
                size === "md" && "!h-7",
                activeTab === tab.id ? "text-black" : "text-secondary"
              )}
            >
              <div className="z-20 flex h-5">
                <span className="leading-5 text-inherit">{tab.label}</span>
              </div>

              <div className="absolute inset-0 h-full w-full">
                {activeTab === tab.id ? (
                  <motion.div
                    transition={{
                      duration: 0.2,
                      ease: "easeInOut",
                      type: "tween",
                      bounce: 0,
                      // damping: 25,
                      // stiffness: 300,
                    }}
                    layoutId={`${baseId}:indicator`}
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
  }
);
