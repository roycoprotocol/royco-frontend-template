"use client";

import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import {
  useMarketBuilder,
  useMarketBuilderManager,
  useSelectionMenu,
} from "@/store";
import { FunctionFormSchema } from "./function-form";

export const DragAndDropWrapper = ({
  children,
  functionForm,
}: {
  children: React.ReactNode;
  functionForm: UseFormReturn<z.infer<typeof FunctionFormSchema>>;
}) => {
  const { draggingId, setDraggingId, placeholderContractList } =
    useSelectionMenu();
  const { dragData, setDragData } = useMarketBuilder();

  const { setIsContractAddressUpdated } = useMarketBuilderManager();

  const onDragEnd = (e: DropResult) => {
    if (!!e.destination && !!dragData) {
      // this is a drop event
      if (e.destination.droppableId === "contract-address-droppable") {
        setIsContractAddressUpdated(true);

        setTimeout(() => {
          let contract = null;

          if (placeholderContractList[0]) {
            contract = placeholderContractList[0].find(
              // @ts-ignore
              (c) => c.address === dragData.address
            );
          }

          if (placeholderContractList[1]) {
            contract = placeholderContractList[1].find(
              // @ts-ignore
              (c) => c.address === dragData.address
            );
          }

          if (contract && contract.contract_name) {
            functionForm.setValue("contract_name", contract.contract_name);
          }

          if (contract && contract.image) {
            functionForm.setValue("contract_image", contract.image);
          }

          functionForm.setValue("contract_address", dragData.address);
        }, 200);
      } else if (e.destination.droppableId === "contract-abi-droppable") {
        functionForm.setValue("placeholder_contract_address", dragData.address);
      }
    }

    setDraggingId(null);

    if (dragData !== null) {
      setDragData(null);
    }
  };

  const onDragStart = (e: any) => {
    setDraggingId(e.draggableId);
  };

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      {children}
    </DragDropContext>
  );
};
