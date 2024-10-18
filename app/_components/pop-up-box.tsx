"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { MinusIcon, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export const PopUpBox = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [closed, setClosed] = React.useState(false);
  const pathname = usePathname();

  if (pathname !== "/") return;

  return (
    <div ref={ref} className="contents">
      <AnimatePresence mode="popLayout">
        {closed === false && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                delay: 5,
              },
            }}
            exit={{
              opacity: 0,
              y: "100%",
              transition: {
                delay: 0,
              },
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className={cn(
              "fixed bottom-3 right-3 z-50 flex h-fit w-[400px] flex-col rounded-xl border border-divider bg-white p-3 drop-shadow-md backdrop-blur-sm md:p-5",
              className
            )}
          >
            <div className="absolute right-3 top-3 cursor-pointer text-primary transition-all duration-200 ease-in-out hover:opacity-80 md:right-5 md:top-5">
              <div
                onClick={() => setClosed(true)}
                className="flex h-5 w-5 flex-col place-content-center items-center rounded-full bg-black"
              >
                <XIcon strokeWidth={2.5} className="h-4 w-4 text-white" />
              </div>
            </div>

            <div className="font-gt text-base font-500 text-black">
              Sign up for Royco Updates
            </div>
            <div className="mt-2 font-gt text-base font-300 leading-tight text-secondary">
              Get alerts for new updates to Royco, new Markets and more.
            </div>

            <iframe
              src="https://paragraph.xyz/@royco/embed?minimal=true"
              className="mt-5 h-12 w-full"
            ></iframe>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
