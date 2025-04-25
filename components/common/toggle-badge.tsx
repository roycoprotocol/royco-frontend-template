import React from "react";
import { cn } from "@/lib/utils";
import { TokenQuote } from "royco/api";
import { TokenDisplayer } from "./token-displayer";

export const ToggleBadge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    tokens?: {
      id: string | number;
      image: string;
      symbol: string;
    }[];
  }
>(({ className, tokens, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex cursor-pointer flex-row items-center gap-2 rounded-full border border-divider px-[0.438rem] py-1 font-light text-primary transition-all duration-200 ease-in-out hover:border-tertiary hover:text-black",
        className
      )}
      {...props}
    >
      {tokens && tokens.length > 0 && (
        <TokenDisplayer tokens={tokens} symbols={true} />
      )}
      {children}
    </div>
  );
});
