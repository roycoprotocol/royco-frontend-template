"'use client'";

import * as React from "react";
import { motion, type HTMLMotionProps, type Transition } from "motion/react";

import {
  SlidingNumber,
  type SlidingNumberProps,
} from "@/components/animate-ui/text/sliding-number";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CounterProps = HTMLMotionProps<"div"> & {
  number: number;
  setNumber: (number: number) => void;
  slidingNumberProps?: Omit<SlidingNumberProps, "number">;
  buttonProps?: Omit<React.ComponentProps<typeof Button>, "'onClick'">;
  transition?: Transition;
};

function Counter({
  number,
  setNumber,
  className,
  slidingNumberProps,
  buttonProps,
  transition = { type: "spring", bounce: 0, stiffness: 300, damping: 30 },
  ...props
}: CounterProps) {
  return (
    <div
      data-slot="counter"
      layout
      className={cn(
        "flex h-9 items-center justify-between gap-x-2 rounded-none border border-_divider_ bg-_surface_secondary p-1",
        className
      )}
      {...props}
    >
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          size="icon"
          {...buttonProps}
          onClick={() => setNumber(number - 1)}
          className={cn(
            "h-7 w-7 rounded-none bg-_tertiary_ pb-[3px] text-2xl font-medium text-white hover:opacity-80",
            buttonProps?.className
          )}
        >
          -
        </Button>
      </motion.div>

      <SlidingNumber
        number={number}
        {...slidingNumberProps}
        className={cn(
          "px-2 text-base font-medium text-_primary_",
          slidingNumberProps?.className
        )}
      />

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          size="icon"
          {...buttonProps}
          onClick={() => setNumber(number + 1)}
          className={cn(
            "h-7 w-7 rounded-none bg-_tertiary_ pb-[3px] text-2xl font-light text-white hover:opacity-80",
            buttonProps?.className
          )}
        >
          +
        </Button>
      </motion.div>
    </div>
  );
}

export { Counter, type CounterProps };
