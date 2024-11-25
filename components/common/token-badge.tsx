import { cn } from "@/lib/utils";
import React from "react";
import { detect } from "detect-browser";

type Token = {
  image?: string;
  symbol: string;
};

interface TokenBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  token: Token;
  onClick?: () => void;
}

export const TokenBadge = React.forwardRef<HTMLDivElement, TokenBadgeProps>(
  ({ className, onClick, token }, ref) => {
    const browser = detect();

    return (
      <button
        className={cn(
          "flex cursor-pointer flex-row items-center gap-[0.375rem] rounded-full border border-divider py-1 transition-all duration-200 ease-in-out hover:border-tertiary hover:text-black",
          "px-[0.438rem]",
          className
        )}
        onClick={onClick}
      >
        {token.image && (
          <img
            src={token.image}
            alt={`Logo of ${token.symbol} token`}
            className="h-5 w-5 rounded-full"
          />
        )}

        <div
          className={cn(
            "body-2 flex items-center text-primary",
            "h-5"
            // browser &&
            //   (browser.name === "safari" || browser.name === "ios-webview")
            //   ? ""
            //   : "h-5"
          )}
        >
          {/* <span className="mt-px flex">{token.symbol}</span> */}

          {token.symbol}
        </div>
      </button>
    );
  }
);
