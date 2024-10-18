"use client";

import React from "react";
import { cn } from "@/lib/utils";
import "./benefits.css";
import { SectionSubtitle, SectionTitle } from "./composables";
import { motion } from "framer-motion";
import {
  BookOpenCheckIcon,
  HandCoinsIcon,
  HandshakeIcon,
  LayersIcon,
  ShieldCheckIcon,
  UsersRoundIcon,
  BarChartIcon,
  SquareStackIcon,
} from "lucide-react";
import { SecurityShield } from "../assets";
import { MaxWidthWrapper } from "./composables/max-width-wrapper";

const Modals = [
  {
    id: "negotiation",
    title: "Negotiation",
    description:
      "Royco Protocol allows users to express their willingness to perform onchain actions for incentives.",
    icon: BarChartIcon,
  },
  {
    id: "capital-efficient",
    title: "Capital Efficient",
    description:
      "Royco Protocol is capital efficient, allowing users to create intents using the same assets across markets.",
    icon: SquareStackIcon,
  },
  {
    id: "transparent",
    title: "Transparent",
    description:
      "The Royco Protocol is immutable, open source, and all intents are visible to anyone.",
    icon: BookOpenCheckIcon,
  },
  {
    id: "composable",
    title: "Composable",
    description:
      "Integrating Royco Protocol enables the creation of a diverse set of products and applications.",
    icon: LayersIcon,
  },
];

export const Benefits = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex w-full flex-col place-content-center items-center justify-center bg-white font-gt",
        "px-5 py-16 text-black md:px-12 md:py-24 lg:px-[10.44rem] lg:py-[8.25rem] xl:px-[12.44rem]",
        className
      )}
    >
      <MaxWidthWrapper>
        <SectionTitle>A market for any onchain action.</SectionTitle>

        <SectionSubtitle className="pb-[1rem] font-normal">
          Developers, incentive providers, and users participate in markets that
          are are open and accessible to all.
        </SectionSubtitle>

        <div
          className={cn(
            "w-full items-start overflow-x-hidden",
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
            "gap-2 lg:gap-8 xl:gap-[1.25rem]",
            "mt-4"
          )}
        >
          {Modals.map(({ id, title, description }, modalIndex) => {
            const Icon = Modals.find((modal) => modal.id === id)?.icon;
            const BASE_KEY = `home:benefits:${id}`;

            return (
              <div // @was motion.div
                // initial={{
                //   scale: 0.8,
                //   x: 40,
                //   opacity: 0,
                //   filter: "blur(10px)",
                // }}
                // whileInView={{
                //   scale: 1,
                //   opacity: 1,
                //   x: 0,
                //   filter: "blur(0px)",
                // }}
                // viewport={{
                //   once: true,
                // }}
                // transition={{
                //   duration: 0.4,
                //   ease: "easeInOut",
                //   type: "spring",
                //   delay: modalIndex * 0.1,
                // }}
                key={BASE_KEY}
                className={cn(
                  "col-span-1 flex flex-col",
                  // "lg:w-[10rem] xl:w-[23.5rem]",
                  "w-full"
                )}
              >
                <div className={cn("mt-[1.2rem] lg:mt-[2.81rem]")}>
                  {/* <div
                    className={cn(
                      "shrink-0 rounded-full bg-primary",
                      "w-10 lg:w-[2.625rem]",
                      "h-10 lg:h-[2.625rem]"
                    )}
                  >
                  </div> */}

                  <Icon
                    strokeWidth={id === "negotiation" ? 2.5 : 2}
                    className={cn(
                      "shrink-0 text-black",
                      "w-7 lg:w-[1.9375rem]",
                      "h-7 lg:h-[1.9375rem]"
                    )}
                  />
                </div>

                <div
                  className={cn(
                    "font-medium lg:h-[2.5rem] xl:h-[2.125rem]",
                    "mt-2 text-lg md:mt-[1.13rem] lg:text-[1.125rem]",
                    "lg:text-lg"
                  )}
                >
                  {title}
                </div>
                <div
                  className={cn(
                    "text-black/60 ",
                    "text-base font-normal",
                    "mt-3 md:mt-[0.94rem]",
                    "xl:max-w-[17.54956rem]",
                    "lg:text-base"
                  )}
                >
                  {description}
                </div>
              </div>
            );
          })}
        </div>
      </MaxWidthWrapper>
    </div>
  );
});
