import React from "react";
import { cn } from "@/lib/utils";

interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  from?: string;
  middle?: string;
  to?: string;
  direction?: string;
  children: React.ReactNode;
}

export const GradientText: React.FC<GradientTextProps> = ({
  from = "#FFE1BE",
  middle = "#DE9F58",
  to = "#6C4315",
  direction = "to bottom",
  children,
  className,
  ...props
}) => (
  <span className={cn("relative inline-block", className)} {...props}>
    <span
      className="pointer-events-none absolute left-0 top-0 h-[60%] w-full overflow-hidden"
      style={{
        background: `linear-gradient(${direction}, ${from} 0%, ${middle} 8%, ${to} 100%)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        color: "transparent",
      }}
      aria-hidden="true"
    >
      {children}
    </span>
    <span style={{ color: to }}>{children}</span>
  </span>
);
