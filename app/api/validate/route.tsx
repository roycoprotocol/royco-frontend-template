import { createClient } from "@supabase/supabase-js";
import { http, createConfig } from "@wagmi/core";
import { mainnet, sepolia } from "@wagmi/core/chains";
import { Address } from "abitype";
import { getChain } from "@/sdk/utils";
import { ContractMap } from "@/sdk/contracts";
import { encodeFunctionData, createPublicClient, Chain } from "viem";
import { RPC_API_KEYS } from "../evm/contract/rpc-constants";
import { BigNumber } from "ethers";
import { NULL_ADDRESS } from "@/sdk/constants";
import { erc20Abi } from "viem";

export const dynamic = true;

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

type ValidationOfferDataType = {
  id: string; // Global offer ID [ <CHAIN_ID>_<MARKET_TYPE>_<OFFER_SIDE>_<OFFER_ID> ]
  chain_id: number;
  market_type: 0 | 1;
  offer_side: 0 | 1;
  creator: string; // Address of the AP (Offer creator)
  funding_vault: string; // Address of the vault that is funding the offer (if 0x0000000000000000000000000000000000000000, then it's user's own wallet, else it is a vault)
  input_token_id: string; // Quantity of the offer that will be filled
  quantity_remaining: string; // <CHAIN_ID>-<CONTRACT_ADDRESSs>
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { offer_ids }: { offer_ids: string[] } = body; // Changed from offers to offer_ids

    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );

    // Fetch offer details from raw_offers table
    const { data: offers, error: fetchError } = await client.rpc(
      "get_validation_offers",
      {
        offer_ids,
      }
    );

    if (fetchError || !offers) {
      throw new Error("Failed to fetch offers");
    }

    const invalidApOffers = await getInvalidApOffers(offers);

    // Update invalid offers
    const { error: updateError } = await client
      .from("raw_offers")
      .update({ is_valid: false })
      .in("id", invalidApOffers);

    return Response.json(
      {
        status: "Success",
        data: invalidApOffers,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        status: "Internal Server Error",
        data: [],
      },
      {
        status: 500,
      }
    );
  }
}

async function getInvalidApOffers(
  offers: ValidationOfferDataType[]
): Promise<string[]> {
  let invalidApOffers: string[] = [];
  if (offers?.length) {
    for (let i = 0; i < offers.length; i++) {
      const offer = offers[i];

      if (offer.offer_side === 1) {
        continue; // IP offers are always valid
      }

      try {
        // Get latest block number for the current chain
        const chain: Chain = getChain(offer.chain_id);
        const client = createPublicClient({
          chain,
          transport: http(RPC_API_KEYS[offer.chain_id]),
        });

        const inputTokenAddress = offer.input_token_id.split("-")[1];

        // Check balance and approval of AP account or funding vault depending on offer params
        // Funding directly from AP account
        const balanceData = await client.call({
          account: offer.creator as Address,
          data: encodeFunctionData({
            abi: erc20Abi,
            functionName: "balanceOf",
            args: [offer.creator as Address],
          }),
          to:
            offer.funding_vault === NULL_ADDRESS
              ? (inputTokenAddress as Address)
              : (offer.funding_vault as Address), // Use funding vault if provided, else token contract directly
        });

        const balance = BigNumber.from(balanceData["data"]);

        if (balance.lt(BigNumber.from(offer.quantity_remaining))) {
          invalidApOffers.push(offer.id);
          continue;
        }

        const allowedAddress =
          offer.market_type === 1
            ? ContractMap[offer.chain_id as keyof typeof ContractMap][
                "VaultMarketHub"
              ].address
            : ContractMap[offer.chain_id as keyof typeof ContractMap][
                "RecipeMarketHub"
              ].address;

        const approvalData = await client.call({
          account: offer.creator as Address,
          data: encodeFunctionData({
            abi: erc20Abi,
            functionName: "allowance",
            args: [offer.creator as Address, allowedAddress],
          }),
          to:
            offer.funding_vault === NULL_ADDRESS
              ? (inputTokenAddress as Address)
              : (offer.funding_vault as Address), // Use funding vault if provided, else token contract directly
        });

        const allowance = BigNumber.from(approvalData["data"]);

        if (allowance.lt(BigNumber.from(offer.quantity_remaining))) {
          invalidApOffers.push(offer.id);
        }
      } catch (err) {
        invalidApOffers.push(offer.id);
      }
    }
  }
  return invalidApOffers;
}
