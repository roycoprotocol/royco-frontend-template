"use client";

import React, { Fragment } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { MarketBuilderFormSchema } from "../../market-builder-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  ArrowLeftRightIcon,
  CheckIcon,
  CircleHelpIcon,
  InfoIcon,
  LockIcon,
  LucideIcon,
  RssIcon,
  ScrollTextIcon,
  VaultIcon,
  WifiIcon,
  ActivityIcon,
  CodeIcon,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FormInputLabel } from "@/components/composables";

export const ActionTypeMap: Record<
  string,
  {
    index: number;
    id: string;
    label: string;
    tag: string;
    description: string;
    icon: LucideIcon;
  }
> = {
  recipe: {
    index: 1,
    id: "recipe",
    label: "Recipe Market",
    tag: "",
    description:
      "Incentivize any onchain transaction (or series of transactions).",
    icon: ScrollTextIcon,
  },
  vault: {
    index: 2,
    id: "vault",
    label: "Vault Market",
    tag: "",
    description:
      "Incentivize deposits into an existing ERC4626 Vault. Supports: streaming, cross-collateral.",
    icon: VaultIcon,
  },
};

export const IncentiveScheduleMap: Record<
  string,
  {
    index: number;
    id: string;
    label: string;
    tag: string;
    description: string;
    icon: LucideIcon;
    type: "recipe" | "vault";
  }
> = {
  upfront: {
    index: 1,
    id: "upfront",
    label: "Upfront",
    tag: "",
    description: "Payment at time action is completed.",
    icon: ArrowLeftRightIcon,
    type: "recipe",
  },
  arrear: {
    index: 2,
    id: "arrear",
    label: "Arrear",
    tag: "",
    description:
      "Payment after a timelock. Users may not withdraw their funds early.",
    icon: LockIcon,
    type: "recipe",
  },
  forfeitable: {
    index: 3,
    id: "forfeitable",
    label: "Forfeitable",
    tag: "",
    description:
      "Payment after a timelock. Users may withdraw early, but forfeit incentives.",
    icon: RssIcon,
    type: "recipe",
  },
  /**
   * @note Vault markets are deprecated, so all markets are recipe markets now
   * and therefore, there is no streaming incentive schedule
   */
  // streaming: {
  //   index: 4,
  //   id: "streaming",
  //   label: "Streaming",
  //   tag: "",
  //   //TODO: change description
  //   description:
  //     "Payment is streamed until users withdraw from the ERC4626 Vault.",
  //   icon: ActivityIcon,
  //   type: "vault",
  // },
};

export const CreateActionsMap: Record<
  string,
  {
    index: number;
    id: string;
    label: string;
    tag: string;
    description: string;
    icon: LucideIcon;
  }
> = {
  recipe: {
    index: 1,
    id: "recipe",
    label: "Create Recipe",
    tag: "",
    description: "Build your recipe step by step using our visual builder",
    icon: ScrollTextIcon,
  },
  bytecode: {
    index: 2,
    id: "bytecode",
    label: "Add Bytecode",
    tag: "",
    description: "Directly input compiled recipe bytecode",
    icon: CodeIcon,
  },
};

const OptionCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    option: {
      index: number;
      id: string;
      label: string;
      tag: string;
      description: string;
      isSelected: boolean;
      icon: LucideIcon;
    };
  }
>(({ className, option, onClick, ...props }, ref) => {
  const Icon = option.icon;

  return (
    <div
      ref={ref}
      className={cn(
        "duration-400 group flex h-fit cursor-pointer flex-row items-start justify-between space-x-4 rounded-xl border border-divider p-4 font-gt transition-all ease-in-out hover:bg-focus",
        className
      )}
      onClick={onClick}
      {...props}
    >
      <div className="flex flex-col gap-y-3 md:flex-row md:gap-x-3 md:gap-y-0">
        <div className="duration-400 flex h-11 w-11 shrink-0 flex-col place-content-center items-center overflow-hidden rounded-full bg-z2/80 transition-all ease-in-out group-hover:drop-shadow-md">
          <div className="flex h-9 w-9 flex-col place-content-center items-center overflow-hidden rounded-full bg-tertiary/10 transition-all duration-200 ease-in-out group-hover:drop-shadow-sm">
            <Icon
              strokeWidth={1.5}
              className="h-5 w-5 text-secondary transition-all duration-500 ease-in-out group-hover:scale-125"
            />
          </div>
        </div>

        <div className="flex h-fit grow flex-col items-start gap-1">
          <div className="flex flex-row items-center space-x-2 font-400">
            <div className="h-5 text-wrap text-primary">
              <span className="leading-5">{option.label}</span>
            </div>

            {/**
             * Removed tag
             */}
            {/* <div className="h-5 text-secondary">
            <span className="leading-5">{option.tag}</span>
          </div> */}
          </div>

          <div className="flex h-fit flex-col text-wrap font-300 text-secondary">
            <span className="leading-5">{option.description}</span>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "flex h-5 w-5 shrink-0 flex-col place-content-center items-center self-start overflow-hidden rounded-full border border-divider transition-all duration-200 ease-in-out"
        )}
      >
        <AnimatePresence mode="popLayout">
          {option.isSelected === true && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0,
                rotate: -180,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0,
                rotate: 180,
              }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
              className="flex h-5 w-5 flex-col place-content-center items-center rounded-full bg-success"
            >
              <CheckIcon strokeWidth={2.5} className="h-3 w-3 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

export const FormActionType = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketBuilderForm: UseFormReturn<z.infer<typeof MarketBuilderFormSchema>>;
  }
