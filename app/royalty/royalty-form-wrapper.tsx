"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useJoin } from "@/store";
import { RoyaltyFormPopUp } from "@/components/join/royalty-form/royalty-form-pop-up";
import { SuccessScreen } from "@/components/join/success-screen";
import { isAuthEnabledAtom } from "@/store/global";
import { useAtomValue } from "jotai";
import { AlertIndicator } from "@/components/common";
import { AnimatePresence, motion } from "framer-motion";

export const RoyaltyFormWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { openRoyaltyForm, setOpenRoyaltyForm, step } = useJoin();
  const isAuthEnabled = useAtomValue(isAuthEnabledAtom);

  if (!openRoyaltyForm) {
    return null;
  }

  if (!isAuthEnabled) {
    return (
      <div
        onClick={(e) => {
          setOpenRoyaltyForm(false);
        }}
        ref={ref}
        className={cn(
          "absolute left-0 top-0 z-20 flex h-full w-full flex-col items-center bg-opacity-50 backdrop-blur-sm",
          className
        )}
        {...props}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="sticky left-0 top-24 z-30 flex max-h-[80vh] max-w-screen-sm flex-col items-center p-5 backdrop-blur-sm"
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              initial={{ opacity: 0.5, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                duration: 0.2,
                type: "easeOut",
              }}
              className="hide-scrollbar max-h-[80vh] max-w-md overflow-y-auto rounded-xl border border-divider bg-white p-5 shadow-md"
            >
              <AlertIndicator>
                Auth is disabled on this site. So you cannot join Royco Royalty
                from here.
              </AlertIndicator>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={(e) => {
        setOpenRoyaltyForm(false);
      }}
      ref={ref}
      className={cn(
        "absolute left-0 top-0 z-20 flex h-full w-full flex-col items-center bg-opacity-50 backdrop-blur-sm",
        className
      )}
      {...props}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="sticky left-0 top-24 z-30 flex max-h-[80vh] max-w-screen-sm flex-col items-center p-5 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0.5, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{
            duration: 0.2,
            type: "easeOut",
          }}
          className="hide-scrollbar max-h-[80vh] w-full overflow-y-auto rounded-xl border border-divider bg-white shadow-md"
        >
          {step === "info" && <RoyaltyFormPopUp />}
          {step === "success" && <SuccessScreen />}
        </motion.div>
      </div>
    </div>
  );
});

RoyaltyFormWrapper.displayName = "RoyaltyFormWrapper";
