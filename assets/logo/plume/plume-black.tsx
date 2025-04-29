import React from "react";
import { cn } from "@/lib/utils";

export const PlumeBlackLogo = ({ className }: { className?: string }) => {
  return (
    <svg
      width="256"
      height="256"
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("", className)}
    >
      <path
        d="M182.919 81.4156V173.301L146.849 136.931V45.0456L182.919 81.4156Z"
        fill="black"
      />
      <path
        d="M82.3578 182.864H173.439L137.387 146.475H46.306L82.3578 182.864Z"
        fill="black"
      />
      <path
        d="M234.185 234.903V133.134L198.115 96.7639V198.533L97.5723 198.193L133.624 234.582L234.166 234.922"
        fill="black"
      />
      <path
        d="M8.81911e-06 0.0186854L0 101.788L36.0703 138.158L36.0703 36.3886L136.613 36.7283L100.561 0.339693L0.0191995 0"
        fill="black"
      />
      <path
        d="M243.722 254.23L223.257 233.586L233.197 223.558L253.661 244.203L256 256L243.722 254.23Z"
        fill="black"
      />
    </svg>
  );
};
