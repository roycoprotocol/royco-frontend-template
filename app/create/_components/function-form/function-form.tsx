"use client";

import { useMarketBuilder, useMarketBuilderManager } from "@/store";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Fragment, useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  useFormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { isAbiValid, isSolidityAddressValid } from "@/sdk/utils";

import type { Abi as TypedAbi } from "abitype";
import { ErrorAlert, LoadingSpinner } from "@/components/composables";
import { isEqual } from "lodash";
import { useContract } from "@/sdk/hooks";
import { FormContractAddress } from "./form-contract-address";
import { FormContractAbi } from "./form-contract-abi";
import {
  BadgeAlertIcon,
  BadgeInfoIcon,
  CheckIcon,
  ChevronRightIcon,
  CircleXIcon,
  GripVerticalIcon,
  InfoIcon,
} from "lucide-react";
import { FormFunctionSelector } from "./form-function-selector";
import { MorphMotion } from "@/components/animations";
import { FunctionFormUtilities } from "./function-form-utiltites";
import { FunctionFormSchema } from "./function-form-schema";
import { MarketBuilderFormSchema } from "../market-builder-form";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";
import { MotionWrapper } from "../market-builder-flow/animations";
import { useFunctionForm } from "@/store/use-function-form";
import toast from "react-hot-toast";
import { produce } from "immer";

export const FunctionForm = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    functionForm: UseFormReturn<z.infer<typeof FunctionFormSchema>>;
    marketBuilderForm: UseFormReturn<z.infer<typeof MarketBuilderFormSchema>>;
  }
