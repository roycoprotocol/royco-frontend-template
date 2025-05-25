"use client";

import React from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getSupportedToken } from "royco/constants";
import { getSupportedChain } from "royco/utils";

type TokenProps = {
  id: string;
  symbol: string;
  image: string;
  chainId?: number;
  name?: string;
  type?: "token" | "point" | "lp";
};

interface TokenDisplayerProps extends React.HTMLAttributes<HTMLDivElement> {
  tokens: TokenProps[];
  size?: 4 | 5 | 6;
  imageClassName?: string;
  symbolClassName?: string;
  showSymbol?: boolean;
  showName?: boolean;
  showHover?: boolean;
  showBounce?: boolean;
  showChain?: boolean;
}

const bounceAnimationVariants = {
  initial: { y: 0 },
  hover: { y: -6 },
  default: { y: 0 },
};
const bounceAnimationTransition = {
  duration: 0.05,
  ease: "easeInOut",
  bounce: 0,
  type: "spring",
};

const getTokenImageSize = (size: number) => {
  if (size === 6) return "h-6 w-6";
  if (size === 5) return "h-5 w-5";
  if (size === 4) return "h-4 w-4";
  return "h-5 w-5";
};

const getChainImageSize = (size: number) => {
  if (size === 6) return "h-3 w-3";
  if (size === 5) return "h-2 w-2";
  if (size === 4) return "h-2 w-2";
  return "h-2 w-2";
};

const getTokenTextSize = (size: number) => {
  if (size === 6) return "text-base";
  if (size === 5) return "text-base";
  if (size === 4) return "text-sm";
  return "text-base";
};

export const TokenDisplayer = React.forwardRef<
  HTMLDivElement,
  TokenDisplayerProps
>(
  (
    {
      className,
      tokens,
      size = 5,
      imageClassName,
      symbolClassName,
      showSymbol = true,
      showName = false,
      showHover = false,
      showBounce = false,
      showChain = false,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("flex shrink-0 items-center gap-1", className)}
        {...props}
      >
        <div className="flex shrink-0 items-center">
          {tokens.map((item, index) => {
            const token = getSupportedToken(item.id);
            const chain = getSupportedChain(item.chainId);

            return (
              <Tooltip key={index}>
                <TooltipTrigger className={cn(index !== 0 && "-ml-1")}>
                  {token.type === "lp" ? (
                    <div className="relative">
                      <div className="flex items-center">
                        <motion.img
                          src={getSupportedToken(token.token0).image}
                          alt={token.symbol}
                          className={cn(
                            "shrink-0 rounded-full bg-z2 transition-transform",
                            getTokenImageSize(size),
                            imageClassName
                          )}
                          variants={bounceAnimationVariants}
                          initial="initial"
                          whileHover={showBounce ? "hover" : "default"}
                          transition={bounceAnimationTransition}
                        />

                        <motion.img
                          src={getSupportedToken(token.token1).image}
                          alt={token.symbol}
                          className={cn(
                            "shrink-0 rounded-full bg-z2 transition-transform",
                            "-ml-2",
                            getTokenImageSize(size),
                            imageClassName
                          )}
                          variants={bounceAnimationVariants}
                          initial="initial"
                          whileHover={showBounce ? "hover" : "default"}
                          transition={bounceAnimationTransition}
                        />
                      </div>

                      {showChain && chain && (
                        <img
                          src={chain.image}
                          alt={chain.name}
                          className={cn(
                            "absolute -right-[2px] bottom-0 rounded-full border border-_surface_ bg-_surface_",
                            getChainImageSize(size)
                          )}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="relative">
                      <motion.img
                        key={`token:${token.id}:image`}
                        src={token.image}
                        alt={token.symbol}
                        className={cn(
                          "shrink-0 rounded-full transition-transform",
                          getTokenImageSize(size),
                          imageClassName
                        )}
                        variants={bounceAnimationVariants}
                        initial="initial"
                        whileHover={showBounce ? "hover" : "default"}
                        transition={bounceAnimationTransition}
                      />

                      {showChain && chain && (
                        <img
                          src={chain.image}
                          alt={chain.name}
                          className={cn(
                            "absolute -right-[2px] bottom-0 rounded-full border border-_surface_ bg-_surface_",
                            getChainImageSize(size)
                          )}
                        />
                      )}
                    </div>
                  )}
                </TooltipTrigger>

                {typeof window !== "undefined" &&
                  showHover &&
                  createPortal(
                    <TooltipContent
                      className={cn(
                        "max-w-[320px] rounded-sm border border-_divider_ bg-_surface_ p-2 shadow-none",
                        getTokenTextSize(size)
                      )}
                    >
                      {token.symbol}
                    </TooltipContent>,
                    document.body
                  )}
              </Tooltip>
            );
          })}
        </div>

        {(showSymbol || showName) && (
          <div className={cn("", getTokenTextSize(size), symbolClassName)}>
            {showName ? tokens[0].name : tokens[0].symbol}
            {tokens.length > 1 && ` +${tokens.length - 1} more`}
          </div>
        )}
      </div>
    );
  }
);
