import { Draggable } from "@hello-pangea/dnd";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { FunctionFormSchema } from "../function-form";
import { MarketBuilderFormSchema } from "../market-builder-form";
import { motion } from "framer-motion";
import { GripVerticalIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContractDropdown } from "./contract-dropdown";

export function getStyle(style, snapshot) {
  if (!snapshot.isDragging) return {};
  if (!snapshot.isDropAnimating) {
    return style;
  }

  return {
    ...style,
    // cannot be 0, but make it super tiny
    transitionDuration: `0.00000001s`,
  };
}

export const ContractRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    contract: any;
    baseKey: string;
    index: number;
    clickedKey: string | null;
    setClickedKey: React.Dispatch<React.SetStateAction<string | null>>;
    functionForm: UseFormReturn<z.infer<typeof FunctionFormSchema>>;
    marketBuilderForm: UseFormReturn<z.infer<typeof MarketBuilderFormSchema>>;
  }
>(
  (
    {
      contract,
      baseKey,
      index,
      clickedKey,
      setClickedKey,
      functionForm,
      marketBuilderForm,
      ...props
    },
    ref
  ) => {
    return (
      <Draggable
        draggableId={baseKey}
        index={0}
        key={`${baseKey}:${index}`}
        disableInteractiveElementBlocking={true}
      >
        {(provided, snapshot) => (
          <li
            onClick={() => {
              if (snapshot.isDragging) return;

              if (contract.contract_name) {
                functionForm.setValue("contract_name", contract.contract_name);
              }

              if (contract.image) {
                functionForm.setValue("contract_image", contract.image);
              }

              setClickedKey(contract.id);
            }}
            tabIndex={0}
            key={`edit-selector:item:${contract.id}`}
            className="body-2 relative flex h-16 w-full shrink-0 cursor-pointer transition-all duration-200 ease-in-out hover:bg-white"
          >
            {`contract-list:${clickedKey}` === baseKey && (
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                }}
                className="absolute z-50 flex h-full w-full flex-col place-content-center items-center bg-success"
              ></motion.div>
            )}

            <div
              className={cn(
                "pointer-events-none absolute inset-0 z-20 w-full px-2 transition-all duration-500 ease-in-out"
              )}
            ></div>

            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 1, filter: "blur(0)" }}
              exit={{ opacity: 0, filter: "blur(2px)" }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
                type: "spring",
              }}
              ref={provided.innerRef}
              {...provided.draggableProps}
              style={getStyle(provided.draggableProps.style, snapshot)}
              className={cn(
                "absolute z-10 flex h-16 w-full flex-row items-center space-x-2 px-2",
                snapshot.isDragging &&
                  "z-50 cursor-grabbing rounded-xl border border-divider bg-white shadow-md"
              )}
            >
              <div
                {...provided.dragHandleProps}
                className="flex h-16 w-3 shrink-0 cursor-grab flex-col place-content-center items-center"
              >
                <GripVerticalIcon className="h-5 w-5 fill-tertiary text-tertiary" />
              </div>

              <div
                className={cn(
                  "flex w-full grow flex-col overflow-hidden",
                  "pl-1"
                )}
              >
                <div className="flex h-5 max-w-[90%] grow flex-row items-center ">
                  <div className="overflow-hidden truncate text-ellipsis text-base">
                    <span className="leading-5 text-black">
                      {contract.contract_name}
                    </span>
                  </div>

                  {/**
                   * Tag to verify that contract was added by Royco
                   *
                   * @notice Currently removed
                   */}
                  {contract.is_whitelisted === true && (
                    <div className="ml-1 flex h-5 w-5 shrink-0 flex-col place-content-center items-center drop-shadow-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-badge-check h-4 w-4 fill-success text-success"
                      >
                        <path
                          className=""
                          d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
                        />
                        <path className="stroke-white" d="m9 12 2 2 4-4" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="h-5 grow overflow-hidden truncate text-ellipsis lowercase">
                  <span className="text-xs leading-5 text-tertiary">
                    {contract.address.slice(0, 4)}...
                    {contract.address.slice(-4)}
                  </span>
                </div>
              </div>

              <div className="flex h-9 shrink-0 flex-col items-end">
                <ContractDropdown
                  chainId={marketBuilderForm.watch("chain").id}
                  address={contract.address as string}
                />
              </div>
            </motion.div>
          </li>
        )}
      </Draggable>
    );
  }
);
