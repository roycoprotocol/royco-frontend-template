"use client";

import { Control, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { FunctionFormSchema } from "./function-form-schema";
import { z } from "zod";

export type FunctionFormUtilities = {
  watchFunctionForm: UseFormWatch<z.infer<typeof FunctionFormSchema>>;
  setValueFunctionForm: UseFormSetValue<z.infer<typeof FunctionFormSchema>>;
  controlFunctionForm: Control<z.infer<typeof FunctionFormSchema>>;
};
