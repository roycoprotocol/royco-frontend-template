"use client";

import React, { Fragment, useRef } from "react";
import ReactDOM from "react-dom";
import { createPortal } from "react-dom";
import { detect } from "detect-browser";

import { motion } from "framer-motion";

/**
 * @description Imports for styling
 */
import { cn } from "@/lib/utils";

/**
 * @description Toolip imports
 */
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGeneralStats } from "@/store";
import { SparklesIcon } from "lucide-react";
import { getSupportedToken } from "royco/constants";

/**
 * @description Props for Token Displayer
 */
type TokenDisplayerProps = {
  tokens: Array<{
    id: string | number;
    symbol: string;
    image: string;
    name?: string;
    type?: "token" | "point" | "lp";
  }>;
  symbols: boolean;
  hover?: boolean;
  bounce?: boolean;
  name?: boolean;
  imageClassName?: string;
  symbolClassName?: string;
  size?: number;
};

/**
 * @description Token Displayer
 */
const TokenDisplayer = React.forwardRef<
  HTMLDivElement,
  TokenDisplayerProps & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      className,
      imageClassName,
      symbolClassName,
      size = 5,
      hover = false,
      bounce = false,
      name = false,
      tokens,
      symbols,
      ...props
    },
    ref
  ) => {
    const { browserType } = useGeneralStats();

    return (
      <div
        ref={ref}
        className={cn(
          "flex shrink-0 flex-row items-center gap-1 text-black",
          className
        )}
        {...props}
      >
        <div className="flex shrink-0 flex-row items-center">
          {tokens.map((token, index) => (
            <div className="contents" key={`token:${token.id}:info`}>
              <Tooltip>
                {hover ? (
                  <TooltipTrigger asChild className={cn("cursor-pointer")}>
                    <div className="contents">
                      {typeof token.id === "string" &&
                      getSupportedToken(token.id).type === "lp" ? (
                        <Fragment>
                          <motion.img
                            key={`token:${token.id}:image:token0`}
                            src={
                              getSupportedToken(
                                getSupportedToken(token.id).token0
                              ).image
                            }
                            alt={token.symbol}
                            className={cn(
                              "shrink-0 rounded-full bg-z2 transition-transform",
                              index !== 0 && "-ml-1",
                              size === 6 && "h-6 w-6",
                              size === 5 && "h-5 w-5",
                              size === 4 && "h-4 w-4",
                              imageClassName
                            )}
                            whileHover={{ y: bounce ? -6 : 0 }}
                            initial={{ y: 0 }}
                            id={`token-${index}`}
                            transition={{
                              duration: 0.05,
                              ease: "easeInOut",
                              bounce: 0,
                              type: "spring",
                            }}
                          />

                          <motion.img
                            key={`token:${token.id}:image:token1`}
                            src={
                              getSupportedToken(
                                getSupportedToken(token.id).token1
                              ).image
                            }
                            alt={token.symbol}
                            className={cn(
                              "shrink-0 rounded-full bg-z2 transition-transform",
                              "-ml-2",
                              size === 6 && "h-6 w-6",
                              size === 5 && "h-5 w-5",
                              size === 4 && "h-4 w-4",
                              imageClassName
                            )}
                            whileHover={{ y: bounce ? -6 : 0 }}
                            initial={{ y: 0 }}
                            id={`token-${index}`}
                            transition={{
                              duration: 0.05,
                              ease: "easeInOut",
                              bounce: 0,
                              type: "spring",
                            }}
                          />
                        </Fragment>
                      ) : (
                        <motion.img
                          key={`token:${token.id}:image`}
                          src={token.image}
                          alt={token.symbol}
                          className={cn(
                            "shrink-0 rounded-full bg-z2 transition-transform",
                            index !== 0 && "-ml-1",
                            size === 6 && "h-6 w-6",
                            size === 5 && "h-5 w-5",
                            size === 4 && "h-4 w-4",
                            imageClassName
                          )}
                          whileHover={{ y: bounce ? -6 : 0 }}
                          initial={{ y: 0 }}
                          id={`token-${index}`}
                          transition={{
                            duration: 0.05,
                            ease: "easeInOut",
                            bounce: 0,
                            type: "spring",
                          }}
                        />
                      )}
                    </div>
                  </TooltipTrigger>
                ) : (
                  <div className="contents">
                    {typeof token.id === "string" &&
                    getSupportedToken(token.id).type === "lp" ? (
                      <Fragment>
                        <motion.img
                          key={`token:${token.id}:image:token0`}
                          src={
                            getSupportedToken(
                              getSupportedToken(token.id).token0
                            ).image
                          }
                          alt={token.symbol}
                          className={cn(
                            "shrink-0 rounded-full bg-z2 transition-transform",
                            index !== 0 && "-ml-1",
                            size === 6 && "h-6 w-6",
                            size === 5 && "h-5 w-5",
                            size === 4 && "h-4 w-4",
                            imageClassName
                          )}
                          whileHover={{ y: bounce ? -6 : 0 }}
                          initial={{ y: 0 }}
                          id={`token-${index}`}
                          transition={{
                            duration: 0.05,
                            ease: "easeInOut",
                            bounce: 0,
                            type: "spring",
                          }}
                        />

                        <motion.img
                          key={`token:${token.id}:image:token1`}
                          src={
                            getSupportedToken(
                              getSupportedToken(token.id).token1
                            ).image
                          }
                          alt={token.symbol}
                          className={cn(
                            "shrink-0 rounded-full bg-z2 transition-transform",
                            "-ml-2",
                            size === 6 && "h-6 w-6",
                            size === 5 && "h-5 w-5",
                            size === 4 && "h-4 w-4",
                            imageClassName
                          )}
                          whileHover={{ y: bounce ? -6 : 0 }}
                          initial={{ y: 0 }}
                          id={`token-${index}`}
                          transition={{
                            duration: 0.05,
                            ease: "easeInOut",
                            bounce: 0,
                            type: "spring",
                          }}
                        />
                      </Fragment>
                    ) : (
                      <motion.img
                        key={`token:${token.id}:image`}
                        src={token.image}
                        alt={token.symbol}
                        className={cn(
                          "shrink-0 rounded-full bg-z2 transition-transform",
                          index !== 0 && "-ml-1",
                          size === 6 && "h-6 w-6",
                          size === 5 && "h-5 w-5",
                          size === 4 && "h-4 w-4",
                          imageClassName
                        )}
                        whileHover={{ y: bounce ? -6 : 0 }}
                        initial={{ y: 0 }}
                        id={`token-${index}`}
                        transition={{
                          duration: 0.05,
                          ease: "easeInOut",
                          bounce: 0,
                          type: "spring",
                        }}
                      />
                    )}
                  </div>
                )}

                {typeof window !== "undefined" &&
                  createPortal(
                    <TooltipContent
                      className={cn(
                        "z-50 -mt-2 bg-white",
                        hover !== true &&
                          "pointer-events-none flex flex-col items-center justify-center opacity-0",
                        // browserType !== "webkit" && "h-9",
                        // size === 4 && "h-8",
                        size === 4 && "text-sm"
                      )}
                    >
                      {/**
                       * @TODO Test remaining for font centering
                       */}
                      {/* <span className="">{token.symbol.toUpperCase()}</span> */}
                      {/* <div>{token.symbol}</div> */}
                      {[
                        token.symbol,
                        // token.type === "point" && "Points"
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    </TooltipContent>,
                    document.body
                  )}
              </Tooltip>
            </div>
          ))}
        </div>

        <div
          className={cn(
            "font-gt font-300 ",
            "flex flex-col items-center",
            // browserType === "webkit" && "h-fit",
            size === 6 && "text-base",
            size === 5 && "text-base",
            size === 4 && "text-sm",
            symbolClassName
          )}
        >
          {/* {symbols && tokens.length >= 1 && (
            <span
              className={cn(
                size === 5 && "leading-5",
                size === 4 && "leading-4"
              )}
            >
              {tokens[0].symbol.toUpperCase()}
              {tokens.length > 1 && ` +${tokens.length - 1} more`}
            </span>
          )} */}

          {/* <span
            className={cn(
              "",
              size === 5 && "leading-6", // leading-6 aligns properly
              size === 4 && "leading-5" // leading-5 aligns properly
            )}
          >
            {symbols && tokens.length >= 1 && (
              <Fragment>
                {name === true ? tokens[0].name : tokens[0].symbol}
                {tokens.length > 1 && ` +${tokens.length - 1} more`}
              </Fragment>
            )}
          </span> */}

          {symbols && tokens.length >= 1 && (
            <Fragment>
              {name === true
                ? tokens[0].name
                : [
                    tokens[0].symbol,
                    // tokens[0].type === "point" && "Points"
                  ]
                    .filter(Boolean)
                    .join(" ")}
              {tokens.length > 1 && ` +${tokens.length - 1} more`}
            </Fragment>
          )}
        </div>
      </div>
    );
  }
);
TokenDisplayer.displayName = "TokenDisplayer";

export { TokenDisplayer };
