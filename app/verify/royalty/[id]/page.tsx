"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/app/api/royco";
import { LoadingCircle } from "@/components/animations/loading-circle";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

const Page = () => {
  const router = useRouter();

  const params = useParams();
  const id = params.id as string;

  const { isLoading, isError, isSuccess, error } = useQuery({
    queryKey: [
      "verify-royalty-account",
      {
        id,
      },
    ],
    queryFn: async () => {
      return api.userControllerVerifyUserEmail(id).then((res) => res.data);
    },
  });

  const verifyRoyaltyAccount = async () => {};

  const redirectToPortfolio = () => {
    setTimeout(() => {
      router.push("/portfolio");
    }, 3000);
  };

  useEffect(() => {
    if (!isLoading && !isError) {
      redirectToPortfolio();
    }
  }, [isLoading]);

  useEffect(() => {
    verifyRoyaltyAccount();
  }, [router]);

  return (
    <div className={cn("flex flex-col place-content-center items-center p-12")}>
      <div
        className={cn(
          "relative h-[10rem] w-[10rem] transition-all duration-200 ease-in-out",
          isLoading && "text-tertiary",
          isError && "text-error",
          isSuccess && "text-success"
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
            key={`icon:registration-status:${isLoading}`}
            className="absolute flex h-full w-full flex-col place-content-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: [1, 0.8, 1] }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1,
            }}
          >
            {isLoading && (
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

            {!isLoading && isError && (
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

            {isSuccess && (
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
        key={`tx-status:title:${isLoading}`}
        className="mt-10 w-full text-center font-gt text-lg font-500 text-black"
      >
        {isLoading && "Verifying Email..."}
        {isSuccess && `Welcome to Royco Royalty!`}
        {isError && "Link already used/expired."}
      </div>
      <div
        key={`tx-status:subtitle:${isLoading}`}
        className="mt-2 w-full text-center font-gt text-base font-300 text-secondary"
      >
        {isLoading &&
          "Please wait, this might take a while. We are verifying your account."}
        {isSuccess && "You will be redirected to Portfolio page shortly."}
        {(isError && (error as any)?.response?.data?.error?.message) ??
          "Verification failed"}
      </div>
    </div>
  );
};

export default Page;
