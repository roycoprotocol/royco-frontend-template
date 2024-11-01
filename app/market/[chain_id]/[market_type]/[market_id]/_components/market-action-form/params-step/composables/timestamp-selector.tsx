import React from "react";
import { cn } from "@/lib/utils";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { SecondaryLabel } from "../../../composables";

export const TimestampLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <SecondaryLabel
      ref={ref}
      className={cn(
        "flex h-9 w-14 flex-col place-content-center items-center rounded-lg border border-divider bg-z2 text-sm font-light text-secondary",
        className
      )}
    >
      <div className="flex h-5">
        <span className="leading-6">{props.children}</span>
      </div>
    </SecondaryLabel>
  );
});

export const TimestampSelector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    currentValue: Date | undefined;
    setCurrentValue: (date: Date | undefined) => void;
  }
>(({ className, currentValue, setCurrentValue, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex grow flex-row items-center gap-1", className)}
      {...props}
    >
      <DateTimePicker
        className="text-sm font-300 text-black"
        date={currentValue}
        setDate={(date: Date | undefined) => {
          setCurrentValue(date);
        }}
      />
    </div>
  );
});
