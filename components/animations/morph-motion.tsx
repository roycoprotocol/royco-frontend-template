"use client";

import React, { Fragment } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const variants = {
  initial: {
    scale: 0,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
  },
  exit: {
    scale: 0,
    opacity: 0,
  },
  transition: {
    duration: 0.3,
    ease: "easeInOut",
    type: "spring",
    bounce: 0,
  },
};

/**
 * @description Morph Motion Container
 */
const MorphMotionContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ id, className, children, ...props }, ref) => {
  return (
    <AnimatePresence initial={false} mode="sync">
      <motion.div
        layout="position"
        layoutId={`morph-motion:${id ?? "default"}:container`}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={variants.transition}
        className={cn("flex h-fit w-fit flex-row items-center", className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
});
MorphMotionContainer.displayName = "MorphMotionContainer";

/**
 * @description Morph Motion Text
 */
const MorphMotionText = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ id, className, children, ...props }, ref) => (
  <Fragment>
    {typeof children === "string" &&
      children.split("").map((char, index) => (
        <motion.span
          layout
          key={`morph-motion:${id ?? "default"}:text:index:${index}`}
          // key={`morph-motion:${id ?? "default"}:text:index:${index}:char:${char}`}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={variants.transition}
          className={cn("", className)}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
  </Fragment>
));

/**
 * @description Morph Motion
 */
const MorphMotion = {
  Container: MorphMotionContainer,
  Text: MorphMotionText,
};

export { MorphMotion };
