"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import {
  useMarketBuilder,
  useMarketBuilderManager,
  useSelectionMenu,
} from "@/store";
import { GripVerticalIcon } from "lucide-react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { ContractDropdown } from "./contract-dropdown";
import { FunctionFormSchema, FunctionFormUtilities } from "../function-form";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { MarketBuilderFormSchema } from "../market-builder-form";
import { useFunctionForm } from "@/store/use-function-form";
import { ContractRow } from "./contract-row";
import { PinnedContracts } from "./pinned-contracts";

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

export type ContractListProps = {
  data: any;
};

export const ContractList = React.forwardRef<
  HTMLDivElement,
  ContractListProps &
    React.HTMLAttributes<HTMLDivElement> & {
      functionForm: UseFormReturn<z.infer<typeof FunctionFormSchema>>;
      marketBuilderForm: UseFormReturn<z.infer<typeof MarketBuilderFormSchema>>;
    }
>(({ className, data, marketBuilderForm, functionForm, ...props }, ref) => {
  const [focusedKey, setFocusedKey] = useState<null | string>(null);
  const [copied, setCopied] = useState<null | string>(null);
  const [clickedKey, setClickedKey] = useState<null | string>(null);

  const { updateAbi, setUpdateAbi } = useFunctionForm();

  const { sorting, filters, searchKey, draggingId, setDraggingId } =
    useSelectionMenu();

  const { dragData, setDragData } = useMarketBuilder();

  const { setIsContractAddressUpdated } = useMarketBuilderManager();

  const resetClickedKey = () => {
    if (clickedKey !== null) {
      const [chain_id, address] = clickedKey.split("-");

      setIsContractAddressUpdated(true);

      setTimeout(() => {
        setUpdateAbi(!updateAbi);
        functionForm.setValue("placeholder_contract_address", address);
        functionForm.setValue("contract_address", address as `0x${string}`);
      }, 200);

      setTimeout(() => {
        setClickedKey(null);
      }, 500);
    }
  };

  const changeDragData = () => {
    if (draggingId !== null && dragData === null) {
      const newDragData: any = data.find(
        (contract) => `contract-list:${contract.id}` === draggingId
      );

      if (newDragData) {
        setDragData({
          ...newDragData,
          dataTypes: ["address", "abi"],
        });
      } else {
        setDragData(undefined);
      }
    }
  };

  useEffect(() => {
    resetClickedKey();
  }, [clickedKey]);

  useEffect(() => {
    changeDragData();
  }, [draggingId]);

  return (
    <div ref={ref} className={cn("", className)} {...props}>
      <PinnedContracts
        clickedKey={clickedKey}
        setClickedKey={setClickedKey}
        functionForm={functionForm}
        marketBuilderForm={marketBuilderForm}
      />

      <AnimatePresence>
        <Droppable droppableId="contract-list" isDropDisabled={true}>
          {(droppableProvided) => (
            <ul
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
              className="flex grow flex-col overflow-x-hidden overflow-y-scroll"
            >
              {!!data &&
                data.map(
                  (
                    // @ts-ignore
                    contract,
                    // @ts-ignore
                    index
                  ) => {
                    const baseKey = `contract-list:${contract.id}`;

                    return (
                      <ContractRow
                        contract={contract}
                        baseKey={baseKey}
                        index={index}
                        clickedKey={clickedKey}
                        setClickedKey={setClickedKey}
                        functionForm={functionForm}
                        marketBuilderForm={marketBuilderForm}
                      />
                    );

                    // return (
                    //   <Draggable
                    //     draggableId={baseKey}
                    //     index={0}
                    //     key={`${baseKey}:${index}`}
                    //     disableInteractiveElementBlocking={true}
                    //   >
                    //     {(provided, snapshot) => (
                    //       <li
                    //         onClick={() => {
                    //           if (snapshot.isDragging) return;

                    //           if (contract.contract_name) {
                    //             functionForm.setValue(
                    //               "contract_name",
                    //               contract.contract_name
                    //             );
                    //           }

                    //           if (contract.image) {
                    //             functionForm.setValue(
                    //               "contract_image",
                    //               contract.image
                    //             );
                    //           }

                    //           setClickedKey(contract.id);
                    //         }}
                    //         tabIndex={0}
                    //         key={`edit-selector:item:${contract.id}`}
                    //         className="body-2 relative flex h-16 w-full shrink-0 cursor-pointer transition-all duration-200 ease-in-out hover:bg-white"
                    //       >
                    //         {`contract-list:${clickedKey}` === baseKey && (
                    //           <motion.div
                    //             initial={{ x: "-100%" }}
                    //             animate={{ x: "100%" }}
                    //             transition={{
                    //               duration: 0.4,
                    //               ease: "easeOut",
                    //             }}
                    //             className="absolute z-50 flex h-full w-full flex-col place-content-center items-center bg-success"
                    //           ></motion.div>
                    //         )}

                    //         <div
                    //           className={cn(
                    //             "pointer-events-none absolute inset-0 z-20 w-full px-2 transition-all duration-500 ease-in-out"
                    //           )}
                    //         ></div>

                    //         <motion.div
                    //           initial={{ opacity: 1 }}
                    //           animate={{ opacity: 1, filter: "blur(0)" }}
                    //           exit={{ opacity: 0, filter: "blur(2px)" }}
                    //           transition={{
                    //             duration: 0.2,
                    //             ease: "easeInOut",
                    //             type: "spring",
                    //           }}
                    //           ref={provided.innerRef}
                    //           {...provided.draggableProps}
                    //           style={getStyle(
                    //             provided.draggableProps.style,
                    //             snapshot
                    //           )}
                    //           className={cn(
                    //             "absolute z-10 flex h-16 w-full flex-row items-center space-x-2 px-2",
                    //             snapshot.isDragging &&
                    //               "z-50 cursor-grabbing rounded-xl border border-divider bg-white shadow-md"
                    //           )}
                    //         >
                    //           <div
                    //             {...provided.dragHandleProps}
                    //             className="flex h-16 w-3 shrink-0 cursor-grab flex-col place-content-center items-center"
                    //           >
                    //             <GripVerticalIcon className="h-5 w-5 fill-tertiary text-tertiary" />
                    //           </div>

                    //           <div
                    //             className={cn(
                    //               "flex w-full grow flex-col overflow-hidden",
                    //               "pl-1"
                    //             )}
                    //           >
                    //             <div className="flex h-5 max-w-[90%] grow flex-row items-center ">
                    //               <div className="overflow-hidden truncate text-ellipsis text-base">
                    //                 <span className="leading-5 text-black">
                    //                   {contract.contract_name}
                    //                 </span>
                    //               </div>

                    //               {/**
                    //                * Tag to verify that contract was added by Royco
                    //                *
                    //                * @notice Currently removed
                    //                */}
                    //               {contract.is_whitelisted === true && (
                    //                 <div className="ml-1 flex h-5 w-5 shrink-0 flex-col place-content-center items-center drop-shadow-sm">
                    //                   <svg
                    //                     xmlns="http://www.w3.org/2000/svg"
                    //                     width="24"
                    //                     height="24"
                    //                     viewBox="0 0 24 24"
                    //                     fill="none"
                    //                     stroke="currentColor"
                    //                     strokeWidth="2"
                    //                     strokeLinecap="round"
                    //                     strokeLinejoin="round"
                    //                     className="lucide lucide-badge-check h-4 w-4 fill-success text-success"
                    //                   >
                    //                     <path
                    //                       className=""
                    //                       d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
                    //                     />
                    //                     <path
                    //                       className="stroke-white"
                    //                       d="m9 12 2 2 4-4"
                    //                     />
                    //                   </svg>
                    //                 </div>
                    //               )}
                    //             </div>
                    //             <div className="h-5 grow overflow-hidden truncate text-ellipsis lowercase">
                    //               <span className="text-xs leading-5 text-tertiary">
                    //                 {contract.address.slice(0, 4)}...
                    //                 {contract.address.slice(-4)}
                    //               </span>
                    //             </div>
                    //           </div>

                    //           <div className="flex h-9 shrink-0 flex-col items-end">
                    //             <ContractDropdown
                    //               chainId={marketBuilderForm.watch("chain").id}
                    //               address={contract.address as string}
                    //             />
                    //           </div>
                    //         </motion.div>
                    //       </li>
                    //     )}
                    //   </Draggable>
                    // );
                  }
                )}

              <div className="h-0">{droppableProvided.placeholder}</div>
            </ul>
          )}
        </Droppable>
      </AnimatePresence>
    </div>
  );
});
