import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const SectionTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className="contents">
      <div // @was motion.div
        // whileInView={{
        //   opacity: 1,
        //   y: 0,
        //   scale: 1,
        // }}
        // viewport={{
        //   once: true,
        // }}
        // initial={{
        //   opacity: 0,
        //   y: 20,
        //   scale: 0.95,
        // }}
        // transition={{
        //   duration: 0.4,
        //   type: "spring",
        //   ease: "easeInOut",
        // }}
        className={cn(
          "flex w-full flex-col text-left text-2xl font-light md:text-3xl lg:text-4xl",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
});
