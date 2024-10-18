"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const ContentBadge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex cursor-pointer flex-row items-center gap-1 rounded-full border border-divider px-[0.438rem] py-1 text-xs transition-all duration-200 ease-in-out hover:border-tertiary",
        className
      )}
      {...props}
    />
  );
});
