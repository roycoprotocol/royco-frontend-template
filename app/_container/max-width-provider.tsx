"use client";

import { cn } from "@/lib/utils";
import React from "react";

export const MaxWidthProvider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div ref={ref} {...props} className={cn("px-3 md:px-12", className)}>
      <div className="mx-auto max-w-[1600px]">{children}</div>
    </div>
  );
});
