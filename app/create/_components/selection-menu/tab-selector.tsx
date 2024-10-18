"use client";

import { useSelectionMenu } from "@/store";

export const TabSelector = () => {
  const { chainId } = useSelectionMenu();

  return <div>Tab Selector</div>;
};
