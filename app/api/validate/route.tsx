import { createClient } from "@supabase/supabase-js";
import { http, createConfig } from "@wagmi/core";
import { mainnet, sepolia } from "@wagmi/core/chains";
import { prepareTransactionRequest } from "@wagmi/core";
import { TransactionOptionsType } from "@/sdk/types";
import { Address } from "abitype";
import { getChain } from "@/sdk/utils";
import { ContractMap } from "@/sdk/contracts";
import { encodeFunctionData, createPublicClient, Chain } from "viem";
import { RPC_API_KEYS } from "../evm/contract/rpc-constants";
import { BigNumber } from "ethers";
import { NULL_ADDRESS } from "@/sdk/constants";

export const dynamic = true;

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

type OfferDataType = {
  id: string; // Global offer ID [ <CHAIN_ID>_<MARKET_TYPE>_<OFFER_SIDE>_<OFFER_ID> ]
  chain_id: number;
  market_type: 0 | 1;
  market_id: string; // For Recipe Market, this would be "0",  "1", "2", etc., For Vault Market, this would be address of wrapped vault "0x1234...", "0x5678...", etc.
  offer_id: string; // Offer ID of AP Offer
  funding_vault: string; // Address of the vault that is funding the offer (if 0x0000000000000000000000000000000000000000, then it's user's own wallet, else it is a vault)
  creator: string; // Address of the AP (Offer creator)
  fill_quantity: string; // Quantity of the offer that will be filled
  input_token_id: string; // <CHAIN_ID>-<CONTRACT_ADDRESSs>
};

const sampleOffers: OfferDataType[] = [
  {
    input_token_id: "11155111-0x3f85506f500cb02d141bafe467cc52ad5a9d7d5a",
    id: "11155111_0_0_0",
    chain_id: 11155111,
    market_type: 0,
    market_id: "0",
    offer_id: "0",
    funding_vault: "0x0000000000000000000000000000000000000000",
    creator: "0x77777cc68b333a2256b436d675e8d257699aa667",
    fill_quantity: "100000000000",
  },
  {
    input_token_id: "11155111-0x3f85506f500cb02d141bafe467cc52ad5a9d7d5a",
    id: "11155111_0_0_0",
    chain_id: 11155111,
    market_type: 0,
    market_id: "0",
    offer_id: "0",
    funding_vault: "0x26bF7fbEe628F40AeFe47205588dE221E5a92Ac5",
    creator: "0x77777cc68b333a2256b436d675e8d257699aa667",
    fill_quantity: "10000000000",
  },
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { offers }: { offers: OfferDataType[] } = body;

    const invalidApOffers = await getInvalidApOffers(offers);

    return Response.json(
      {
        status: "Success",
        data: invalidApOffers, // List of all id(s) that are invalid
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

async function getInvalidApOffers(offers: OfferDataType[]): Promise<string[]> {
  let invalidApOffers: string[] = [];
  if (offers?.length) {
    const erc20Abi = ContractMap[1]["Erc20"].abi;

    for (let i = 0; i < offers.length; i++) {
      const offer = offers[i];

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

        if (balance.lt(BigNumber.from(offer.fill_quantity))) {
          invalidApOffers.push(offer.id);
          continue;
        }

        const allowedAddress = offer.market_type
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

        if (allowance.lt(BigNumber.from(offer.fill_quantity))) {
          invalidApOffers.push(offer.id);
        }
      } catch (err) {
        invalidApOffers.push(offer.id);
      }
    }
  }
  return invalidApOffers;
}
