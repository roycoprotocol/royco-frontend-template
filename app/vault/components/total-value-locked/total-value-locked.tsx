import { cn } from "@/lib/utils";
import formatNumber from "@/utils/numbers";
import React from "react";

export const TotalValueLocked = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  // TODO: Implement Hook
  const total_tvl = 1000000;
  const fill_tvl = 754239.23;

  const fill_tvl_percentage = (fill_tvl / total_tvl) * 100;

  return (
    <div
      ref={ref}
      {...props}
      className={cn("relative h-10 w-full rounded-xl", className)}
    >
      <div className="absolute left-0 flex h-full w-full items-center justify-end rounded-xl bg-gray-200 px-5">
        <span className="text-secondary">
          {formatNumber(
            total_tvl,
            { type: "currency" },
            {
              average: false,
              autoForceAverage: false,
            }
          ) + " cap"}
        </span>
      </div>

      <div
        className="absolute left-0 flex h-full items-center justify-end rounded-l-xl bg-white px-5"
        style={{ width: `${fill_tvl_percentage}%` }}
      >
        <span className="text-secondary">
          {formatNumber(
            fill_tvl,
            { type: "currency" },
            {
              average: false,
              autoForceAverage: false,
            }
          )}
        </span>
      </div>
    </div>
  );
});
