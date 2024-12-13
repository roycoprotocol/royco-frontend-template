"use client";

import { cn } from "@/lib/utils";
import { Fragment, useState } from "react";
import { useSpring, animated } from "react-spring";
import { BigNumber } from "ethers"; // Import BigNumber from ethers.js (or use BigNumber.js)
import { Waypoint } from "react-waypoint";

export const SpringNumber = ({
  previousValue,
  currentValue,
  numberFormatOptions,
  className,
  spanClassName,
  defaultColor = "text-black",
  noSpan = false,
  overrideColor,
}: {
  previousValue: BigNumber | number; // Accept BigNumber or number
  currentValue: BigNumber | number; // Accept BigNumber or number
  numberFormatOptions: Intl.NumberFormatOptions;
  className?: string;
  spanClassName?: string;
  defaultColor?: string;
  noSpan?: boolean;
  overrideColor?: string;
}) => {
  const [inView, setInview] = useState(false);
  const [color, setColor] = useState("text-black");
  const [isBlinking, setIsBlinking] = useState(false);

  const formatNumber = (value: BigNumber | number) => {
    if (BigNumber.isBigNumber(value)) {
      // For BigNumber, convert to a string, then format as number
      const formatted = new Intl.NumberFormat(
        "en-US",
        numberFormatOptions
      ).format(
        parseFloat(value.toString()) // Convert BigNumber to a float for formatting
      );
      return formatted;
    }
    return new Intl.NumberFormat("en-US", numberFormatOptions).format(value); // Handle regular numbers
  };

  const [formattedNumber, setFormattedNumber] = useState(
    formatNumber(previousValue)
  );

  /**
   * @description Spring animation initialization
   */
  const springAnimation = useSpring({
    from: BigNumber.isBigNumber(previousValue)
      ? parseFloat(previousValue.toString()) // Convert BigNumber to a float for spring animation
      : previousValue || 0,
    number: inView
      ? BigNumber.isBigNumber(currentValue)
        ? parseFloat(currentValue.toString())
        : currentValue
      : BigNumber.isBigNumber(previousValue)
        ? parseFloat(previousValue.toString())
        : previousValue || 0,
    config: {
      mass: 1,
      tension: 20,
      friction: 10,
      duration: 600,
    },
    onStart: () => {
      if (
        BigNumber.isBigNumber(currentValue) &&
        BigNumber.isBigNumber(previousValue)
      ) {
        if (currentValue.gt(previousValue)) {
          setColor(overrideColor || "text-success");
        } else if (currentValue.lt(previousValue)) {
          setColor(overrideColor || "text-error");
        }
      } else if (
        typeof currentValue === "number" &&
        typeof previousValue === "number"
      ) {
        if (currentValue > previousValue) {
          setColor(overrideColor || "text-success");
        } else if (currentValue < previousValue) {
          setColor(overrideColor || "text-error");
        }
      }
      setIsBlinking(true);
    },
    onRest: () => {
      setColor("text-black");
      setIsBlinking(false);
      setFormattedNumber(formatNumber(currentValue));
    },
  });

  /**
   * @description Spring animation value retrieval
   */
  const {
    number,
  }: {
    number: any;
  } = "number" in springAnimation ? springAnimation : { number: 0 };

  return (
    <Waypoint onEnter={() => setInview(true)}>
      <animated.div
        className={cn(
          "tabular-nums transition-colors duration-200 ease-in-out",
          className,
          "h-fit",
          // "leading-normal",
          color === "text-black" ? defaultColor : color,
          { "animate-blink": isBlinking }
        )}
      >
        {/* {isBlinking &&
          (noSpan ? (
            number.to((n: any) => formatNumber(n))
          ) : (
            <animated.span className={cn("", spanClassName)}>
              {number.to((n: any) => formatNumber(n))}
            </animated.span>
          ))} */}

        {isBlinking
          ? number.to((n: any) => formatNumber(n))
          : formatNumber(currentValue)}

        {/* {isBlinking && number.to((n: any) => formatNumber(n))} */}

        {/* {!isBlinking && formatNumber(currentValue)} */}
      </animated.div>
    </Waypoint>
  );
};
