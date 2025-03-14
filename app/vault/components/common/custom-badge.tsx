"use client";

import React from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface CustomBadgeProps {
  label: string;
  icon?: React.ReactNode;
}

export const CustomBadge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CustomBadgeProps
>(({ className, label, icon, ...props }, ref) => {
  return (
    <div ref={ref} {...props} className={cn("", className)}>
      <Badge className="flex items-center gap-2 rounded-full border-none bg-z2 text-primary shadow-none">
        {icon && icon}
        <span className="text-sm font-normal">{label}</span>
      </Badge>
    </div>
  );
});
