"use client";

import { cn } from "@/lib/utils";
import React, { Fragment } from "react";
import { PoolFormType } from "../../market-builder-form";
import { MotionWrapper } from "../animations";
import { InfoCard, InfoTip, TokenDisplayer } from "@/components/common";
import {
  ActionTypeMap,
  CreateActionsMap,
  IncentiveScheduleMap,
} from "../info-step/form-selectors";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { ExternalLinkIcon, InfoIcon, TriangleAlertIcon } from "lucide-react";
import { getExplorerUrl } from "royco/utils";
import { WeirollActionFlow } from "./weiroll-action-flow";
import { ReviewActionsTypeSelector } from "./review-actions-type-selector";
import { useMarketBuilderManager } from "@/store";
import { AnimatePresence } from "framer-motion";
import { useActionsDecoder, useActionsEncoder } from "royco/hooks";
import { ActionFlow, AlertLabel } from "@/components/composables";
import { toFunctionSelector, toFunctionSignature } from "viem";
import { CopyWrapper } from "@/app/_components/ui/composables/copy-wrapper";

export const ReviewStep = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketBuilderForm: PoolFormType;
  }
>(({ marketBuilderForm, className, ...props }, ref) => {
  const vaultExplorerUrl = getExplorerUrl({
    chainId: marketBuilderForm.watch("chain").id,
    value: marketBuilderForm.watch("vault_address") ?? "",
    type: "address",
  });

  const { reviewActionsType } = useMarketBuilderManager();

  const currentActions = marketBuilderForm.watch(reviewActionsType);

  const { data: dataEncodedActions } = useActionsEncoder({
    /**
     * @todo Strictly type this
     */
    // @ts-ignore
    marketActions: currentActions,
  });

  return (
    <div
      ref={ref}
      className={cn(
        "hide-scrollbar flex w-full shrink-0 grow flex-col overflow-y-scroll",
        className
      )}
      {...props}
    >
      <MotionWrapper>
        <div className="w-full text-wrap font-gt text-xl font-medium text-black">
          {marketBuilderForm.watch("market_name")}
        </div>
      </MotionWrapper>

      <MotionWrapper delay={0.1}>
        <div className="mt-5 font-gt text-lg font-light text-secondary">
          {marketBuilderForm.watch("market_description")}
        </div>
      </MotionWrapper>

      <MotionWrapper delay={0.2}>
        <h4 className="mt-10 font-gt text-base font-medium text-black">
          Key Details
        </h4>

        <div className="mt-3 flex flex-col gap-3 rounded-xl border border-divider p-5 text-secondary">
          <InfoCard.Row>
            <InfoCard.Row.Key>Chain</InfoCard.Row.Key>
            <InfoCard.Row.Value>
              <TokenDisplayer
                hover
                bounce
                tokens={[marketBuilderForm.watch("chain")]}
                symbols={true}
                name={true}
              />
            </InfoCard.Row.Value>
          </InfoCard.Row>

          {marketBuilderForm.watch("action_type") === "recipe" && (
            <InfoCard.Row>
              <InfoCard.Row.Key>Accepts</InfoCard.Row.Key>
              <InfoCard.Row.Value>
                <TokenDisplayer
                  hover
                  bounce
                  tokens={[marketBuilderForm.watch("asset")]}
                  symbols={true}
                />
              </InfoCard.Row.Value>
            </InfoCard.Row>
          )}

          <InfoCard.Row>
            <InfoCard.Row.Key>Action Type</InfoCard.Row.Key>
            <InfoCard.Row.Value className="">
              <div className="flex h-5">
                <span className="leading-5">
                  {ActionTypeMap[marketBuilderForm.watch("action_type")].label}
                </span>
              </div>
              {/* <InfoTip>
                {
                  ActionTypeMap[marketBuilderForm.watch("action_type")]
                    .description
                }
              </InfoTip> */}
            </InfoCard.Row.Value>
          </InfoCard.Row>

          {marketBuilderForm.watch("action_type") === "vault" && (
            <InfoCard.Row>
              <InfoCard.Row.Key>Vault Address</InfoCard.Row.Key>
              <InfoCard.Row.Value>
                <div className="flex h-5">
                  {marketBuilderForm.watch("vault_address") !== undefined &&
                    marketBuilderForm.watch("vault_address") !== null &&
                    marketBuilderForm.watch("vault_address")?.slice(0, 6) +
                      "..." +
                      marketBuilderForm.watch("vault_address")?.slice(-4)}
                </div>

                <a
                  href={vaultExplorerUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-secondary hover:text-primary"
                >
                  <ExternalLinkIcon
                    strokeWidth={1.5}
                    className="h-5 w-5 cursor-pointer"
                  />
                </a>
              </InfoCard.Row.Value>
            </InfoCard.Row>
          )}

          {marketBuilderForm.watch("action_type") === "recipe" && (
            <InfoCard.Row>
              <InfoCard.Row.Key>Incentive Schedule</InfoCard.Row.Key>
              <InfoCard.Row.Value>
                <div className="flex h-5">
                  <span className="leading-5">
                    {
                      IncentiveScheduleMap[
                        marketBuilderForm.watch("incentive_schedule")
                      ].label
                    }
                  </span>
                </div>

                <InfoTip>
                  {
                    IncentiveScheduleMap[
                      marketBuilderForm.watch("incentive_schedule")
                    ].description
                  }
                </InfoTip>
              </InfoCard.Row.Value>
            </InfoCard.Row>
          )}

          {marketBuilderForm.watch("action_type") === "recipe" && (
            <InfoCard.Row>
              <InfoCard.Row.Key>Lockup Time</InfoCard.Row.Key>
              <InfoCard.Row.Value className="capitalize">
                {marketBuilderForm.watch("lockup_time")?.duration
                  ? `${marketBuilderForm.watch("lockup_time")?.duration} ${
                      marketBuilderForm.watch("lockup_time")?.duration_type
                    }`
                  : "N/A"}
              </InfoCard.Row.Value>
            </InfoCard.Row>
          )}
        </div>
      </MotionWrapper>

      {marketBuilderForm.watch("action_type") === "recipe" &&
        marketBuilderForm.watch("create_actions_type") === "recipe" && (
          <MotionWrapper delay={0.3}>
            <h4 className="mt-10 font-gt text-base font-medium text-black">
              Recipe Details
            </h4>

            <div className="mt-3 flex w-full flex-row items-center justify-center gap-2">
              <ReviewActionsTypeSelector
                marketBuilderForm={marketBuilderForm}
              />
              <div className="flex h-9 w-9 flex-col items-center justify-center rounded-lg border border-divider bg-z2">
                <CopyWrapper
                  text={JSON.stringify(dataEncodedActions, null, 2)}
                ></CopyWrapper>
              </div>
            </div>

            <ActionFlow
              className="mt-3 rounded-xl border border-divider bg-z2 p-3 text-secondary"
              actions={marketBuilderForm
                .watch(reviewActionsType)
                .map((action, actionIndex) => {
                  return {
                    id: action.id,
                    chain_id: marketBuilderForm.watch("chain").id,
                    contract_address: action.contract_address,
                    contract_function: toFunctionSelector(
                      // @ts-ignore
                      action.contract_function
                    ),
                    function_signature: toFunctionSignature(
                      // @ts-ignore
                      action.contract_function
                    ),
                    calldata: "0x",
                    contract_name: action.contract_name,
                    function_name: action.contract_function.name,
                    explorer_url: getExplorerUrl({
                      chainId: marketBuilderForm.watch("chain").id,
                      value: action.contract_address,
                      type: "address",
                    }),
                  };
                })}
            />
          </MotionWrapper>
        )}

      {marketBuilderForm.watch("action_type") === "recipe" &&
        marketBuilderForm.watch("exit_actions").length === 0 &&
        marketBuilderForm.watch("exit_actions_bytecode") === null && (
          <MotionWrapper delay={0.4}>
            {/* <h4 className="mt-10 font-gt text-base font-medium text-black">
              Recipe Notes
            </h4> */}

            <AlertLabel className="mt-10" />
          </MotionWrapper>
        )}
    </div>
  );
});
