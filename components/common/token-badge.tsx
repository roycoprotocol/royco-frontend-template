import { cn } from "@/lib/utils";
import React, { Fragment } from "react";
import { detect } from "detect-browser";
import { TokenDisplayer } from "./token-displayer";
import { getSupportedToken } from "royco/constants";

type Token = {
  id?: string;
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
        {!!token.image && !!token.id && typeof token.id === "string" && (
          <Fragment>
            {getSupportedToken(token.id).type === "lp" ? (
              <Fragment>
                <img
                  key={`token:${token.id}:image:token0`}
                  src={
                    getSupportedToken(getSupportedToken(token.id).token0).image
                  }
                  alt={token.symbol}
                  className={cn(
                    "h-5 w-5 shrink-0 rounded-full bg-z2 transition-transform"
                  )}
                />

                <img
                  key={`token:${token.id}:image:token1`}
                  src={
                    getSupportedToken(getSupportedToken(token.id).token1).image
                  }
                  alt={token.symbol}
                  className={cn(
                    "h-5 w-5 shrink-0 rounded-full bg-z2 transition-transform",
                    "-ml-3"
                  )}
                />
              </Fragment>
            ) : (
              <img
                key={`token:${token.id}:image:token1`}
                src={token.image}
                alt={token.symbol}
                className={cn(
                  "h-5 w-5 shrink-0 rounded-full bg-z2 transition-transform"
                )}
              />
            )}
          </Fragment>
        )}

        {token.image && typeof token.id !== "string" && (
          <img
            key={`token:${token.id}:image:token1`}
            src={token.image}
            alt={token.symbol}
            className={cn(
              "h-5 w-5 shrink-0 rounded-full bg-z2 transition-transform"
            )}
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
