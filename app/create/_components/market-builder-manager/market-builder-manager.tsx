"use client";

import { MarketActionType, useMarketBuilderManager } from "@/store";

import { MarketBuilderSteps } from "@/store";
import { AnimatePresence, motion } from "framer-motion";
import {
  Control,
  useForm,
  UseFormReturn,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { MarketBuilderFormSchema } from "../market-builder-form";
import { z } from "zod";
import React, { useEffect } from "react";
import {
  ActionsStep,
  InfoStep,
  ReviewStep,
  TransactionStep,
} from "../market-builder-flow";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { BottomNavigator } from "./bottom-navigator";
import { FunctionForm, FunctionFormSchema } from "../function-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DragAndDropWrapper } from "../drag-and-drop-wrapper";
import { SelectionMenu } from "../selection-menu";
import { VaultStep } from "../market-builder-flow";
import { BuilderSectionWrapper } from "../composables";
import { useWriteContract } from "wagmi";
import toast from "react-hot-toast";
import { ErrorAlert } from "@/components/composables";
import { WriteContractErrorType } from "@wagmi/core";
import { BytecodeStep } from "../market-builder-flow/bytecode-step/bytecode-step";

export type MarketBuilderManagerProps = {
  marketBuilderForm: UseFormReturn<z.infer<typeof MarketBuilderFormSchema>>;
  watchMarketBuilderForm: UseFormWatch<z.infer<typeof MarketBuilderFormSchema>>;
  setValueMarketBuilderForm: UseFormSetValue<
    z.infer<typeof MarketBuilderFormSchema>
  >;
  controlMarketBuilderForm: Control<z.infer<typeof MarketBuilderFormSchema>>;
};

export const MarketBuilderManager = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketBuilderForm: UseFormReturn<z.infer<typeof MarketBuilderFormSchema>>;
  }
