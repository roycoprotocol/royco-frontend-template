import React from "react";
import { cn } from "@/lib/utils";

export const MaxWidthWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-fit w-full max-w-[83.625rem] flex-col items-start",
        className
      )}
      {...props}
    />
  );
});
