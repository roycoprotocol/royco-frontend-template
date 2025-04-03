"use client";

import React from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface CustomBadgeProps {
  label: string;
  icon?: string;
}

export const CustomBadge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CustomBadgeProps
>(({ className, label, icon, ...props }, ref) => {
  return (
    <div ref={ref} {...props} className={cn("", className)}>
      <Badge
        className={cn(
          "flex items-center gap-1 rounded-full border border-divider bg-white p-1 pr-2 text-secondary shadow-none",
          icon ? "pl-1" : "pl-2"
        )}
      >
        {icon && (
          <img
            src={icon}
            alt={label}
            width={16}
            height={16}
            className="rounded-full"
          />
        )}

        <span className="text-xs font-normal">{label}</span>
      </Badge>
    </div>
  );
});
