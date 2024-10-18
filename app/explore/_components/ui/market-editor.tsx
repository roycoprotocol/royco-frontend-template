"use client";

import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { EllipsisVerticalIcon, ExternalLinkIcon } from "lucide-react";

import { TokenDisplayer } from "@/components/common";
import { AnimatePresence, motion } from "framer-motion";
import useMeasure from "react-use-measure";

import { ChevronLeftIcon } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Fragment, useEffect, useState } from "react";

import { useExplore } from "@/store";

import { ExploreCustomPoolParam } from "@/store/use-explore";
import { PopoverClose } from "@radix-ui/react-popover";
import { produce } from "immer";

const FormSchema = z.object({
  id: z.string(),
  fdv: z.coerce.number({
    message: "FDV is required to update AIP",
  }),
  dr: z.coerce.number().optional(),
});

const variants = {
  initial: (direction: number) => {
    return { x: `${110 * direction}%`, opacity: 0 };
  },
  active: { x: "0%", opacity: 1 },
  exit: (direction: number) => {
    return { x: `${-110 * direction}%`, opacity: 0 };
  },
};

export const PoolEditor = ({
  market,
}: {
  market: any; // @TODO: TypedMarketInstance
}) => {
  const { exploreCustomPoolParams, setExploreCustomPoolParams } = useExplore();

  const [tokenDetails, setTokenDetails] = useState<{
    id: string;
    fdv: number;
    dr: number;
  } | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  let [ref, bounds] = useMeasure();
  const [status, setStatus] = useState<"info" | "edit">("info");
  const [direction, setDirection] = useState(1);

  const [updateSubmitted, setUpdateSubmitted] = useState(false);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const token_row: ExploreCustomPoolParam = {
      id: data.id,
      type: "token",
      value: data.fdv,
      ref: null,
    };

    let rows = [token_row];
    if (data.dr) {
      const market_row: ExploreCustomPoolParam = {
        id: market.id,
        type: "market",
        value: data.dr / 100,
        ref: data.id,
      };

      rows.push(market_row);
    }

    const currentExploreCustomPoolParams: Array<ExploreCustomPoolParam> =
      exploreCustomPoolParams.filter(
        (row) => row.id !== data.id && (!data.dr || row.id !== market.id)
      );

    setExploreCustomPoolParams(
      produce(currentExploreCustomPoolParams, (draft) => {
        draft.push(...rows);
      })
    );

    setDirection(1);
    setUpdateSubmitted(true);
  };

  useEffect(() => {
    if (updateSubmitted) {
      setTimeout(() => {
        setUpdateSubmitted(false);
      }, 1500);
    }
  }, [updateSubmitted]);

  return (
    <Popover key={`market-editor:aip:${market.id}`}>
      <PopoverTrigger asChild>
        <Button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="ml-1 h-5 w-5 bg-transparent p-0"
        >
          <EllipsisVerticalIcon
            className={cn(
              "h-4 w-4 text-black opacity-0 transition-all duration-200 ease-in-out hover:text-primary group-hover:opacity-100"
            )}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={cn(
          "h-auto overflow-hidden px-0 py-2",
          status === "info" && "w-80",
          status === "edit" && "w-96"
        )}
      >
        <motion.div
          animate={{ height: bounds.height, width: bounds.width }}
          className={cn("body-2 overflow-hidden bg-white")}
        >
          <div
            ref={ref}
            className={cn(
              "relative h-auto overflow-hidden px-4",
              status === "info" && "w-80",
              status === "edit" && "w-96"
            )}
          >
            <AnimatePresence
              mode="popLayout"
              initial={false}
              custom={direction}
            >
              <motion.div
                key={`edit-market-table:${status}`}
                variants={variants}
                initial="initial"
                animate="active"
                exit="exit"
                custom={direction}
                transition={{
                  duration: 0.5,
                  bounce: 0,
                  type: "spring",
                }}
              >
                {status === "info" && (
                  <div className="grid w-full grid-cols-1 divide-y divide-divider">
                    <div className="pb-2">Incentives</div>

                    {market.incentives_info.map((incentive, index) => {
                      return (
                        <div
                          key={incentive.id}
                          className="flex flex-row items-center justify-between space-x-5 py-2"
                        >
                          <div className="flex flex-row items-center space-x-2">
                            <TokenDisplayer
                              className="text-secondary"
                              tokens={[incentive]}
                              symbols={true}
                            />

                            <Button
                              onClick={() => {
                                setDirection(1);
                                setStatus("edit");
                                setTokenDetails({
                                  id: incentive.id,
                                  fdv: market.incentives_fdv[index],
                                  dr: market.incentives_dr[index],
                                });
                                form.setValue("id", incentive.id);
                              }}
                              className="h-5 w-fit rounded-[0.25rem] bg-[#0F172A]/50 px-2 text-[0.625rem] font-normal"
                            >
                              Edit
                            </Button>
                          </div>

                          <div className="h-5 tabular-nums text-primary">
                            <span className="leading-5">
                              +
                              {Intl.NumberFormat("en-US", {
                                style: "percent",
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                                // @ts-ignore
                              }).format(market.aip_info[index].aip / 100)}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    <div className="flex flex-row items-center justify-between space-x-3 pb-2 pt-2 font-medium text-success">
                      <div className="h-5">
                        <span className="leading-5">Net AIP</span>
                      </div>

                      <div className="h-5 tabular-nums">
                        <span className="leading-5">
                          +
                          {Intl.NumberFormat("en-US", {
                            style: "percent",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            // @ts-ignore
                          }).format(
                            market.aip_info.reduce(
                              (sum, info) => sum + (info.aip || 0),
                              0
                            ) / 100
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {status === "edit" && (
                  <Fragment>
                    <div className="grid grid-cols-1 divide-y divide-divider py-5">
                      <button
                        onClick={() => {
                          setDirection(-1);
                          setStatus("info");
                        }}
                        className="flex flex-row items-center space-x-1 pb-2"
                      >
                        <ChevronLeftIcon
                          strokeWidth={1.5}
                          className="h-5 w-5"
                        />
                        <div className="h-5">
                          <span className="leading-5">
                            Set FDV & Points Assumptions
                          </span>
                        </div>
                      </button>

                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="caption p-0 text-secondary"
                        >
                          <div className="pt-3">
                            Set the assumptions below to update the net AIP.
                          </div>

                          {/**
                           * @description FDV
                           */}
                          <FormField
                            control={form.control}
                            name="fdv"
                            render={({ field }) => (
                              <FormItem className="mt-5">
                                <FormLabel className={cn("caption")}>
                                  Fully diluted valuation (FDV)
                                </FormLabel>
                                <FormControl>
                                  <div className="flex w-full flex-row items-center rounded-md border border-divider">
                                    <Input
                                      type="number"
                                      containerClassName="border-none shrink-0 flex-grow"
                                      placeholder={`${Intl.NumberFormat(
                                        "en-US",
                                        {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        }
                                      ).format(tokenDetails?.fdv || 0)}`}
                                      {...field}
                                    />
                                  </div>
                                </FormControl>

                                {/* <FormMessage /> */}
                              </FormItem>
                            )}
                          />

                          {/**
                           * @description FDV
                           */}
                          <FormField
                            control={form.control}
                            name="dr"
                            render={({ field }) => (
                              <FormItem className="mt-5">
                                <FormLabel className={cn("caption")}>
                                  % of network allocated to the campaign
                                </FormLabel>
                                <FormControl>
                                  <div className="flex w-full flex-row items-center rounded-md border border-divider">
                                    <Input
                                      type="number"
                                      containerClassName="border-none shrink-0 flex-grow"
                                      placeholder={`${tokenDetails?.dr.toFixed(2)} %`}
                                      {...field}
                                    />
                                  </div>
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <AnimatePresence mode="wait">
                            <motion.div
                              onClick={async (e) => {
                                onSubmit(form.getValues());
                              }}
                              // disabled={updateSubmitted}
                              className={cn(
                                "relative mt-5 shrink-0 overflow-hidden rounded-md bg-white transition-all duration-200 ease-in-out hover:bg-focus"
                              )}
                            >
                              <motion.div className="body-2 flex cursor-pointer flex-row place-content-center items-center space-x-[6px] overflow-hidden bg-black px-2 py-2 transition-all duration-200 ease-in-out hover:opacity-80">
                                <PopoverClose asChild>
                                  <div className="body-2 h-5  text-white">
                                    <span className="leading-5">
                                      Update AIP
                                    </span>
                                  </div>
                                </PopoverClose>
                              </motion.div>

                              <AnimatePresence mode="sync">
                                {updateSubmitted && (
                                  <motion.div
                                    layout
                                    layoutId="success"
                                    key="success"
                                    initial={{ y: "-2.25rem", opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: "2.25rem", opacity: 1 }}
                                    transition={{
                                      type: "spring",
                                      ease: "easeOut",
                                      bounce: 0,
                                      duration: 0.4,
                                    }}
                                    className="absolute top-0 flex h-9 w-full flex-col place-content-center items-center overflow-hidden rounded-md bg-success"
                                  >
                                    <motion.svg
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ opacity: 0.5 }}
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="20"
                                      height="20"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="white"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="lucide lucide-circle-check-big"
                                    >
                                      <motion.path
                                        d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 0.2 }}
                                      />
                                      <motion.path
                                        d="m9 11 3 3L22 4"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{
                                          duration: 0.3,
                                          delay: 0.2,
                                        }}
                                      />
                                    </motion.svg>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          </AnimatePresence>
                        </form>
                      </Form>
                    </div>
                  </Fragment>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
};
