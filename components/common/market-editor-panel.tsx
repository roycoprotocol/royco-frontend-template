import { EnrichedMarketDataType } from "royco/hooks";
import { ExploreCustomPoolParam, useExplore } from "@/store/use-explore";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BadgeCheckIcon,
  ChevronLeftIcon,
  CircleHelpIcon,
  CircleXIcon,
} from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import useMeasure from "react-use-measure";
import { Popover } from "../ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";

const FormSchema = z.object({
  id: z.string(),
  fdv: z.coerce.number({
    message: "FDV is required to update the data.",
  }),
  dr: z.coerce.number().optional(),
});

export const MarketEditorPanel = ({
  market,
  setDirection,
  status,
  setStatus,
  tokenDetails,
  setTokenDetails,
  label,
}: {
  market: EnrichedMarketDataType;
  setDirection: (direction: number) => void;
  status: "info" | "edit" | "success";
  setStatus: (status: "info" | "edit" | "success") => void;
  tokenDetails: {
    id: string;
    fdv: number;
    dr: number;
  } | null;
  setTokenDetails: (
    tokenDetails: {
      id: string;
      fdv: number;
      dr: number;
    } | null
  ) => void;
  label: string;
}) => {
  const { exploreCustomPoolParams, setExploreCustomPoolParams } = useExplore();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: tokenDetails?.id ?? "",
    },
  });

  const [updateSubmitted, setUpdateSubmitted] = useState(false);

  const [help, setHelp] = useState(false);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setUpdateSubmitted(true);

    setTimeout(() => {
      const event = new KeyboardEvent("keydown", {
        key: "Escape",
        code: "Escape",
        keyCode: 27,
        charCode: 27,
        bubbles: true,
      });

      document.dispatchEvent(event);
    }, 500);

    setTimeout(() => {
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

      // const currentExploreCustomPoolParams: Array<ExploreCustomPoolParam> =
      //   exploreCustomPoolParams.filter(
      //     (row) => row.id !== data.id && (!data.dr || row.id !== market.id)
      //   );

      const currentExploreCustomPoolParams: Array<ExploreCustomPoolParam> =
        exploreCustomPoolParams.filter((row) => {
          // Check if row.id is not equal to data.id
          const condition1 = row.id !== data.id;

          // Check if row.id is not equal to market.id when data.dr is present and ref is equal to data.id
          const condition2 = !(
            data.dr &&
            row.id === market.id &&
            row.ref === data.id
          );

          // Return true if both conditions are met
          return condition1 && condition2;
        });

      setExploreCustomPoolParams([...currentExploreCustomPoolParams, ...rows]);

      setStatus("info");
    }, 501);
  };

  const { setValue, watch } = form;

  return (
    <Fragment>
      <div className="relative grid grid-cols-1 p-3">
        <AnimatePresence mode="popLayout">
          {updateSubmitted === true && (
            <motion.div
              key="update-submitted"
              initial={{ opacity: 0, y: "-100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "-100%" }}
              className="absolute z-10 h-full w-full bg-white"
            >
              <div className="absolute z-20  flex h-full w-full flex-col place-content-center items-center">
                <motion.svg
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-badge-check h-16 w-16 fill-success"
                >
                  <motion.path
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                      ease: "linear",
                    }}
                    className="stroke-success/20"
                    d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
                  />
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.2 }}
                    className="stroke-white"
                    d="m9 12 2 2 4-4"
                  />
                </motion.svg>
              </div>

              <div className="h-full w-full bg-focus blur-xl "></div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="popLayout">
          {help === true && (
            <motion.div
              key="help-box"
              initial={{ opacity: 0, y: "-100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "-100%" }}
              className="absolute z-10 h-full w-full overflow-y-scroll bg-white"
            >
              <div className="flex h-full w-full flex-col bg-z2 p-3">
                <div className="flex flex-row items-center justify-between">
                  <div className="subtitle-1 text-primary">Calculations</div>

                  <div>
                    <CircleXIcon
                      className="h-5 w-5 cursor-pointer"
                      onClick={() => setHelp(false)}
                    />
                  </div>
                </div>

                <div className="subtitle-2 mt-5 text-secondary">Variables</div>
                <div className="mt-1 flex flex-col space-y-0 font-mono text-sm tabular-nums">
                  <div className="">
                    x: Percent of the network being distributed in the campaign
                  </div>
                  <div className="">z: Market size (total staked amount)</div>
                  <div className="">h: Campaign duration in months</div>
                  <div className="">FDV: Fully Diluted Valuation</div>
                </div>

                <div className="subtitle-2 mt-5 text-secondary">Formulas</div>
                <div className="mt-1 flex flex-col space-y-0 font-mono text-sm tabular-nums">
                  <div className="">Rewards: FDV * netowrk allocation (%)</div>
                  <div className="">Annualized Rewards: rewards * (12 / h)</div>
                  <div className="">Yield: (rewards_annualized / z) * 100</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-row items-center justify-between space-x-1 border-b border-divider pb-2">
          <div
            onClick={(e) => {
              setDirection(-1);
              setStatus("info");
              e.stopPropagation();
            }}
            className="flex cursor-pointer flex-row items-center space-x-1 transition-all duration-200 ease-in-out hover:text-primary"
          >
            <ChevronLeftIcon strokeWidth={1.5} className="h-5 w-5" />
            <div className="h-5">
              <span className="leading-5">Set FDV & Points Assumptions</span>
            </div>
          </div>
          <div
            onClick={() => {
              setHelp(!help);
            }}
            className="flex cursor-pointer flex-row items-center space-x-1 transition-all duration-200 ease-in-out hover:text-primary"
          >
            <CircleHelpIcon strokeWidth={1.5} className="h-5 w-5" />
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="caption p-0 text-secondary"
          >
            <div className="pt-3">
              Set the assumptions below to update the net {label}.
            </div>

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
                        autoFocus
                        id="test"
                        onClick={() => {
                          // focus this input on click
                          const input = document.getElementById("test");
                          if (input) {
                            input.focus();
                          }
                        }}
                        type="number"
                        containerClassName="border-none shrink-0 flex-grow"
                        placeholder={`${Intl.NumberFormat("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 8,
                        }).format(tokenDetails?.fdv || 0)}`}
                        value={watch("fdv") || ""}
                        onChange={(e) => {
                          setValue("fdv", parseFloat(e.target.value));
                        }}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

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
                        value={watch("dr") || ""}
                        onChange={(e) => {
                          setValue("dr", parseFloat(e.target.value));
                        }}
                      />
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className={cn(updateSubmitted === true && "opacity-0")}>
              <Button type="submit" className={cn("mt-5")}>
                Update {label}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Fragment>
  );
};
