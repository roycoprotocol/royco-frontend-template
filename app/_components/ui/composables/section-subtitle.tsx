import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const SectionSubtitle = React.forwardRef<
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
        //   scale: 0.9,
        // }}
        // transition={{
        //   duration: 0.4,
        //   delay: 0.2,
        //   type: "spring",
        //   ease: "easeInOut",
        // }}
        className={cn(
          "mt-4 text-left text-black/60",
          "text-base font-light md:text-lg lg:text-xl",
          // "text-base font-light md:text-lg lg:text-xl",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
});
