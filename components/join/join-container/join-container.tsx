"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Cta } from "./cta";
import { LeaderboardStats } from "../leaderboard-stats";

export const JoinContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "w-full max-w-4xl rounded-2xl border border-divider bg-white",
        className
      )}
    >
      <Cta />

      <LeaderboardStats />
    </div>
  );
});