>(({ className, marketBuilderForm, functionForm, ...props }, ref) => {
  // export const FunctionForm = () => {

  const [isFunctionFormValid, setIsFunctionFormValid] = useState(true);

  const resetIsFunctionFormValid = () => {
    setTimeout(() => {
      setIsFunctionFormValid(true);
    }, 2000);
  };

  useEffect(() => {
    resetIsFunctionFormValid();
  }, [isFunctionFormValid]);

  const { updateAbi, setUpdateAbi } = useFunctionForm();

  const { activeStep, actionsType, setIsContractAbiUpdated } =
    useMarketBuilderManager();

  const [isActionButtonClicked, setIsActionButtonClicked] = useState(false);

  /**
   * @description Market Builder Store
   */
  const { availableFunctions, setAvailableFunctions, chainId, setChainId } =
    useMarketBuilder();

  /**
   * @description Form initialization
   */
  // const form = useForm<z.infer<typeof functionFormSchema>>({
  //   resolver: zodResolver(functionFormSchema),
  // });
  // const { setValue, watch, control, resetField } = form;

  /**
   * @description Form submission handler
   */
  const onSubmit = (values: z.infer<typeof FunctionFormSchema>) => {
    const inputs = values.contract_function.inputs.map((input) => {
      return {
        input_type: "fixed" as "fixed",
        fixed_value: undefined,
        dynamic_value: undefined,
      };
    });

    const newAction = {
      id: uuidv4() as string,
      contract_address: values.contract_address,
      contract_function: values.contract_function,
      contract_image: values.contract_image,
      contract_name: values.contract_name,
      inputs: inputs,
      // outputs: [],
    };

    const currentActions = marketBuilderForm.watch(actionsType);
    // const newActions = [...currentActions, newAction];
    const newActions = produce(currentActions, (draft) => {
      // @ts-ignore
      draft.push(newAction);
    });

    marketBuilderForm.setValue(actionsType, newActions);
    setIsActionButtonClicked(true);
  };

  const {
    isLoading: isLoadingContract,
    data: dataContract,
    isError: isErrorContract,
    isRefetching: isRefetchingContract,
  } = useContract({
    chain_id: marketBuilderForm.watch("chain").id,
    contract_address: functionForm.watch("placeholder_contract_address") || "",
  });

  const updateContractAbi = () => {
    if (
      !!dataContract &&
      !(dataContract instanceof Error) &&
      dataContract.length > 0
    ) {
      if (
        dataContract.length === 1 &&
        isAbiValid(JSON.stringify(dataContract[0].abi)) &&
        !isEqual(
          dataContract[0].abi,
          JSON.parse(
            isAbiValid(functionForm.watch("contract_abi"))
              ? functionForm.watch("contract_abi")
              : "[]"
          )
        )

        // &&
        // (functionForm.watch("contract_abi") === undefined ||
        //   isAbiValid(functionForm.watch("contract_abi"))) &&
        // !isEqual(
        //   dataContract[0].abi,
        //   JSON.parse(functionForm.watch("contract_abi") || "[]")
        // )
      ) {
        setIsContractAbiUpdated(true);

        setTimeout(() => {
          functionForm.setValue(
            "contract_abi",
            JSON.stringify(dataContract[0].abi)
          );
        }, 200);
      } else if (
        dataContract.length === 2 &&
        !isEqual(
          // @ts-ignore
          [...dataContract[0].abi, ...dataContract[1].abi],
          JSON.parse(functionForm.watch("contract_abi") || "[]")
        )

        // &&
        // (functionForm.watch("contract_abi") === undefined ||
        //   isAbiValid(functionForm.watch("contract_abi"))) &&
        // !isEqual(
        //   /**
        //    * @TODO Strictly type this
        //    */
        //   // @ts-ignore
        //   [...dataContract[0].abi, ...dataContract[1].abi],
        //   JSON.parse(functionForm.watch("contract_abi") || "[]")
        // )
      ) {
        // @ts-ignore
        const combined_abi = [...dataContract[0].abi, ...dataContract[1].abi];

        if (!!combined_abi) {
          setIsContractAbiUpdated(true);

          setTimeout(() => {
            functionForm.setValue("contract_abi", JSON.stringify(combined_abi));
          }, 200);
        }
      }
    }
  };

  const updateAvailableFunctions = () => {
    if (isAbiValid(functionForm.watch("contract_abi"))) {
      const abi: TypedAbi = JSON.parse(functionForm.watch("contract_abi"));
      const functions = abi.filter((item) => item.type === "function");

      setAvailableFunctions(functions);
    } else {
      setAvailableFunctions([]);
    }
  };

  const updateContractFunction = () => {
    if (functionForm.watch("contract_function")) {
      let selectedFunctionExists: Boolean = false;

      for (let i = 0; i < availableFunctions.length; i++) {
        if (
          isEqual(
            availableFunctions[i],

            functionForm.watch("contract_function")
          )
        ) {
          selectedFunctionExists = true;
          break;
        }
      }

      if (!selectedFunctionExists) {
        /**
         * @description Typescript doesn't know that value can be undefined
         */
        // @ts-ignore
        functionForm.setValue("contract_function", undefined);
      }
    }
  };

  const updateContractAddress = () => {
    if (
      !isEqual(
        functionForm.watch("placeholder_contract_address"),
        functionForm.watch("contract_address")
      )
    ) {
      functionForm.setValue(
        "placeholder_contract_address",
        functionForm.watch("contract_address")
      );
    }
  };

  const resetActionButtonClicked = () => {
    if (isActionButtonClicked === true) {
      setTimeout(() => {
        setIsActionButtonClicked(false);
      }, 500);
    }
  };

  const getErrorMessage = () => {
    if (
      !isSolidityAddressValid("address", functionForm.watch("contract_address"))
    ) {
      return "Contract address is invalid";
    } else if (!isAbiValid(functionForm.watch("contract_abi"))) {
      return "Contract ABI is invalid";
    } else {
      return "Contract function not selected";
    }
  };

  useEffect(() => {
    resetActionButtonClicked();
  }, [isActionButtonClicked]);

  /**
   * @description Set contract ABI based on the fetched contract data
   */
  useEffect(() => {
    updateContractAbi();
  }, [dataContract, updateAbi]);

  /**
   * @description Set available functions based on the ABI
   */
  useEffect(() => {
    updateAvailableFunctions();
  }, [functionForm.watch("contract_abi")]);

  /**
   * @description Reset contract_function if the selected function is not available in the updated functions list
   */
  useEffect(() => {
    updateContractFunction();
  }, [availableFunctions]);

  useEffect(() => {
    updateContractAddress();
  }, [functionForm.watch("contract_address")]);

  // useEffect(() => {
  //   if (functionForm.formState.submitCount === 0) return;
  //   else if (functionForm.formState.isValid === false) {
  //     setIsFunctionFormValid(false);
  //   }
  // }, [functionForm.formState.submitCount]);

  return (
    <div ref={ref} className={cn("contents", className)}>
      {/* <div className="flex w-full flex-col items-center pb-5">
          <div className="w-full max-w-2xl">
            <div className="heading-3 flex-wrap text-primary">
              <MorphMotion.Text>
                {activeStep === "assets" ? "Dynamic Price" : "Functions"}
              </MorphMotion.Text>
            </div>
          </div>
        </div> */}

      <h2 className="heading-3 pb-5">
        {" "}
        {activeStep === "assets" ? "Dynamic Price" : "Functions"}
      </h2>

      {/* <div className="mb-5 w-full px-5">
        <div className="group flex w-full cursor-pointer flex-row items-center justify-between rounded-xl border border-divider bg-z2 px-3 py-2 transition-all duration-200 ease-in-out hover:bg-focus">
          <div className="flex flex-row items-center">
            <InfoIcon className="h-4 w-4 shrink-0 text-secondary transition-all duration-200 ease-in-out group-hover:text-primary" />
            <div className="body-2 ml-2 grow flex-wrap leading-5 text-secondary transition-all duration-200 ease-in-out group-hover:text-primary">
              How it works?
            </div>
          </div>

          <div className="flex h-4 w-4 shrink-0 flex-col place-content-center items-center rounded-full bg-tertiary transition-all duration-200 ease-in-out group-hover:bg-secondary">
            <ChevronRightIcon className="h-3 w-3 shrink-0 text-white" />
          </div>
        </div>
      </div> */}

      <Form {...functionForm}>
        <form
          onSubmit={functionForm.handleSubmit(onSubmit)}
          // className="flex grow flex-col overflow-hidden"
          className="contents"
        >
          {/**
           * @description Contract Address Input
           */}

          <FormContractAddress control={functionForm.control} />

          {/**
           * @description Contract ABI Input
           */}
          <div className="flex flex-grow flex-col overflow-hidden">
            <FormContractAbi
              functionForm={functionForm}
              isLoadingContract={isLoadingContract || isRefetchingContract}
              control={functionForm.control}
            />
          </div>

          {/**
           * @description Function Selector
           */}
          <FormFunctionSelector functionForm={functionForm} />

          <div className="relative">
            <Button
              disabled={isActionButtonClicked}
              className={cn(
                "mt-5 transition-all duration-200 ease-in-out",
                isActionButtonClicked !== true &&
                  "disabled:cursor-not-allowed disabled:opacity-80"
              )}
              type="submit"
              onClick={() => {
                if (
                  !isSolidityAddressValid(
                    "address",
                    functionForm.watch("contract_address")
                  )
                ) {
                  toast.custom(
                    <ErrorAlert message="Invalid contract address" />
                  );
                  setIsFunctionFormValid(false);
                } else if (!isAbiValid(functionForm.watch("contract_abi"))) {
                  toast.custom(<ErrorAlert message="Invalid contract ABI" />);
                  setIsFunctionFormValid(false);
                } else if (!functionForm.watch("contract_function")) {
                  toast.custom(
                    <ErrorAlert message="Contract function not selected" />
                  );
                  setIsFunctionFormValid(false);
                }
              }}
            >
              {/* Add Action */}

              <AnimatePresence mode="popLayout">
                {isActionButtonClicked === true ? (
                  <div className="flex h-6 w-6 flex-col place-content-center items-center">
                    <motion.div
                      key={`add-action-button:clicked`}
                      initial={{
                        opacity: 0,
                        scale: 0,
                        rotate: 360,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        rotate: 0,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0,
                        rotate: -180,
                      }}
                      transition={{
                        duration: 0.3,
                        bounce: 0,
                        type: "spring",
                        damping: 25,
                        stiffness: 300,
                      }}
                      className="flex h-5 w-5 flex-col place-content-center items-center rounded-full bg-white text-black"
                    >
                      <CheckIcon
                        strokeWidth={2.5}
                        className="h-3 w-3 shrink-0"
                      />
                    </motion.div>
                  </div>
                ) : (
                  <motion.div
                    key={`add-action-button:unclicked`}
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                      transition: {
                        duration: 0.4,
                        bounce: 0,
                        type: "spring",
                        damping: 25,
                        stiffness: 300,
                      },
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.2,
                      bounce: 0,
                      type: "spring",
                    }}
                  >
                    Add Action
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
});
