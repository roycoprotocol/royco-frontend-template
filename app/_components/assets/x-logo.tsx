import { cn } from "@/lib/utils";
import React from "react";

export const XLogo = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="55"
      height="55"
      viewBox="0 0 55 55"
      fill="none"
      className={cn("", className)}
    >
      <g clipPath="url(#clip0_2107_26402)">
        <path
          d="M32.2071 23.5187L52.3131 0.650879H47.5503L30.0849 20.5027L16.1457 0.650879H0.0644531L21.1479 30.6732L0.0644531 54.6507H4.82725L23.2593 33.682L37.9833 54.6507H54.0645M6.54625 4.16514H13.8633L47.5467 51.3091H40.2279"
          fill="#D4D4D4"
        />
      </g>
      <defs>
        <clipPath id="clip0_2107_26402">
          <rect
            width="54"
            height="54"
            fill="white"
            transform="translate(0.0644531 0.650879)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};
