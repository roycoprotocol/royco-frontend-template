"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import {
  AcapitalLogo,
  AmberLogo,
  HashedLogo,
  NfxLogo,
  CoinbaseVenturesLogo,
} from "../assets";

const baseClasses = cn(
  "shrink-0 opacity-30 transition-all duration-200 ease-in-out"
);

const LogoWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    logoIndex: number;
    logoLink?: string;
  }
>(({ children, logoLink, className, logoIndex, ...props }, ref) => {
  return (
    <div ref={ref}>
      <div
        className={cn(
          "flex h-fit w-fit flex-col place-content-center items-center",
          "h-10 overflow-hidden md:h-12",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
});

export const Funding = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    offset?: number;
  }
>(({ className, offset = 0, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-row flex-wrap place-content-center items-center overflow-hidden bg-white",
        "py-1 sm:py-2 lg:py-0",
        className
      )}
    >
      <div
        className={cn(
          "flex max-w-none flex-row flex-nowrap place-content-center items-center",
          "h-[2rem] overflow-hidden sm:h-fit lg:h-[7.12rem]",
          "w-full justify-between px-5 md:px-12 lg:px-[10.44rem] xl:px-[12.44rem]",
          "xl:w-full xl:max-w-[108.505rem] xl:justify-between"
        )}
      >
        <LogoWrapper logoIndex={0} logoLink="https://www.coinbase.com/">
          <CoinbaseVenturesLogo
            className={cn(
              "h-[0.7rem] w-auto sm:h-[1rem] lg:h-[1.3125rem] lg:w-[14.5625rem]",
              baseClasses,
              "opacity-100 grayscale saturate-0"
            )}
          />
        </LogoWrapper>

        <LogoWrapper logoIndex={1} logoLink="https://www.nfx.com/">
          <NfxLogo
            className={cn(
              "ml-0 h-[2rem] w-auto sm:ml-[1.2rem] sm:h-[3.1rem] lg:h-[4.92406rem] lg:w-[5.1735rem] xl:ml-[4rem]",
              baseClasses
            )}
          />
        </LogoWrapper>

        <LogoWrapper logoIndex={2} logoLink="https://www.hashed.com/">
          <HashedLogo
            className={cn(
              "-ml-2 mt-[0.05rem] h-[2.8rem] w-auto overflow-hidden sm:ml-1 sm:h-[3.6rem] md:mt-[0.15rem] lg:h-[5.77594rem] lg:w-[8.66388rem] xl:ml-[2.6rem]",
              baseClasses
            )}
          />
        </LogoWrapper>

        <LogoWrapper
          logoIndex={3}
          logoLink="https://acapital.com/"
          className="-ml-1 sm:ml-0"
        >
          <AcapitalLogo
            className={cn(
              "-mt-[0.1rem] h-[1.55rem] w-auto sm:h-[2.1rem] lg:mt-0 lg:h-[2.65738rem] xl:ml-[2.55rem]",
              baseClasses
            )}
          />
        </LogoWrapper>

        <LogoWrapper logoIndex={4} logoLink="https://www.ambercapital.com/">
          <AmberLogo
            className={cn(
              "ml-1 h-[1.45rem] w-auto sm:ml-[0.8rem] sm:h-[2rem] lg:h-[2.96681rem] xl:ml-[3.94rem] ",
              baseClasses
            )}
          />
        </LogoWrapper>
      </div>
    </div>
  );
});
