"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LoadingIndicator } from "@/app/_components/common/loading-indicator";
import { useAtomValue } from "jotai";
import {
  loadableExploreMarketAtom,
  loadableExploreVaultAtom,
} from "@/store/explore/explore-market";

export const ExploreWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const { isLoading: isVaultLoading } = useAtomValue(loadableExploreVaultAtom);
  const { isLoading: isMarketLoading } = useAtomValue(
    loadableExploreMarketAtom
  );

  if (isVaultLoading || isMarketLoading) {
    return (
      <div className="w-full">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div ref={ref} className={cn(className)} {...props}>
      {children}
    </div>
  );
});
