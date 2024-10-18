"use client";

import { cn } from "@/lib/utils";
import {
  CheckIcon,
  ChevronsRight,
  ChevronsRightIcon,
  CircleCheckBigIcon,
  ExternalLinkIcon,
} from "lucide-react";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type ActionButtonProps = {
  link: string;
};

const ActionButton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & ActionButtonProps
>(({ className, ...props }, ref) => {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        onClick={async () => {
          if (isClicked === true) return;

          setIsClicked(true);
          await new Promise((r) => setTimeout(r, 400));
          setIsClicked(false);
          await new Promise((r) => setTimeout(r, 150));
          window.open(props.link, "_blank", "noopener noreferrer");
        }}
        // disabled={isClicked}
        className={cn(
          "relative w-full overflow-hidden rounded-md border bg-black transition-all duration-200 ease-in-out hover:bg-primary",
          className
        )}
      >
        <motion.div className="flex w-full cursor-pointer flex-row items-center space-x-[6px] px-2 py-2 text-center">
          <div className="body-2 h-5 w-full text-center text-white">
            {!isClicked && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="leading-5"
              >
                Create Offer
              </motion.span>
            )}
          </div>
        </motion.div>

        <AnimatePresence mode="sync">
          {isClicked && (
            <motion.div
              layout
              layoutId="action"
              key="action"
              initial={{ x: "-5rem", opacity: 0, filter: "blur(4px)" }}
              animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ x: "5rem", opacity: 0, filter: "blur(4px)" }}
              transition={{
                type: "spring",
                ease: "easeInOut",
                bounce: 0.25,
                duration: 0.3,
              }}
              className="absolute top-0 flex h-9 w-full flex-col place-content-center items-center rounded-full"
            >
              <ChevronsRightIcon className="h-5 w-5 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
});

export { ActionButton };
