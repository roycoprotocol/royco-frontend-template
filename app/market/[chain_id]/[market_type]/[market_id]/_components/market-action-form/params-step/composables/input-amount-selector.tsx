import React from "react";
import { cn } from "@/lib/utils";
import { parseFormattedValueToText } from "@/sdk/utils";
import { parseTextToFormattedValue } from "@/sdk/utils";
import { Input } from "@/components/ui/input";

export const InputAmountSelector = React.forwardRef<
  HTMLInputElement,
  React.HTMLAttributes<HTMLDivElement> & {
    currentValue: string;
    setCurrentValue: (value: string) => void;
    containerClassName?: string;
    Prefix?: React.FC;
    Suffix?: React.FC;
  }
>(
  (
    { className, currentValue, setCurrentValue, containerClassName, ...props },
    ref
  ) => {
    return (
      <Input
        ref={ref}
        type="text"
        containerClassName={cn(
          "h-9 text-sm bg-white rounded-lg grow",
          containerClassName
        )}
        className={cn("", className)}
        placeholder="Enter Amount"
        value={parseTextToFormattedValue(currentValue)}
        onChange={(e) => {
          setCurrentValue(parseFormattedValueToText(e.target.value));
        }}
        {...props}
      />
    );
  }
);
