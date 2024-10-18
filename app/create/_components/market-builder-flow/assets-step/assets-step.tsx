"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { type PoolFormUtilities } from "../../market-builder-form";

import { MotionWrapper } from "../animations";

import {
  CircleDollarSignIcon,
  ExternalLinkIcon,
  GrabIcon,
  Trash2Icon,
} from "lucide-react";
import { TokenSelector } from "./token-selector";
import { TokenDisplayer } from "@/components/common";
import { Input } from "@/components/ui/input";
import { PriceTypeSelector } from "./price-type-selector";
import { getExplorerUrl } from "@/sdk/utils";
import { useMarketBuilderManager } from "@/store";
import { MarketBuilderSteps } from "@/store";
import { FallMotion } from "@/components/animations";

export const AssetsStep = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & PoolFormUtilities
>(
  (
    {
      className,
      watchMarketBuilderForm,
      setValueMarketBuilderForm,
      controlMarketBuilderForm,
      ...props
    },
    ref
  ) => {
    const [isAnimationDelayed, setIsAnimationDelayed] = React.useState(true);

    const { activeStep } = useMarketBuilderManager();

    useEffect(() => {
      if (activeStep === MarketBuilderSteps.assets.id) {
        setTimeout(() => {
          setIsAnimationDelayed(false);
        }, 1000);
      } else {
        setIsAnimationDelayed(true);
      }
    }, [activeStep]);

    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full max-w-3xl shrink-0 grow flex-col overflow-y-scroll",
          className,
          "contents"
        )}
        {...props}
      >
        <MotionWrapper>
          <div
            className={cn(
              "mt-5 flex flex-row items-center justify-between px-5"
            )}
          >
            <div></div>

            <TokenSelector
              watchMarketBuilderForm={watchMarketBuilderForm}
              setValueMarketBuilderForm={setValueMarketBuilderForm}
              controlMarketBuilderForm={controlMarketBuilderForm}
            />
          </div>
        </MotionWrapper>

        <div className="body-2 my-5 flex w-full max-w-3xl grow flex-col overflow-y-scroll border-b border-t border-divider">
          <MotionWrapper
            className="flex w-full grow flex-col gap-3  bg-z2 p-3"
            delay={0.2}
          >
            {watchMarketBuilderForm("assets").length > 0 &&
              watchMarketBuilderForm("assets").map((asset, index) => (
                <MotionWrapper
                  layout="position"
                  key={`deposit-steps:${asset.address}`}
                  layoutId={`deposit-steps:${asset.address}`}
                  delay={isAnimationDelayed ? 0.2 + 0.1 * (index + 1) : 0}
                >
                  <div
                    className={cn(
                      "body-2 flex h-fit w-full flex-col items-center space-y-3 rounded-xl border border-divider bg-white px-3 py-3 transition-all duration-200 ease-in-out hover:drop-shadow-md"
                    )}
                  >
                    <div className="flex w-full shrink-0 flex-row items-center justify-between space-x-2">
                      <div className="flex w-fit flex-row items-center space-x-2">
                        <TokenDisplayer
                          tokens={[
                            /**
                             * @TODO Strictly type this
                             */
                            // @ts-ignore
                            asset,
                          ]}
                          symbols={false}
                          imageClassName="h-8 w-8"
                        />

                        <div className="flex w-3/12 shrink-0 flex-col items-start">
                          <div className="body-2 text-primary">
                            {asset.symbol.toUpperCase()}
                          </div>
                          <div className="text-xs leading-5 text-tertiary">
                            {asset.address.slice(0, 6)}...
                            {asset.address.slice(-4)}
                          </div>
                        </div>
                      </div>

                      <div className="flex w-fit flex-row items-center space-x-3">
                        <div className="w-40">
                          <PriceTypeSelector
                            watchMarketBuilderForm={watchMarketBuilderForm}
                            controlMarketBuilderForm={controlMarketBuilderForm}
                            setValueMarketBuilderForm={
                              setValueMarketBuilderForm
                            }
                            assetIndex={index}
                          />
                        </div>

                        <ExternalLinkIcon
                          onClick={() => {
                            const explorerUrl = getExplorerUrl({
                              chainId: watchMarketBuilderForm("chain").id,
                              value: asset.address,
                              type: "address",
                            });

                            window.open(
                              explorerUrl,
                              "_blank",
                              "noopener,noreferrer"
                            );
                          }}
                          className="h-6 w-6 cursor-pointer text-tertiary transition-all duration-200 ease-in-out hover:text-secondary"
                        />
                        <Trash2Icon
                          onClick={() => {
                            const newAssets = watchMarketBuilderForm(
                              "assets"
                            ).filter((item) => item.address !== asset.address);

                            setValueMarketBuilderForm("assets", newAssets);
                          }}
                          className="h-6 w-6 cursor-pointer text-tertiary transition-all duration-200 ease-in-out hover:text-secondary"
                        />
                      </div>
                    </div>

                    <FallMotion
                      customKey={`price-type:${asset.address}:${asset.price_type}`}
                      height="2.5rem"
                      containerClassName="w-full"
                    >
                      <div className="h-10 w-full">
                        {asset.price_type === "hardcoded_price" ? (
                          <Input
                            Prefix={() => {
                              return (
                                <CircleDollarSignIcon className="h-5 w-5 text-tertiary" />
                              );
                            }}
                            Suffix={() => {
                              return (
                                <div className="h-full rounded-r-lg  bg-z2 pl-3 text-tertiary">
                                  {asset.symbol.toUpperCase()} / Incentive
                                </div>
                              );
                            }}
                            type="number"
                            containerClassName="bg-z2 grow divide-x divide-divider"
                            className="pl-3"
                            placeholder="Enter Asset Price"
                          />
                        ) : (
                          <div className="flex h-10 w-full flex-row place-content-center items-center space-x-3 rounded-lg border border-divider bg-z2 px-3 text-secondary">
                            <GrabIcon className="-mt-1 h-5 w-5" />
                            <div className="flex h-5 flex-col place-content-center items-center">
                              <span className="leading-5">
                                Drag & Drop uint256 return type of your contract
                                function.
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </FallMotion>
                  </div>
                </MotionWrapper>
              ))}
          </MotionWrapper>
        </div>

        {/* <MotionWrapper delay={0.1}>
        <div className="body-2 mt-5 flex h-fit w-full flex-col items-center divide-y divide-divider rounded-xl border border-divider bg-z2 text-secondary">
          <div className="flex w-full flex-row items-center divide-x divide-divider">
            <div className="h-full w-3/12 px-3 py-1">Token</div>
            <div className="h-full w-3/12 px-3 py-1">Price Type</div>
            <div className="h-full w-5/12 px-3 py-1">Price Per Incentive</div>
          </div>

          <div className="">
            <div></div>
          </div>
        </div>
      </MotionWrapper> */}
      </div>
    );
  }
);
