"use client";

import React from "react";
import { HTMLMotionProps, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import useMeasure from "react-use-measure";

const initial = { y: 20, opacity: 0 };
const animate = { y: 0, opacity: 1 };
const exit = {
  // y: -20,
  filter: "blur(4px)",
  opacity: 0,
  transition: {
    duration: 0.2,
    delay: 0,
    type: "spring",
    bounce: 0,
    ease: "easeInOut",
  },
};

export const MotionWrapper = React.forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div"> & {
    delay?: number;
    duration?: number;
    playAnimation?: boolean;
  }
>(
  (
    {
      children,
      className,
      delay = 0,
      duration = 0.2,
      playAnimation = true,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        // initial={{ y: 20, opacity: 0 }}
        // animate={{ y: 0, opacity: 1 }}
        // exit={{
        //   // y: -20,
        //   filter: "blur(4px)",
        //   opacity: 0,
        //   transition: {
        //     duration: duration,
        //     delay: 0,
        //     type: "spring",
        //     bounce: 0,
        //     ease: "easeInOut",
        //   },
        // }}
        // transition={{
        //   duration: duration,
        //   bounce: 0,
        //   ease: "easeInOut",
        //   delay: delay,
        // }}

        initial={playAnimation === true ? initial : animate}
        animate={playAnimation === true ? animate : animate} // Conditionally set animate state
        exit={playAnimation === true ? exit : animate} // Conditionally set exit state
        transition={{
          duration: duration,
          bounce: 0,
          ease: "easeInOut",
          delay: delay,
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
        className={cn("", className)}
        ref={ref}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

// export const MotionWrapper = ({
//   children,
//   className,
//   delay = 0,
// }: {
//   children: React.ReactNode;
//   className?: string;
//   delay?: number;
// }) => {
//   return (
//     <motion.div
//       initial={{ y: 20, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       exit={{
//         // y: -20,
//         filter: "blur(4px)",
//         opacity: 0,
//         transition: {
//           duration: 0.2,
//           delay: 0,
//           type: "spring",
//           bounce: 0,
//           ease: "easeInOut",
//         },
//       }}
//       transition={{
//         duration: 0.2,
//         bounce: 0,
//         ease: "easeInOut",
//         delay: delay,
//       }}
//       className={cn("", className)}
//     >
//       {children}
//     </motion.div>
//   );
// };
