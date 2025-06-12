"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { JoinHeader } from "./join-header";
import { LeaderboardStats } from "../leaderboard-stats";
import { LeaderboardManager } from "../leaderboard-table";

export const JoinContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "w-full max-w-4xl overflow-hidden rounded-2xl border border-divider bg-white",
        className
      )}
    >
      <JoinHeader />

      <LeaderboardStats />

      <LeaderboardManager className="w-full border-t border-divider" />
    </div>
  );
});
