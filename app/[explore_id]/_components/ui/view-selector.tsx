"use client";

import { useExplore } from "@/store";
import React, { Fragment } from "react";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LayoutGrid, LayoutGridIcon, ListIcon } from "lucide-react";

const ExploreViews = [
  {
    id: "list",
    label: "List",
    icon: <ListIcon strokeWidth={1.5} className="h-5 w-5" />,
  },
  {
    id: "grid",
    label: "Grid",
    icon: <LayoutGridIcon strokeWidth={1.5} className="h-5 w-5" />,
  },
];

export const ViewSelector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { exploreView, setExploreView } = useExplore();

  return (
    <div
      ref={ref}
      className={cn(
        "subtitle-2 flex w-fit list-none flex-row items-center justify-between gap-1",
        className
      )}
      {...props}
    >
      {ExploreViews.map((tab, index) => {
        const BASE_KEY = `explore-view:${tab.id}`;

        return (
          <motion.li
            layoutId={BASE_KEY}
            key={BASE_KEY}
            tabIndex={index}
            onClick={() => setExploreView(tab.id)}
            className={cn(
              "relative w-fit cursor-pointer text-center",
              "transition-colors duration-200 ease-in-out hover:text-primary",
              exploreView === tab.id ? "text-primary" : "text-secondary"
            )}
          >
            <div className="z-20 flex h-10 w-10 shrink-0 flex-col place-content-center items-center text-inherit opacity-0"></div>

            <div className="absolute inset-0 z-50 flex h-10 w-10 flex-col place-content-center items-center text-inherit">
              {tab.icon}
            </div>

            {exploreView === tab.id ? (
              <motion.div
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                  type: "spring",
                  bounce: 0,
                }}
                layoutId="offer-action:indicator"
                className="absolute inset-0 z-0 h-10 w-10 shrink-0 rounded-xl border border-divider bg-focus"
              ></motion.div>
            ) : (
              <Fragment />
            )}
          </motion.li>
        );
      })}
    </div>
  );
});
