"use client";

import { z } from "zod";

import { SupportedToken } from "@/sdk/constants";

export const TokenEditorSchema = z.object({
  fdv: z.string(),
  allocation: z.string().optional(),
  price: z.number(),
});
