"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useMemo, useState } from "react";

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
import { useContract } from "royco/hooks";
import { ContractMap } from "royco/contracts";
import { AlertIndicator } from "../../../../components/common";

// @ts-ignore
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

  const { data: tokenContract } = useContract({
    chain_id: marketBuilderForm.watch("chain").id,
    contract_address: marketBuilderForm.watch("asset").contract_address,
  });

  // const { data: tokenContract } = useQuery({
  //   queryKey: ["token-contract", marketBuilderForm.watch("chain").id, marketBuilderForm.watch("asset").contract_address],
  //   queryFn: () =>
  //     api.contractControllerGetContract({
  //       chain_id: marketBuilderForm.watch("chain").id,
  //       contract_address: marketBuilderForm.watch("asset").contract_address,
  //     }),
  // });

  const { data: weirollContract } = useContract({
    chain_id: marketBuilderForm.watch("chain").id,
    /**
     * @TODO Strictly type this
     */
    // @ts-ignore
    contract_address:
      // @ts-ignore
      ContractMap[
        marketBuilderForm.watch("chain").id as keyof typeof ContractMap
      ]["WeirollWalletHelper"].address.toLowerCase(),
  });

  const { data: depositLockerContractOnEthMainnet } = useContract({
    chain_id: 1,
    contract_address: "0x63e8209caa13bba1838e3946a50d717071a28cfb",
  });

  const pinContractList = useMemo(() => {
    const arr: any[] = [];

    if (
      !!weirollContract &&
      !arr.find(
        (contract) => contract.address === (weirollContract as any)[0].address
      )
    ) {
      arr.push({
        ...(weirollContract as any)[0],
        id: (weirollContract as any)[0]?.contract_id,
        description:
          "The WeirollWalletHelper can access data on a user's offer and the market.",
      });
    }

    if (
      !!tokenContract &&
      !arr.find(
        (contract) => contract.address === (tokenContract as any)[0].address
      )
    ) {
      arr.push({
        ...(tokenContract as any)[0],
        id: (tokenContract as any)[0]?.contract_id,
      });
    }

    if (
      (process.env.NEXT_PUBLIC_FRONTEND_TAG === "boyco" ||
        process.env.NEXT_PUBLIC_FRONTEND_TAG === "testnet") &&
      marketBuilderForm.watch("chain").id === 1
    ) {
      if (
        !!depositLockerContractOnEthMainnet &&
        !arr.find(
          (contract) =>
            contract.address ===
            (depositLockerContractOnEthMainnet as any)[0].address
        )
      ) {
        arr.push({
          ...(depositLockerContractOnEthMainnet as any)[0],
          id: (depositLockerContractOnEthMainnet as any)[0]?.contract_id,
        });
      }
    }

    return arr;
  }, [tokenContract, weirollContract, depositLockerContractOnEthMainnet]);

  const contractList = useMemo(() => {
    return data.filter(
      (contract: any) =>
        !pinContractList.find(
          (pinContract) => pinContract.address === contract.address
        )
    );
  }, [data, pinContractList]);

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
        /**
         * @TODO Strictly type this
         */
        // @ts-ignore
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
    <div
      ref={ref}
      className={cn("flex h-full flex-1 flex-col", className)}
      {...props}
    >
      <AnimatePresence>
        <Droppable droppableId="pin-contract-list" isDropDisabled={true}>
          {(droppableProvided) => (
            <ul
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
              className="overflow-x-hidden"
            >
              <PinnedContracts
                data={pinContractList}
                clickedKey={clickedKey}
                setClickedKey={setClickedKey}
                functionForm={functionForm}
                marketBuilderForm={marketBuilderForm}
              />
            </ul>
          )}
        </Droppable>
      </AnimatePresence>

      <AnimatePresence>
        {((contractList === null || contractList.length === 0) &&
          pinContractList.length === 0) ||
        searchKey ? (
          <AlertIndicator className="mt-5">
            {searchKey.length > 0 && searchKey.length < 3
              ? "Search must be >= 3 letters"
              : "No contracts found"}
          </AlertIndicator>
        ) : (
          <Droppable droppableId="contract-list" isDropDisabled={true}>
            {(droppableProvided) => (
              <ul
                ref={droppableProvided.innerRef}
                {...droppableProvided.droppableProps}
                className="flex-1 overflow-x-hidden overflow-y-scroll"
              >
                {!!contractList &&
                  contractList.map(
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
                    }
                  )}

                <div className="h-0">{droppableProvided.placeholder}</div>
              </ul>
            )}
          </Droppable>
        )}
      </AnimatePresence>
    </div>
  );
});
