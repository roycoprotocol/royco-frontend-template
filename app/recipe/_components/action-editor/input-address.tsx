"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { isAlphanumeric } from "validator";

export const InputAddress = React.forwardRef<
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
      placeholder="0x2a6342efa91704151ba9a2c1be9a9fb0284044e2"
      containerClassName="w-full rounded-none bg-_surface_ border-_divider_ text-xs bg-_surface_tertiary px-0 border-none w-96"
      className="px-2"
      value={value}
      onChange={(e) => {
        if (isAlphanumeric(e.target.value)) {
          onChange(e.target.value.toLowerCase());
        } else if (e.target.value === "") {
          onChange("");
        }
      }}
    />
  );
});
