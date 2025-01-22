import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const formatYieldValue = (value: string): string => {
  if (!value || isNaN(Number(value))) {
    value = "0";
  }

  const numValue = Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  }).format(parseFloat(value) / 100);

  return parseFloat(value) < 0 ? `${numValue}` : `+${numValue}`;
};

export const InputYieldSelector = React.forwardRef<
  HTMLInputElement,
  React.HTMLAttributes<HTMLDivElement> & {
    currentValue: string;
    setCurrentValue: (value: string) => void;
    containerClassName?: string;
    Prefix?: React.FC;
    Suffix?: React.FC;
    disabled?: boolean;
  }
>(
  (
    {
      className,
      currentValue,
      setCurrentValue,
      containerClassName,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);

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
        placeholder="Yield"
        value={isFocused ? currentValue : formatYieldValue(currentValue)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => {
          const rawValue = e.target.value.replace(/[%+\s]/g, "");
          if (rawValue === "") {
            setCurrentValue("");
            return;
          }
          setCurrentValue(e.target.value);
        }}
        {...props}
      />
    );
  }
);
