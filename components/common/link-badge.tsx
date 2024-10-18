"use client";

import { cn } from "@/lib/utils";
import { CheckIcon, CircleCheckBigIcon, ExternalLinkIcon } from "lucide-react";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type LinkBadgeProps = {
  cta: string;
  link: string;
};

const LinkBadge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & LinkBadgeProps
>(({ className, ...props }, ref) => {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        onFocus={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={async () => {
          if (isClicked === true) return;

          setIsClicked(true);
          await new Promise((r) => setTimeout(r, 500));
          // window.open(props.link, "_blank", "noopener noreferrer");
          await new Promise((r) => setTimeout(r, 500));
          setIsClicked(false);
        }}
        // disabled={isClicked}
        className={cn(
          "relative shrink-0 overflow-hidden rounded-full border border-divider bg-white transition-all duration-200 ease-in-out hover:bg-focus",
          className
        )}
      >
        <motion.div className="flex cursor-pointer flex-row items-center space-x-[6px] overflow-hidden px-2 py-1">
          <ExternalLinkIcon className="h-5 w-5 text-secondary" />
          <div className="body-2 h-5 text-secondary">
            <span className="leading-5">{props.cta}</span>
          </div>
        </motion.div>

        <AnimatePresence mode="sync">
          {isClicked && (
            <motion.div
              layout
              layoutId="success"
              key="success"
              initial={{ y: "-1.75rem", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "1.75rem", opacity: 1 }}
              transition={{
                type: "spring",
                ease: "easeOut",
                bounce: 0,
                duration: 0.5,
              }}
              className="absolute top-0 flex h-7 w-full flex-col place-content-center items-center overflow-hidden rounded-full bg-success"
            >
              <motion.svg
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ opacity: 0.5 }}
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-circle-check-big"
              >
                <motion.path
                  d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.path
                  d="m9 11 3 3L22 4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                />
              </motion.svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
});

export { LinkBadge };