>(({ className, marketBuilderForm, ...props }, ref) => {
  const { activeStep, setActiveStep, lastActiveSteps, setLastActiveSteps } =
    useMarketBuilderManager();

  const functionForm = useForm<z.infer<typeof FunctionFormSchema>>({
    resolver: zodResolver(FunctionFormSchema),
    defaultValues: {
      chain_id: 11155111,
    },
  });

  const onSubmit = (data: any) => {
    console.log("market form submitted");
  };

  const resetFunctionForm = () => {
    functionForm.setValue("chain_id", marketBuilderForm.watch("chain").id);
  };

  const {
    status: txStatus,
    data: txHash,
    isPending: isTxPending,
    isError: isTxError,
    error: txError,
    writeContract,
  } = useWriteContract();

  // console.log("market creation txError", txError);

  useEffect(() => {
    if (isTxError) {
      // @ts-ignore
      const errorMessage =
        // @ts-ignore
        txError?.shortMessage ?? "Error in executing transaction";

      toast.custom(<ErrorAlert message={errorMessage} />);
    }
  }, [isTxError]);

  useEffect(() => {
    resetFunctionForm();
  }, [marketBuilderForm && marketBuilderForm.watch("chain")]);

  useEffect(() => {
    const newActiveSteps = [...lastActiveSteps, activeStep];

    if (newActiveSteps.length > 2) {
      newActiveSteps.shift();
    }

    setTimeout(() => {
      setLastActiveSteps(newActiveSteps);
    }, 400);
  }, [activeStep]);

  useEffect(() => {
    if (txStatus === "success") {
      setActiveStep(MarketBuilderSteps.transaction.id);
    }
  }, [txStatus]);

  return (
    <div
      ref={ref}
      /**
       * @weird somehow h-[60%] is working
       */
      className={cn(
        "flex h-full w-full grow flex-row justify-between overflow-hidden",
        className
      )}
    >
      <DragAndDropWrapper functionForm={functionForm}>
        <AnimatePresence mode="sync">
          {activeStep === "actions" && (
            <BuilderSectionWrapper
              key={`market-manager:selection-menu:container`}
              className="h-full w-[30%] overflow-hidden"
            >
              <SelectionMenu
                marketBuilderForm={marketBuilderForm}
                functionForm={functionForm}
              />
            </BuilderSectionWrapper>
          )}

          {activeStep === "actions" && (
            <BuilderSectionWrapper
              key={`market-manager:function-form:container`}
              className="h-full w-[30%] overflow-hidden"
            >
              <FunctionForm
                marketBuilderForm={marketBuilderForm}
                functionForm={functionForm}
              />
            </BuilderSectionWrapper>
          )}

          <BuilderSectionWrapper
            // key={`market-manager:main-section:${activeStep}`}
            className={cn(
              "flex flex-col",
              activeStep === "actions" ? "w-[35%]" : "w-full"
            )}
          >
            <Form {...marketBuilderForm}>
              {activeStep === "actions" && (
                <BuilderSectionWrapper
                  key={`market-manager:actions-list:container`}
                >
                  <h2 className="heading-3">Sequence</h2>
                  <p className="caption mt-2 pb-5 text-tertiary">
                    Order the functions as you want them to run. Customize
                    parameters/inputs on the next screen
                  </p>
                </BuilderSectionWrapper>
              )}
              <form
                onSubmit={marketBuilderForm.handleSubmit(onSubmit)}
                className={cn(
                  "flex h-fit grow flex-col items-center overflow-y-scroll",
                  (activeStep === MarketBuilderSteps.actions.id ||
                    activeStep === MarketBuilderSteps.params.id) &&
                    "contents"
                )}
              >
                {activeStep === MarketBuilderSteps.info.id && (
                  <InfoStep
                    marketBuilderForm={marketBuilderForm}
                    className=""
                  />
                )}

                {(activeStep === MarketBuilderSteps.actions.id ||
                  activeStep === MarketBuilderSteps.params.id) && (
                  <ActionsStep
                    marketBuilderForm={marketBuilderForm}
                    className=""
                  />
                )}

                {activeStep === MarketBuilderSteps.bytecode.id && (
                  <BytecodeStep
                    marketBuilderForm={marketBuilderForm}
                    className=""
                  />
                )}

                {activeStep === MarketBuilderSteps.review.id && (
                  <ReviewStep
                    marketBuilderForm={marketBuilderForm}
                    className=""
                  />
                )}

                {activeStep === MarketBuilderSteps.vault.id && (
                  <VaultStep
                    marketBuilderForm={marketBuilderForm}
                    className=""
                  />
                )}

                {activeStep === MarketBuilderSteps.transaction.id && (
                  <TransactionStep
                    marketBuilderForm={marketBuilderForm}
                    txHash={txHash}
                    className=""
                  />
                )}
              </form>
            </Form>
            {activeStep !== MarketBuilderSteps.transaction.id && (
              <BuilderSectionWrapper
                className="shrink-0"
                key={`market-manager:bottom-navigator:${activeStep}`}
                delay={
                  activeStep === MarketBuilderSteps.info.id
                    ? 0.6
                    : activeStep === MarketBuilderSteps.review.id
                      ? 0.4
                      : activeStep === MarketBuilderSteps.vault.id
                        ? 0.1
                        : marketBuilderForm.watch("action_type") === "recipe"
                          ? 0
                          : 0
                }
              >
                <BottomNavigator
                  txStatus={txStatus}
                  writeContract={writeContract}
                  className={cn(
                    "",
                    activeStep === MarketBuilderSteps.actions.id ||
                      activeStep === MarketBuilderSteps.params.id
                      ? "mt-5"
                      : // : "mt-12"
                        "mt-12"
                  )}
                  marketBuilderForm={marketBuilderForm}
                />
              </BuilderSectionWrapper>
            )}
          </BuilderSectionWrapper>
        </AnimatePresence>
      </DragAndDropWrapper>
    </div>
  );
});
