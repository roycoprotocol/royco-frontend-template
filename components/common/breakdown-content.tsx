"use client";

import { TooltipContent } from "../ui/tooltip";
import { createPortal } from "react-dom";

import type {
  IncentiveInfo,
  AipInfo,
  AssetInfo,
  EnrichedMarketDataType,
} from "@/sdk/hooks";
import { cn } from "@/lib/utils";
import { TokenDisplayer } from "./token-displayer";
import { SquarePenIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { MarketEditorPanel } from "./market-editor-panel";

const variants = {
  initial: (direction: number) => {
    return {
      x: `${110 * direction}%`,
      opacity: 0,
      filter: `blur(${direction === 0 ? 0 : 10}px)`,
    };
  },
  active: { x: "0%", opacity: 1, filter: "blur(0px)" },
  exit: (direction: number) => {
    return {
      x: `${-110 * direction}%`,
      opacity: 0,
      filter: `blur(${direction === 0 ? 0 : 10}px)`,
    };
  },
};

type BreakdownWrapperProps = {
  customKey: string;
  direction: number;
  status: string;
  breakdown: any;
  setDirection: (direction: number) => void;
} & React.HTMLAttributes<HTMLDivElement>;

const BreakdownWrapper = React.forwardRef<
  HTMLDivElement,
  BreakdownWrapperProps
>(
  (
    {
      className,
      customKey,
      direction,
      setDirection,
      children,
      status,
      breakdown,
      ...props
    },
    ref
  ) => {
    const [renderNumber, setRenderNumber] = useState<number>(0);

    useEffect(() => {
      setRenderNumber(renderNumber + 1);
    }, [direction]);

    return (
      <TooltipContent
        key={`${customKey}:breakdown:timestamp:${Date.now()}`}
        className={cn("body-2 bg-white p-0", !!breakdown ? "" : "hidden")}
        onMouseLeave={() => {
          setDirection(0);
        }}
        onEscapeKeyDown={() => {
          setDirection(0);
        }}
        onPointerDownOutside={() => {
          setDirection(0);
        }}
        onReset={() => {
          setDirection(0);
        }}
        {...props}
      >
        <AnimatePresence
          custom={direction}
          initial={direction === 0 ? false : true}
          mode="popLayout"
        >
          <motion.div
            onClick={(e) => {
              e.stopPropagation();
            }}
            key={`${customKey}-breakdown:${status}`}
            variants={variants}
            initial="initial"
            animate="active"
            exit="exit"
            custom={direction}
            transition={{
              duration: 0.3,
              bounce: 0,
              type: "spring",
            }}
            className="block h-fit w-fit"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </TooltipContent>
    );
  }
);

const BreakdownEditButton = ({ ...props }) => {
  /**
   * @TODO Replace div with button
   * @issue Button is showing a ring on click, it needs to be removed
   */
  return (
    <div
      {...props}
      className="cursor-pointer text-secondary duration-200 ease-in-out hover:text-black"
    >
      <SquarePenIcon strokeWidth={1.5} className="h-5 w-5" />
    </div>
  );
};

export const IncentiveBreakdown = ({
  noEdit,
  containerRef,
  market,
  breakdown,
}: {
  noEdit?: boolean;
  containerRef?: React.RefObject<HTMLDivElement>;
  market: EnrichedMarketDataType;
  breakdown: IncentiveInfo[] | null;
}) => {
  /**
   * @description Management states
   */
  const [status, setStatus] = useState<"info" | "edit" | "success">("info");
  const [direction, setDirection] = useState<number>(0);
  const [tokenDetails, setTokenDetails] = useState<{
    id: string;
    fdv: number;
    dr: number;
  } | null>(null);

  // if (!containerRef?.current) {
  //   // If the containerRef is not available, return null to avoid rendering errors.
  //   return null;
  // }

  return createPortal(
    <BreakdownWrapper
      customKey="incentive"
      direction={direction}
      setDirection={setDirection}
      status={status}
      breakdown={breakdown}
    >
      {status === "info" && !!breakdown && (
        <div className="body-2 grid grid-cols-1 gap-3 px-3 py-3 font-gt text-secondary">
          {breakdown.map((incentives_info: IncentiveInfo, index: number) => {
            return (
              <div
                key={`breakdown:incentive-info:${incentives_info.id}`}
                className="flex h-5 flex-row items-center justify-between space-x-4"
              >
                <TokenDisplayer
                  className="text-secondary"
                  tokens={[incentives_info]}
                  symbols={true}
                />

                <div className="flex flex-row items-center space-x-2">
                  <div className="h-5">
                    <span className="leading-5">
                      {Intl.NumberFormat("en-US", {
                        style: incentives_info.token_amount_usd
                          ? "currency"
                          : undefined,
                        currency: incentives_info.token_amount_usd
                          ? "USD"
                          : undefined,
                        notation: "compact",
                        useGrouping: true,
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(
                        incentives_info.token_amount_usd ||
                          incentives_info.token_amount
                      )}
                    </span>
                  </div>

                  {/**
                   * @TODO Replace div with button
                   * @issue Button is showing a ring on click, it needs to be removed
                   */}
                  {noEdit ? null : (
                    <BreakdownEditButton
                      onClick={(e: any) => {
                        setTokenDetails({
                          id: incentives_info.id,
                          fdv: market.incentives_fdv[index],
                          dr: market.incentives_dr[index],
                        });

                        setDirection(1);
                        setStatus("edit");
                        e.stopPropagation();
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/**
       * @description Market Editor Panel
       */}
      {(status === "edit" || status === "success") && (
        <div key="market-editor-panel" className="min-w-96">
          <MarketEditorPanel
            label="Rewards"
            market={market}
            setDirection={setDirection}
            tokenDetails={tokenDetails}
            setTokenDetails={setTokenDetails}
            status={status}
            setStatus={setStatus}
          />
        </div>
      )}
    </BreakdownWrapper>,
    /**
     * @TODO fix low priority issue
     * @description There's a type mismatch between the ref object and the document.body
     */
    // @ts-ignore
    containerRef && containerRef.current ? containerRef.current : document.body
  );
};

export const AipBreakdown = ({
  noEdit,
  containerRef,
  breakdown,
}: {
  noEdit?: boolean;
  containerRef?: React.RefObject<HTMLDivElement>;
  breakdown: AipInfo[] | null;
}) => {
  /**
   * @description Management states
   */
  const [status, setStatus] = useState<"info" | "edit" | "success">("info");
  const [direction, setDirection] = useState<number>(0);
  const [tokenDetails, setTokenDetails] = useState<{
    id: string;
    fdv: number;
    dr: number;
  } | null>(null);

  // if (!containerRef?.current) {
  //   // If the containerRef is not available, return null to avoid rendering errors.
  //   return null;
  // }

  return createPortal(
    <BreakdownWrapper
      customKey="aip"
      direction={direction}
      status={status}
      breakdown={breakdown}
      setDirection={setDirection}
    >
      {status === "info" && !!breakdown && (
        <div className="body-2 grid grid-cols-1 gap-3 px-3 py-3 font-gt text-secondary">
          {breakdown.map((aip_info: AipInfo, index: number) => {
            return (
              <div
                key={`breakdown:aip-info:${aip_info.id}`}
                className="flex h-5 flex-row items-center justify-between space-x-4"
              >
                <TokenDisplayer
                  className="text-secondary"
                  tokens={[aip_info]}
                  symbols={true}
                />

                <div className="flex flex-row items-center space-x-2">
                  <div className="h-5">
                    <span className="leading-5">
                      {!!aip_info.annual_change_ratio &&
                      aip_info.annual_change_ratio !== Math.pow(10, 18)
                        ? Intl.NumberFormat("en-US", {
                            style: "percent",
                            notation: "compact",
                            useGrouping: true,
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(aip_info.annual_change_ratio)
                        : "N/D"}
                    </span>
                  </div>

                  {/**
                   * @TODO Replace div with button
                   * @issue Button is showing a ring on click, it needs to be removed
                   */}
                  {noEdit ? null : (
                    <BreakdownEditButton
                      onClick={(e: any) => {
                        setTokenDetails({
                          id: aip_info.id,
                          fdv: aip_info.fdv ?? 0,
                          dr: 0,
                        });

                        setDirection(1);
                        setStatus("edit");
                        e.stopPropagation();
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/**
       * @description Market Editor Panel
       */}
      {/* {(status === "edit" || status === "success") && (
        <div ref={containerRef} key="market-editor-panel" className="min-w-96">
          <MarketEditorPanel
            label="AIP"
            market={market}
            setDirection={setDirection}
            tokenDetails={tokenDetails}
            setTokenDetails={setTokenDetails}
            status={status}
            setStatus={setStatus}
          />
        </div>
      )} */}
    </BreakdownWrapper>,
    /**
     * @TODO fix low priority issue
     * @description There's a type mismatch between the ref object and the document.body
     */
    // @ts-ignore
    containerRef && containerRef.current ? containerRef.current : document.body
  );
};

export const AssetBreakdown = ({
  noEdit,
  containerRef,
  market,
  breakdown,
}: {
  noEdit?: boolean;
  containerRef?: React.RefObject<HTMLDivElement>;
  market: EnrichedMarketDataType;
  breakdown: AssetInfo[] | null;
}) => {
  /**
   * @description Management states
   */
  const [status, setStatus] = useState<"info" | "edit" | "success">("info");
  const [direction, setDirection] = useState<number>(0);
  const [tokenDetails, setTokenDetails] = useState<{
    id: string;
    fdv: number;
    dr: number;
  } | null>(null);

  // if (!containerRef?.current) {
  //   // If the containerRef is not available, return null to avoid rendering errors.
  //   return null;
  // }

  return createPortal(
    <BreakdownWrapper
      customKey="asset"
      direction={direction}
      setDirection={setDirection}
      status={status}
      breakdown={breakdown}
    >
      {status === "info" && !!breakdown && (
        <div className="body-2 grid grid-cols-1 gap-3 px-3 py-3 font-gt text-secondary">
          {breakdown.map((asset_info: AssetInfo, index: number) => {
            return (
              <div
                key={`breakdown:asset-info:${asset_info.id}`}
                className="flex h-5 flex-row items-center justify-between space-x-4"
              >
                <TokenDisplayer
                  className="text-secondary"
                  tokens={[asset_info]}
                  symbols={true}
                />

                <div className="flex flex-row items-center space-x-2">
                  <div className="h-5">
                    <span className="leading-5">
                      {new Intl.NumberFormat("en-US", {
                        style: asset_info.tvl_usd ? "currency" : undefined,
                        currency: asset_info.tvl_usd ? "USD" : undefined,
                        notation: "compact",
                        useGrouping: true,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(asset_info.tvl_usd || asset_info.tvl)}
                    </span>
                  </div>

                  {/**
                   * @TODO Replace div with button
                   * @issue Button is showing a ring on click, it needs to be removed
                   */}
                  {noEdit ? null : (
                    <BreakdownEditButton
                      onClick={(e: any) => {
                        setTokenDetails({
                          id: asset_info.id,
                          fdv: market.assets_fdv[index],
                          dr: market.assets_dr[index],
                        });

                        setDirection(1);
                        setStatus("edit");
                        e.stopPropagation();
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/**
       * @description Market Editor Panel
       */}
      {(status === "edit" || status === "success") && (
        <div key="market-editor-panel" className="min-w-96">
          <MarketEditorPanel
            label="Assets"
            market={market}
            setDirection={setDirection}
            tokenDetails={tokenDetails}
            setTokenDetails={setTokenDetails}
            status={status}
            setStatus={setStatus}
          />
        </div>
      )}
    </BreakdownWrapper>,
    /**
     * @TODO fix low priority issue
     * @description There's a type mismatch between the ref object and the document.body
     */
    // @ts-ignore
    containerRef && containerRef.current ? containerRef.current : document.body
  );
};
