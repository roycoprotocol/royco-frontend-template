"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { CircleAlertIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const ErrorAlert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    message: string;
  }
>(({ className, message, ...props }, ref) => {
  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        // ref={ref}
        className={cn(
          "flex w-fit max-w-lg items-center gap-2 rounded-xl border border-divider bg-error bg-opacity-80 px-3 py-2 text-black drop-shadow-sm backdrop-blur-md",
          className
        )}
        // {...props}
      >
        <div className="flex w-full flex-row items-center justify-between space-x-2">
          <div className="h-5 w-5">
            <CircleAlertIcon strokeWidth={1.5} className="h-5 w-5 text-white" />
          </div>
          <div className="mt-[0.15rem] flex h-fit w-fit font-gt text-base font-300 text-white">
            <span className="leading-5">{message}</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
});
