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
      'Offer incentives to perform any onchain transaction or series of transactions. Best for actions with lump sum rewards and timelocks.',
    icon: ScrollTextIcon,
  },
  vault: {
    index: 2,
    id: "vault",
    label: "Vault Market",
    tag: "",
    description:
      "Offer incentives to deposit into an underlying ERC4626 Vault. Best for streaming rewards pro-rated to depositors and for actions easily represented by a 4646 vault.",
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
  }
> = {
  upfront: {
    index: 1,
    id: "upfront",
    label: "Upfront",
    tag: "",
    description: "Pay all incentives at the completion of action.",
    icon: ArrowLeftRightIcon,
  },
  arrear: {
    index: 2,
    id: "arrear",
    label: "Arrear",
    tag: "",
    description:
      "Lock Action Provider's assets and pay incentives once unlocked.",
    icon: LockIcon,
  },
  forfeitable: {
    index: 3,
    id: "forfeitable",
    label: "Forfeitable",
    tag: "",
    description:
      "Lock Action Provider's assets and stream incentives, which are forfeited if withdrawn early.",
    icon: RssIcon,
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
                      onClick={() => field.onChange(option.id)}
                    />
                  );
                })}
            </div>
          </FormControl>
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
              <AnimatePresence mode="popLayout">
                {marketBuilderForm.watch("action_type") !== "recipe" && (
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
                    className="absolute left-0 top-0 h-full w-full cursor-not-allowed bg-white bg-opacity-50 backdrop-saturate-0"
                  ></motion.div>
                )}
              </AnimatePresence>

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
                    <OptionCard
                      key={BASE_KEY}
                      option={{
                        ...option,
                        isSelected: field.value === option.id,
                      }}
                      onClick={() => field.onChange(option.id)}
                    />
                  );
                })}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
});
