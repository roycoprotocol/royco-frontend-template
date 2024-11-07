"use client";

import React from "react";
import "./header.css";
import { cn } from "@/lib/utils";

import { motion, useScroll, useTransform } from "framer-motion";
import { FadeInMotionWrapper, GetUpdatesStrip } from "./composables";
import { MaxWidthWrapper } from "./composables/max-width-wrapper";
import { Button } from "../../../components/ui/button";

export const Header = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { scrollYProgress } = useScroll();

  const scaleBanner = useTransform(scrollYProgress, [0, 1], [1, 1]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-fit w-full flex-col items-center",
        "max-h-[500px] sm:h-[76vh] md:max-h-[600px] lg:h-fit lg:max-h-none",
        className
      )}
      {...props}
    >
      {/**
       * @description Absolute background
       */}
      <div className="pointer-events-none absolute -top-[4.77rem] -z-10 h-full w-full bg-fungard"></div>
      <div className="absolute bottom-0 -z-20 h-full w-full bg-lily"></div>

      {/**
       * @description Title
       */}
      <div
        className={cn(
          "header-title mt-[5.88rem] flex flex-col text-center font-gt",
          "text-[1.75rem]",
          "sm:text-3xl",
          "md:text-5xl",
          "lg:text-6xl"
        )}
      >
        <div className="max-w-[400px] px-3 font-normal sm:max-w-none sm:px-5">
          The Incentivized Action
        </div>
        <div className="font-normal xl:pt-[0.65rem]">Market Protocol</div>
      </div>

      {/**
       * @description Subtitle
       */}
      <div
        className={cn(
          "header-subtitle mt-[0.7rem] text-center font-gt sm:mt-[0.56rem] lg:mt-[1.2rem]",
          "w-full px-12",
          "sm:max-w-none sm:px-0"
        )}
      >
        <div className="w-full text-center text-base font-300 text-black/60 md:text-lg lg:text-xl xl:text-2xl">
          Negotiate for incentives to perform onchain actions with Royco
          Protocol.
        </div>
      </div>

      {/**
       * @description Cta Button
       */}

      <div className="mt-5 xl:mt-10">
        <Button
          onClick={() => scrollToSection("access-protocol")}
          className={cn(
            "flex w-fit flex-col items-center justify-center font-gt font-400 hover:opacity-100",
            "text-sm md:text-base",
            "rounded-md md:rounded-[0.4375rem]",
            "px-4 py-2 md:px-5 md:py-3",
            className
          )}
          // {...props}
        >
          <span className="leading-5 md:leading-5">Access Royco Protocol</span>
        </Button>
        {/* <GetUpdatesStrip className="mt-5 md:mt-[1.75rem]" /> */}
      </div>

      {/**
       * @descriptioon Banner
       */}
      <FadeInMotionWrapper
        className={cn("mt-10 w-full overflow-hidden md:mt-[3.41rem]", "-z-10")}
      >
        <div className="-mx-20 flex h-[250px] space-x-[-62px] md:h-[320px] md:space-x-[-80px] lg:h-[400px] lg:space-x-[-100px]">
          <img
            src="/home/banner2.png"
            alt="home:banner"
            className={cn(
              "object-cover object-top transition-all duration-500 ease-in-out"
            )}
          />

          <img
            src="/home/banner2.png"
            alt="home:banner"
            className={cn(
              "object-cover object-top transition-all duration-500 ease-in-out"
            )}
          />

          <img
            src="/home/banner2.png"
            alt="home:banner"
            className={cn(
              "object-cover object-top transition-all duration-500 ease-in-out"
            )}
          />

          <img
            src="/home/banner2.png"
            alt="home:banner"
            className={cn(
              "hidden object-cover object-top transition-all duration-500 ease-in-out xl:flex"
            )}
          />

          <img
            src="/home/banner2.png"
            alt="home:banner"
            className={cn(
              "hidden object-cover object-top transition-all duration-500 ease-in-out xl:flex"
            )}
          />

          <img
            src="/home/banner2.png"
            alt="home:banner"
            className={cn(
              "hidden object-cover object-top transition-all duration-500 ease-in-out xl:flex"
            )}
          />

          <img
            src="/home/banner2.png"
            alt="home:banner"
            className={cn(
              "hidden object-cover object-top transition-all duration-500 ease-in-out xl:flex"
            )}
          />
        </div>
      </FadeInMotionWrapper>
    </div>
  );
});
