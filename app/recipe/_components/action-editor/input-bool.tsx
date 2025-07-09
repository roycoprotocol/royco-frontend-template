"use client";

import React from "react";
import { ArrowLeftRightIcon } from "lucide-react";

export const InputBool = React.forwardRef<
  HTMLInputElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: string;
    onChange: (value: string) => void;
  }
>(({ value, onChange, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className="flex h-6 w-96 shrink-0 cursor-pointer flex-row items-center justify-between bg-_surface_tertiary px-2 text-_primary_ transition-all duration-200 ease-in-out hover:bg-_surface_tertiary/80"
      onClick={() => {
        onChange(value === "true" ? "false" : "true");
      }}
    >
      {value === "true" ? "true" : "false"}

      <ArrowLeftRightIcon
        strokeWidth={1}
        className="h-4 w-4 text-_secondary_"
      />
    </div>
  );
});
