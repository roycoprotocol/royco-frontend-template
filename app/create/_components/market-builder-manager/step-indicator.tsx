"use client";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import { MarketBuilderSteps } from "@/store";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { MarketBuilderFormSchema } from "../market-builder-form";
import { useGeneralStats } from "@/store";

export const StepIndicator = ({
  activeStep,
  setActiveStep,
  marketBuilderForm,
}: {
  activeStep: string;
  setActiveStep: Function;
  marketBuilderForm: UseFormReturn<z.infer<typeof MarketBuilderFormSchema>>;
}) => {
  const { browserType } = useGeneralStats();

  const [hoveredStep, setHoveredStep] = useState<string | null>(null);

  const [isStepValid, setIsStepValid] = useState<Array<boolean | null>>([
    null,
    null,
    null,
    null,
    null,
  ]);

  const resetStepValidity = async () => {
    const errors = marketBuilderForm.formState.errors;

    if (activeStep === MarketBuilderSteps.info.id) {
      setIsStepValid([null, null, null, null, null]);
    } else if (activeStep === MarketBuilderSteps.actions.id) {
      const isNameValid = await marketBuilderForm.trigger("market_name");
      const isDescriptionValid =
        await marketBuilderForm.trigger("market_description");

      const isInfoStepValid = isNameValid && isDescriptionValid;

      setIsStepValid([isInfoStepValid, null, null, null, null]);
    }
  };

  useEffect(() => {
    resetStepValidity();
  }, [activeStep]);

  return (
    <motion.div
      layout="position"
      transition={{
        bounce: 0,
      }}
      className="list subtitle-2 flex w-fit flex-row items-center space-x-1 rounded-full border border-divider bg-z2 p-1"
    >
      {Object.keys(MarketBuilderSteps).map((stepId, index) => {
        const step = MarketBuilderSteps[stepId];
        const baseKey = `market-manager-step:${step.id}`;
        return (
          <motion.li
            layout="position"
            layoutId={baseKey}
            key={baseKey}
            tabIndex={0}
            onClick={() => setActiveStep(step.id)}
            className={cn(
              "relative !h-7 w-fit shrink-0 cursor-pointer py-1 pl-1 pr-2 text-center",
              "overflow-hidden transition-colors duration-200 ease-in-out",
              "flex flex-row place-content-center items-center",
              activeStep === step.id ? "text-black" : "text-tertiary",
              "badge uppercase",
              isStepValid[index] === false &&
                "rounded-full bg-error text-white",
              isStepValid[index] === true &&
                "rounded-full bg-success text-white"
            )}
            onHoverStart={() => setHoveredStep(step.id)}
            onHoverEnd={() => setHoveredStep(null)}
            transition={{
              bounce: 0,
            }}
          >
            <div
              className={cn(
                "z-20 h-[1.25rem] w-[1.25rem] shrink-0 overflow-hidden rounded-full transition-all duration-200 ease-in-out",
                activeStep === step.id
                  ? "bg-secondary text-white"
                  : "bg-tertiary text-white",
                isStepValid[index] === false && "bg-white text-error",
                isStepValid[index] === true && "bg-white text-success"
              )}
            >
              {browserType === "webkit" ? (
                <div className="-mt-[0.1rem]">{index + 1}</div>
              ) : (
                <span className={cn("leading-5")}>{index + 1}</span>
              )}
            </div>

            <div
              className={cn(
                "z-20 ml-2 shrink-0",
                browserType !== "webkit" && "h-5"
              )}
            >
              <span className="leading-5">{step.label}</span>
            </div>

            {activeStep === step.id ? (
              <motion.div
                transition={{
                  duration: 0.2,
                  ease: "easeInOut",
                  type: "spring",
                  bounce: 0,
                }}
                layoutId="market-manager:step-indicator"
                className="absolute inset-0 z-10"
              >
                <div className="h-full w-full rounded-full bg-white shadow-sm"></div>
              </motion.div>
            ) : null}
          </motion.li>
        );
      })}
    </motion.div>
  );
};
