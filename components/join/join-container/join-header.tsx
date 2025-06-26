"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useJoin } from "@/store";
import { Button } from "@/components/ui/button";

export const JoinHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { setOpenRoyaltyForm } = useJoin();

  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "flex w-full flex-col items-center justify-center px-5 py-16",
        className
      )}
    >
      <h3 className="flex flex-row items-center text-center font-gt text-3xl font-normal sm:text-[40px]">
        Join the Royalty.
      </h3>
      <div className="my-5 w-full max-w-[400px] text-center font-gt text-base font-light text-secondary">
        Get priority access & benefits based on your wallets. Connect more
        assets to get in first.
      </div>

      <Button
        onClick={() => {
          setOpenRoyaltyForm(true);
        }}
        className="h-12 w-full max-w-xs rounded-lg bg-mint font-inter text-sm font-normal shadow-none hover:bg-opacity-90"
      >
        Create Account
      </Button>

      <img
        className={cn("mt-10")}
        src="/join/partners.png"
        alt="Partners"
        width={180}
        height={20}
      />

      <div className="mt-3 w-full max-w-[409px] text-center font-gt text-sm font-light text-secondary">
        Join DCF God, Sam K, Smokey the Bera, and more.
      </div>
    </div>
  );
});
