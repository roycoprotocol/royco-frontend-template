"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { useWaitForTransactionReceipt } from "wagmi";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useMarketBuilderManager } from "@/store";
import { MarketBuilderSteps } from "@/store";
import { BadgeLink } from "@/components/common";
import { MarketBuilderFormSchema } from "../../market-builder-form";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { getExplorerUrl } from "royco/utils";
import { api } from "@/app/api/royco";
import { CreateMarketBody } from "royco/api";

export const TransactionStep = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketBuilderForm: UseFormReturn<z.infer<typeof MarketBuilderFormSchema>>;
    txHash: `0x${string}` | undefined;
  }
>(({ className, txHash, marketBuilderForm, ...props }, ref) => {
  const {
    data: txData,
    isLoading: isTxConfirming,
    isSuccess: isTxConfirmed,
    status: txStatus,
  } = useWaitForTransactionReceipt({
    hash: txHash,
    query: {
      retry: true,
    },
  });

  const [marketCreationStatus, setMarketCreationStatus] = useState<
    "pending" | "success" | "error"
  >("pending");

  const { activeStep, setActiveStep } = useMarketBuilderManager();

  const [marketId, setMarketId] = useState<string | undefined>(undefined);

  const updateMarketUserdata = async () => {
    try {
      if (!txHash || !isTxConfirmed) {
        return;
      }

      const body: CreateMarketBody = {
        chainId: marketBuilderForm.watch("chain").id,
        marketType: marketBuilderForm.watch("action_type") === "recipe" ? 0 : 1,
        name: marketBuilderForm.watch("market_name"),
        description: marketBuilderForm.watch("market_description"),
        txHash: txHash,
      };

      const response = await api.marketControllerCreateMarket(body);

      setMarketId(response.data.data.marketId);

      setMarketCreationStatus("success");
    } catch (error) {
      console.log("Error in updateMarketUserdata", error);

      setMarketCreationStatus("error");
    }
  };

  const updateMarketCreationStatus = () => {
    if (isTxConfirming) {
      setMarketCreationStatus("pending");
    }
  };

  useEffect(() => {
    updateMarketCreationStatus();
  }, [isTxConfirming]);

  useEffect(() => {
    updateMarketUserdata();
  }, [txHash, isTxConfirmed]);

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col place-content-center items-center",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "relative h-[10rem] w-[10rem] transition-all duration-200 ease-in-out",
          marketCreationStatus === "pending" && "text-tertiary",
          marketCreationStatus === "error" && "text-error",
          marketCreationStatus === "success" && "text-success"
        )}
      >
        <div
          style={{
            animationDuration: "10s",
          }}
          className="absolute animate-spin"
        >
          <svg
            width="160"
            height="160"
            viewBox="0 0 160 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke="currentColor"
          >
            <rect
              x="1"
              y="1"
              width="158"
              height="158"
              rx="9999999"
              stroke="inherit"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="13 13"
            />
          </svg>
        </div>

        <AnimatePresence mode="sync">
          <motion.div
            key={`icon:market-creation-status:${marketCreationStatus}`}
            className="absolute flex h-full w-full flex-col place-content-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: [1, 0.8, 1] }}
            exit={{ opacity: 0 }}
            transition={{
              // opacity: {
              //   duration: 0.5,
              //   repeat: Infinity,
              //   ease: "easeOut",
              // },
              duration: 1,
            }}
          >
            {marketCreationStatus === "pending" && (
              <motion.svg
                key="tx-status:pending"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-hourglass h-16 w-16"
                initial={{
                  opacity: 0,
                }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.4,
                }}
              >
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  exit={{ pathLength: 0 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  d="M5 22h14"
                />
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  exit={{ pathLength: 0 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  d="M5 2h14"
                />
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  exit={{ pathLength: 0 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"
                />
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  exit={{ pathLength: 0 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"
                />
              </motion.svg>
            )}

            {marketCreationStatus === "error" && (
              <motion.svg
                key="tx-status:error"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-x h-16 w-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <motion.path
                  initial={{ pathLength: 0, pathOffset: -1 }}
                  animate={{ pathLength: 1, pathOffset: 0 }}
                  exit={{ pathLength: 0, pathOffset: -1 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  d="M18 6 6 18"
                />
                <motion.path
                  initial={{ pathLength: 0, pathOffset: 1 }}
                  animate={{ pathLength: 1, pathOffset: 0 }}
                  exit={{ pathLength: 0, pathOffset: 1 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  d="m6 6 12 12"
                />
              </motion.svg>
            )}

            {marketCreationStatus === "success" && (
              <motion.svg
                key="tx-status:success"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-check h-16 w-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <motion.path
                  initial={{ pathLength: 0, pathOffset: 1 }}
                  animate={{ pathLength: 1, pathOffset: 0 }}
                  exit={{ pathLength: 0, pathOffset: 1 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  d="M20 6 9 17l-5-5"
                />
              </motion.svg>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div
        key={`tx-status:title:${marketCreationStatus}`}
        className="mt-10 w-full text-center font-gt text-lg font-500 text-black"
      >
        {marketCreationStatus === "pending" && "Awaiting Confirmation"}
        {marketCreationStatus === "success" &&
          `Congrats ${marketBuilderForm.watch("market_name")} created!`}
        {marketCreationStatus === "error" && "Deployment Error"}
      </div>
      <div
        key={`tx-status:subtitle:${marketCreationStatus}`}
        className="mt-2 w-full text-center font-gt text-base font-300 text-secondary"
      >
        {marketCreationStatus === "pending" &&
          "Please wait, this might take a while. Do not navigate off this page until confirmation."}
        {marketCreationStatus === "success" && (
          <div className="max-w-[600px]">
            Newly deployed markets must be verified before becoming available to
            depositors.{" "}
            <motion.a
              href={getExplorerUrl({
                chainId: marketBuilderForm.watch("chain").id,
                value: txHash ?? "",
                type: "tx",
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="relative"
              whileHover="hover"
              initial="initial"
              animate="initial"
            >
              <motion.span>View transaction on explorer here.</motion.span>
              <motion.div
                className="absolute bottom-0 left-0 h-[1px] w-full origin-right bg-current"
                variants={{
                  initial: {
                    scaleX: 1,
                  },
                  hover: {
                    scaleX: 0,
                  },
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            </motion.a>
          </div>
        )}
        {marketCreationStatus === "error" && "Error while deploying market."}
      </div>

      {marketCreationStatus === "success" && (
        <div className="mt-2 flex flex-row items-center gap-3">
          <BadgeLink
            target="_blank"
            href={`/market/${marketBuilderForm.watch("chain").id}/${
              marketBuilderForm.watch("action_type") === "recipe" ? 0 : 1
            }/${marketId}`}
            text="View Market"
          />
        </div>
      )}

      <div>
        {marketCreationStatus === "error" && (
          <Button
            onClick={() => {
              setActiveStep(MarketBuilderSteps.info.id);
            }}
            className="mt-10 w-44"
          >
            Close
          </Button>
        )}
        {marketCreationStatus === "success" && (
          <Button
            onClick={() =>
              window.open("https://forms.gle/FzP4opTucTqHLD9v8", "_blank")
            }
            className="mt-10 px-5"
          >
            Next: Verify My Market
          </Button>
        )}
      </div>
    </div>
  );
});
