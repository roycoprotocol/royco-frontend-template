"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

import { MarketBuilderSteps, useMarketBuilderManager } from "@/store";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useGeneralStats } from "@/store";

import { AnimatePresence, motion } from "framer-motion";
import { FallMotion, MorphMotion } from "@/components/animations";

export const StepButton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    activeStep: string;
    isActive: boolean;
    isDisabled: boolean;
    browserType: string | null;
    handleOnClick: () => Promise<void>;
    arrowType: "left" | "right" | null;
    buttonText: string;
  }
>(
  (
    {
      className,
      activeStep,
      isActive,
      isDisabled,
      handleOnClick,
      browserType,
      arrowType,
      buttonText,
      ...props
    },
    ref
  ) => {
    const [isClicked, setIsClicked] = useState(false);

    const variants = {
      initial: {
        x:
          arrowType === "left" || arrowType === "right"
            ? arrowType === "left"
              ? "100%"
              : "-100%"
            : 0,
      },
      animate: { x: 0 },
      exit: {
        x:
          arrowType === "left" || arrowType === "right"
            ? arrowType === "left"
              ? "-100%"
              : "100%"
            : 0,
      },
    };

    return (
      <div
        ref={ref}
        onClick={() => {
          if (isDisabled) return;
          handleOnClick().then(() => {
            setIsClicked(!isClicked);
          });
        }}
        className={cn(
          "flex h-8 w-fit cursor-pointer flex-row items-center rounded-full bg-primary text-secondary transition-all duration-200 ease-in-out hover:opacity-90",
          arrowType === "left" && "pl-2 pr-3",
          arrowType === "right" && "pl-3 pr-2",
          arrowType === null && "px-3",
          isActive &&
            "cursor-not-allowed bg-tertiary opacity-50 hover:opacity-50",
          isDisabled && "text-tertiary"
        )}
        // disabled={isDisabled}
      >
        {/* {arrowType === "left" && (
          <div className="relative flex h-5 w-5 overflow-hidden rounded-full bg-white">
            <AnimatePresence mode="sync">
              <motion.div
                key={`${arrowType}:${isClicked}`}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                variants={variants}
                className="absolute inset-0 h-5 w-5 rounded-full"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </motion.div>
            </AnimatePresence>
          </div>
        )} */}

        {arrowType === "left" && (
          <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full bg-white">
            <div className="absolute inset-0 h-5 w-5 rounded-full">
              <ChevronLeftIcon className="h-5 w-5" />
            </div>
          </div>
        )}

        <div
          className={cn(
            "text-white",
            arrowType === "left" && "ml-2",
            arrowType === "right" && "mr-2",
            browserType !== "webkit" && "h-5"
          )}
        >
          <span className="leading-5">{buttonText}</span>
        </div>

        {/* <MorphMotion.Container
          id={`step-button-navigator:${buttonText}:${arrowType}`}
          className={cn(
            "h-5 text-white",
            arrowType === "left" && "ml-2",
            arrowType === "right" && "mr-2",
            browserType !== "webkit" && "h-5"
          )}
        >
          <MorphMotion.Text
            className="leading-5"
            id={`step-button-navigator:${buttonText}:${arrowType}:text`}
          >
            {buttonText}
          </MorphMotion.Text>
        </MorphMotion.Container> */}

        {arrowType === "right" && (
          <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full bg-white">
            <div className="absolute inset-0 h-5 w-5 rounded-full">
              <ChevronRightIcon className="h-5 w-5" />
            </div>
          </div>
        )}

        {/* {arrowType === "right" && (
          <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full bg-white">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={`${arrowType}:${isClicked}`}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                variants={variants}
                className="absolute inset-0 h-5 w-5 rounded-full"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </motion.div>
            </AnimatePresence>
          </div>
        )} */}
      </div>
    );
  }
);

export const StepButtons = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { activeStep, setActiveStep, forceClose, setForceClose } =
    useMarketBuilderManager();

  const { browserType } = useGeneralStats();

  const handlePrevStep = () => {
    if (activeStep === MarketBuilderSteps.info.id) return;
    else if (activeStep === MarketBuilderSteps.actions.id)
      setActiveStep(MarketBuilderSteps.info.id);
    else if (activeStep === MarketBuilderSteps.params.id) {
      setForceClose(true);
      setTimeout(() => {
        setActiveStep(MarketBuilderSteps.actions.id);
        setForceClose(false);
      }, 401);
    } else if (activeStep === MarketBuilderSteps.review.id)
      setActiveStep(MarketBuilderSteps.params.id);
  };

  const handleNextStep = () => {
    if (activeStep === MarketBuilderSteps.info.id)
      setActiveStep(MarketBuilderSteps.actions.id);
    else if (activeStep === MarketBuilderSteps.actions.id)
      setActiveStep(MarketBuilderSteps.params.id);
    else if (activeStep === MarketBuilderSteps.params.id) {
      setForceClose(true);
      setTimeout(() => {
        setActiveStep(MarketBuilderSteps.review.id);
        setForceClose(false);
      }, 401);
    } else if (activeStep === MarketBuilderSteps.review.id) return;
  };

  return (
    <div
      ref={ref}
      className={cn("flex flex-col items-center px-3 pb-3", className)}
      {...props}
    >
      <div className="flex w-full max-w-2xl flex-row items-center justify-between space-x-2">
        <StepButton
          activeStep={activeStep}
          isActive={activeStep === MarketBuilderSteps.info.id}
          isDisabled={activeStep === MarketBuilderSteps.info.id}
          handleOnClick={() => {
            return new Promise((resolve) => {
              handlePrevStep();
              resolve();
            });
          }}
          arrowType="left"
          buttonText={
            activeStep === MarketBuilderSteps.info.id
              ? "Prev"
              : activeStep === MarketBuilderSteps.actions.id
                ? MarketBuilderSteps.info.label
                : activeStep === MarketBuilderSteps.params.id
                  ? MarketBuilderSteps.actions.label
                  : MarketBuilderSteps.params.label
          }
          browserType={browserType}
        />

        <StepButton
          activeStep={activeStep}
          isActive={activeStep === MarketBuilderSteps.review.id}
          isDisabled={activeStep === MarketBuilderSteps.review.id}
          handleOnClick={() => {
            return new Promise((resolve) => {
              handleNextStep();
              resolve();
            });
          }}
          arrowType="right"
          // buttonText={
          //   activeStep === MarketBuilderSteps.review.id ? "Submit" : "Next"
          // }
          buttonText={
            activeStep === MarketBuilderSteps.info.id
              ? MarketBuilderSteps.actions.label
              : activeStep === MarketBuilderSteps.actions.id
                ? MarketBuilderSteps.params.label
                : activeStep === MarketBuilderSteps.params.id
                  ? MarketBuilderSteps.review.label
                  : "Submit"
          }
          browserType={browserType}
        />
      </div>
    </div>
  );
});
