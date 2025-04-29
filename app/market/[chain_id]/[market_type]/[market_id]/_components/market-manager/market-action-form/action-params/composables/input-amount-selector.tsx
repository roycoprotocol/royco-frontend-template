import React from "react";
import { cn } from "@/lib/utils";
import { parseFormattedValueToText } from "royco/utils";
import { parseTextToFormattedValue } from "royco/utils";
import { Input } from "@/components/ui/input";

export const InputAmountSelector = React.forwardRef<
  HTMLInputElement,
  React.HTMLAttributes<HTMLDivElement> & {
    currentValue: string;
    setCurrentValue: (value: string) => void;
    containerClassName?: string;
    Prefix?: React.FC;
    Suffix?: React.FC;
    disabled?: boolean;
    placeholder?: string;
  }
>(
  (
    {
      className,
      currentValue,
      setCurrentValue,
      containerClassName,
      disabled,
      placeholder = "Amount",
      ...props
    },
    ref
  ) => {
    return (
      <Input
        ref={ref}
        type="text"
        disabled={disabled}
        containerClassName={cn(
          "h-9 text-sm bg-white rounded-lg grow",
          containerClassName
        )}
        className={cn("", className)}
        placeholder={placeholder}
        value={parseTextToFormattedValue(currentValue)}
        onChange={(e) => {
          setCurrentValue(parseFormattedValueToText(e.target.value));
        }}
        {...props}
      />
    );
  }
);
