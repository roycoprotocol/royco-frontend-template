"use client";

import React from "react";
import "./header.css";
import { cn } from "@/lib/utils";

import { motion, useScroll, useTransform } from "framer-motion";
import { GetUpdatesStrip } from "./composables";
import { MaxWidthWrapper } from "./composables/max-width-wrapper";

export const Header = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { scrollYProgress } = useScroll();

  const scaleBanner = useTransform(scrollYProgress, [0, 1], [1, 1]);

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

      <div className="mt-1 xl:mt-4">
        <GetUpdatesStrip className="mt-5 md:mt-[1.75rem]" />
      </div>

      <MaxWidthWrapper>
        {/**
         * @descriptioon Banner
         */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: 0,
            duration: 1,
            ease: "easeOut",
          }}
          className={cn("mt-10 md:mt-[3.41rem]", "-z-10")}
        >
          <div className="-mx-20 md:-mx-20 lg:mx-[-12.94rem] xl:mx-[-14.94rem]">
            <img
              src="/home/banner2.png"
              alt="home:banner"
              className={cn(
                "object-cover object-top transition-all duration-500 ease-in-out"
              )}
            />
          </div>
        </motion.div>
      </MaxWidthWrapper>
    </div>
  );
});
