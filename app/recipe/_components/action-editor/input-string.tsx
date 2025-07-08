"use client";

import React from "react";
import { Input } from "@/components/ui/input";

// Custom string validation function that allows all valid Solidity string characters
const isValidString = (value: string): boolean => {
  if (value === "") return true;
  // Allow all printable characters and common whitespace
  // This includes all UTF-8 characters except control characters (0x00-0x1F, 0x7F)
  return /^[\x20-\x7E\xA0-\uFFFF]*$/.test(value);
};

export const InputString = React.forwardRef<
  HTMLInputElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: string;
    onChange: (value: string) => void;
  }
>(({ value, onChange, ...props }, ref) => {
  return (
    <Input
      {...props}
      ref={ref}
      newHeight="h-6"
      placeholder="Hello, World!"
      containerClassName="w-full rounded-none bg-_surface_ border-_divider_ text-xs bg-_surface_tertiary px-0 border-none w-96"
      className="px-2"
      value={value}
      onChange={(e) => {
        if (isValidString(e.target.value)) {
          onChange(e.target.value);
        }
      }}
    />
  );
});
