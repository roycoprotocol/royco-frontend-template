"use client";

import { cn } from "@/lib/utils";
import React, { useEffect } from "react";
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
import { getMarketIdFromEventLog } from "royco/market";

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

  const { activeStep, setActiveStep } = useMarketBuilderManager();

  const { market_id } = getMarketIdFromEventLog({
    chain_id: marketBuilderForm.watch("chain").id,
    market_type: marketBuilderForm.watch("action_type") === "recipe" ? 0 : 1,
    logs: txData?.logs,
  });

  // console.log("market_id decode is", market_id);

  // const isTxConfirming = true;
  // const isTxConfirmed = true;
  // const txStatus = "success";

  const updateMarketUserdata = async () => {
    try {
      if (!!market_id) {
        const response = await fetch("/api/market", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chain_id: marketBuilderForm.watch("chain").id,
            market_type:
              marketBuilderForm.watch("action_type") === "recipe" ? 0 : 1,
            tx_hash: txHash,
            id: `${marketBuilderForm.watch("chain").id}_${marketBuilderForm.watch("action_type") === "recipe" ? 0 : 1}_${market_id}`,
            name: marketBuilderForm.watch("market_name"),
            description: marketBuilderForm.watch("market_description"),
            // Add other data you want to send in the request body
          }),
        });

        await response.json();
      }
    } catch (error) {}
  };

  useEffect(() => {
    updateMarketUserdata();
  }, [market_id]); // Add market_id and txData as dependencies

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
          txStatus === "pending" && "text-tertiary",
          txStatus === "error" && "text-error",
          txStatus === "success" && "text-success"
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
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-dasharray="13 13"
            />
          </svg>
        </div>

        <AnimatePresence mode="sync">
          <motion.div
            key={`icon:offer-status:${txStatus}`}
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
            {txStatus === "pending" && (
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

            {txStatus === "error" && (
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

            {txStatus === "success" && (
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
        key={`tx-status:title:${txStatus}`}
        className="mt-10 w-full text-center font-gt text-lg font-500 text-black"
      >
        {txStatus === "pending" && "Awaiting Confirmation"}
        {txStatus === "success" &&
          `Congrats ${marketBuilderForm.watch("market_name")} created!`}
        {txStatus === "error" && "Deployment Error"}
      </div>
      <div
        key={`tx-status:subtitle:${txStatus}`}
        className="mt-2 w-full text-center font-gt text-base font-300 text-secondary"
      >
        {txStatus === "pending" &&
          "Please wait, this might take a while. Do not navigate off this page until confirmation."}
        {txStatus === "success" && (
          <div className="max-w-[600px]">
            Newly deployed markets must be verified before becoming available to
            depositors.{" "}
            <motion.a
              href={`/market/${marketBuilderForm.watch("chain").id}/${
                marketBuilderForm.watch("action_type") === "recipe" ? 0 : 1
              }/${market_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="relative"
              whileHover="hover"
              initial="initial"
              animate="initial"
            >
              <motion.span>View your market link here.</motion.span>
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
        {txStatus === "error" && "Error while deploying market."}
      </div>

      <div className="mt-2 flex flex-row items-center gap-3">
        <BadgeLink
          target="_blank"
          href={getExplorerUrl({
            chainId: marketBuilderForm.watch("chain").id,
            value: txHash ?? "",
            type: "tx",
          })}
          text="View on Explorer"
        />

        {/* {!!market_id && (
          <BadgeLink
            target="_blank"
            href={`/market/${marketBuilderForm.watch("chain").id}/${marketBuilderForm.watch("action_type") === "recipe" ? 0 : 1}/${market_id}`}
            text="Market Dashboard"
          />
        )} */}
      </div>

      <div>
        {txStatus === "error" && (
          <Button
            onClick={() => {
              setActiveStep(MarketBuilderSteps.info.id);
            }}
            className="mt-10 w-44"
          >
            Close
          </Button>
        )}
        {txStatus === "success" && (
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
