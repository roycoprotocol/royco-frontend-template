import { z } from "zod";
import { MarketOfferType, MarketUserType } from "@/store/market-manager-props";
import { isSolidityAddressValid } from "@/sdk/utils";
import { BigNumber } from "ethers";

const BigNumberSchema = z
  .union([z.string(), z.number()]) // Accept string or number as input
  .refine(
    (value) => {
      try {
        BigNumber.from(value); // Validate that it can be parsed to BigNumber
        return true;
      } catch (e) {
        return false;
      }
    },
    {
      message: "Invalid BigNumber value",
    }
  )
  .transform((value) => BigNumber.from(value));

export const MarketFormSchema = z
  .object({
    offer_type: z.ZodEnum.create([
      MarketOfferType.market.id,
      MarketOfferType.limit.id,
    ]),

    funding_vault: z.object({
      address: z
        .string()
        .optional()
        .refine((value) => isSolidityAddressValid("address", value), {
          message: "Invalid address",
        }),
      label: z.string(),
    }),

    offer_amount: z.string(),
    offer_raw_amount: z.string(),

    incentive_tokens: z.array(
      z.object({
        id: z.string(),
        chain_id: z.number(),
        contract_address: z.string(),
        name: z.string(),
        symbol: z.string(),
        image: z.string(),
        decimals: z.number(),
        amount: z.string().optional(),

        rate: z.string().optional(), // rate in wei per second (scaled up by 10^18)
        fdv: z.string().optional(), // fully diluted value of token
        aip: z.string().optional(), // annual incentive percentage
        allocation: z.string().optional(), // percentage of shares to this offer
        distribution: z.string().optional(), // percentage of shares to this offer
        raw_amount: z.string().optional(),
        start_timestamp: z.date().optional(),
        end_timestamp: z.date().optional(),
      })
    ),
    expiry: z
      .date({
        message: "Expiration timestamp must be selected",
      })
      .optional(),

    no_expiry: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {});
