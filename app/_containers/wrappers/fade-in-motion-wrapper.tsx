import React from "react";
import { HTMLMotionProps, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import useMeasure from "react-use-measure";

export const FadeInMotionWrapper = React.forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div">
>(
  (
    {
      children,
      className,

      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{ once: true }}
        initial={{ opacity: 0, y: 100 }}
        transition={{
          duration: 1,
          ease: "easeOut",
        }}
        ref={ref}
        className={cn("", className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
