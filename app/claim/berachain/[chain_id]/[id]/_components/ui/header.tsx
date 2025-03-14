import React from "react";
import { cn } from "@/lib/utils";

export const Header = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={cn("flex w-full flex-col items-center ", className)}
    >
      <h1 className="font-morion text-4xl font-bold">Berachain Claims</h1>

      <p className="mt-5 max-w-lg text-center font-gt text-base text-secondary">
        Claim all eligible BERA incentives across your Boyco positions.
      </p>
    </div>
  );
});
