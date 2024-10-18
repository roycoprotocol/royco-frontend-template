"use client";

import { Control, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { MarketBuilderFormSchema } from "./market-builder-form-schema";
import { z } from "zod";

export type PoolFormUtilities = {
  watchMarketBuilderForm: UseFormWatch<z.infer<typeof MarketBuilderFormSchema>>;
  setValueMarketBuilderForm: UseFormSetValue<
    z.infer<typeof MarketBuilderFormSchema>
  >;
  controlMarketBuilderForm: Control<z.infer<typeof MarketBuilderFormSchema>>;
};