>(({ className, marketBuilderForm, ...props }, ref) => {
  return (
    <FormField
      control={marketBuilderForm.control}
      name="action_type"
      render={({ field }) => (
        <FormItem className={cn("", className)}>
          <FormInputLabel className="mb-2" label="Market Type" />

          <FormControl>
            <div className="flex flex-col gap-3">
              {Object.keys(ActionTypeMap)
                .sort((a, b) => {
                  return ActionTypeMap[a].index - ActionTypeMap[b].index;
                })
                .map((key, index) => {
                  const option = ActionTypeMap[key];

                  const BASE_KEY = `info:option-card:action-type:${option.id}`;

                  return (
                    <OptionCard
                      key={BASE_KEY}
                      option={{
                        ...option,
                        isSelected: field.value === option.id,
                      }}
                      onClick={() => {
                        field.onChange(option.id);
                        if (option.id === "recipe") {
                          marketBuilderForm.setValue(
                            "incentive_schedule",
                            "upfront"
                          );
                        } else {
                          marketBuilderForm.setValue(
                            "incentive_schedule",
                            "streaming"
                          );
                        }
                      }}
                    />
                  );
                })}
            </div>
          </FormControl>

          <div className="mt-2 flex justify-start text-sm text-tertiary underline">
            <a
              target="_blank"
              href="https://docs.royco.org/developers/recipes-vs.-vaults"
            >
              Lean more
            </a>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
});

export const FormIncentiveSchedule = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketBuilderForm: UseFormReturn<z.infer<typeof MarketBuilderFormSchema>>;
  }
>(({ className, marketBuilderForm, ...props }, ref) => {
  return (
    <FormField
      control={marketBuilderForm.control}
      name="incentive_schedule"
      render={({ field }) => (
        <FormItem className={cn("", className)}>
          <FormInputLabel
            className="mb-2"
            label="Incentive Schedule"
            info="Only required for Recipe Action"
          />

          <FormControl>
            <div className={cn("relative flex flex-col gap-3")}>
              {Object.keys(IncentiveScheduleMap)
                .sort((a, b) => {
                  return (
                    IncentiveScheduleMap[a].index -
                    IncentiveScheduleMap[b].index
                  );
                })
                .map((key, index) => {
                  const option = IncentiveScheduleMap[key];

                  const BASE_KEY = `info:option-card:incentive-schedule:${option.id}`;

                  return (
                    <div className="relative flex flex-col gap-3">
                      <AnimatePresence mode="popLayout">
                        <Tooltip>
                          <TooltipTrigger>
                            {marketBuilderForm.watch("action_type") !==
                              IncentiveScheduleMap[key].type && (
                              <motion.div
                                initial={{
                                  opacity: 0,
                                }}
                                animate={{
                                  opacity: 1,
                                }}
                                exit={{
                                  opacity: 0,
                                }}
                                transition={{
                                  duration: 0.2,
                                  ease: "easeInOut",
                                  type: "spring",
                                  damping: 25,
                                  stiffness: 300,
                                }}
                                className="absolute left-0 top-0 h-full w-full bg-white bg-opacity-50 backdrop-saturate-0"
                              ></motion.div>
                            )}
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <div>
                              {marketBuilderForm.watch("action_type") ===
                              "recipe"
                                ? "Only available for Vault Markets."
                                : " Only available for Recipe Markets."}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </AnimatePresence>
                      <OptionCard
                        key={BASE_KEY}
                        option={{
                          ...option,
                          isSelected: field.value === option.id,
                        }}
                        onClick={() => field.onChange(option.id)}
                      />
                    </div>
                  );
                })}
            </div>
          </FormControl>

          <div className="mt-2 flex justify-start text-sm text-tertiary underline">
            <a
              target="_blank"
              href="https://docs.royco.org/developers/creating-an-iam"
            >
              Learn more
            </a>
          </div>

          <FormMessage />
        </FormItem>
      )}
    />
  );
});

export const FormCreateActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketBuilderForm: UseFormReturn<z.infer<typeof MarketBuilderFormSchema>>;
  }
>(({ className, marketBuilderForm, ...props }, ref) => {
  return (
    <div className={cn("", className)}>
      <FormField
        control={marketBuilderForm.control}
        name="create_actions_type"
        render={({ field }) => (
          <FormItem className={cn("", className)}>
            <FormInputLabel className="mb-2" label="Create Actions" />

            <FormControl>
              <div className="flex flex-col gap-3">
                {Object.keys(CreateActionsMap).map((key) => {
                  const option =
                    CreateActionsMap[key as keyof typeof CreateActionsMap];
                  const BASE_KEY = `info:option-card:recipe-type:${option.id}`;

                  return (
                    <OptionCard
                      key={BASE_KEY}
                      option={{
                        ...option,
                        isSelected: field.value === option.id,
                      }}
                      onClick={() => {
                        field.onChange(option.id);

                        marketBuilderForm.setValue("enter_actions", []);
                        marketBuilderForm.setValue("exit_actions", []);

                        marketBuilderForm.setValue(
                          "enter_actions_bytecode",
                          null
                        );
                        marketBuilderForm.setValue(
                          "exit_actions_bytecode",
                          null
                        );
                      }}
                    />
                  );
                })}
              </div>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
});
