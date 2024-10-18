"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import {
  AcapitalLogo,
  AmberLogo,
  CoinbaseLogo,
  HashedLogo,
  NfxLogo,
  CoinbaseVenturesLogo,
} from "../assets";
import { motion } from "framer-motion";

const baseClasses = cn(
  "shrink-0 opacity-30 transition-all hover:opacity-[0.2] duration-200 ease-in-out cursor-pointer"
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
        <a
          href={logoLink ? logoLink : "/"}
          className="contents"
          target="_blank"
          rel="noopenner noreferrer"
        >
          {children}
        </a>
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
        "py-2 sm:py-3 lg:py-0",
        className
      )}
    >
      <div
        className={cn(
          "flex max-w-[20rem] flex-row flex-wrap place-content-center items-center sm:max-w-xl md:max-w-xl lg:max-w-none",
          "h-fit overflow-hidden lg:h-[7.12rem]",
          "space-x-3 sm:space-x-0"
        )}
      >
        <LogoWrapper logoIndex={0} logoLink="https://www.coinbase.com/">
          <CoinbaseVenturesLogo
            className={cn(
              "h-4 w-auto md:h-[1.3125rem] md:w-[14.5625rem]",
              baseClasses,
              "opacity-100 grayscale saturate-0 hover:opacity-70"
            )}
          />
        </LogoWrapper>

        <LogoWrapper logoIndex={1} logoLink="https://www.nfx.com/">
          <NfxLogo
            className={cn(
              "ml-2 h-14 w-auto sm:ml-[1.2rem] md:ml-[4rem] md:h-[4.92406rem] md:w-[5.1735rem]",

              baseClasses
            )}
          />
        </LogoWrapper>

        <LogoWrapper logoIndex={2} logoLink="https://www.hashed.com/">
          <HashedLogo
            className={cn(
              "-ml-2 mt-[0rem] h-[4rem] w-auto overflow-hidden md:ml-[2.6rem] md:h-[5.77594rem] md:w-[8.66388rem] lg:mt-0",

              baseClasses
            )}
          />
        </LogoWrapper>

        <LogoWrapper logoIndex={3} logoLink="https://acapital.com/">
          <AcapitalLogo
            className={cn(
              "-mt-[0.15rem] ml-[0.1rem] h-[2.1rem] w-auto md:ml-[2.55rem] md:h-[2.55738rem] md:w-[6.263rem] lg:mt-0",

              baseClasses
            )}
          />
        </LogoWrapper>

        <LogoWrapper logoIndex={4} logoLink="https://www.ambercapital.com/">
          <AmberLogo
            className={cn(
              "ml-5 mr-5 h-8 w-auto md:ml-[3.94rem] md:mr-0 md:h-[2.86681rem] md:w-[6.37744rem]",

              baseClasses
            )}
          />
        </LogoWrapper>
      </div>
    </div>
  );
});
