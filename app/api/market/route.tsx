import { getChain } from "@/sdk/utils";
import { createClient } from "@supabase/supabase-js";
import { http, createConfig } from "@wagmi/core";
import { Chain, mainnet, sepolia } from "@wagmi/core/chains";
import { createPublicClient } from "viem";
import { RPC_API_KEYS } from "../evm/contract/rpc-constants";
import { getMarketIdFromEventLog } from "@/sdk/market";

export const dynamic = true;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { chain_id, market_type, tx_hash, id, name, description } = body;

    const chain: Chain = getChain(chain_id);
    const viemClient = createPublicClient({
      chain,
      transport: http(RPC_API_KEYS[chain_id]),
    });

    const receipt = await viemClient.getTransactionReceipt({
      hash: tx_hash as `0x${string}`,
    });

    if (!receipt) {
      return Response.json(
        { data: "Transaction not found", status: false },
        { status: 404 }
      );
    }

    // Get the logs from the transaction receipt
    const logs = receipt.logs;

    const { status, market_id } = getMarketIdFromEventLog({
      chain_id,
      market_type,
      logs,
    });

    if (status && market_id) {
      const id = `${chain_id}_${market_type}_${market_id}`;

      const row = {
        id,
        name,
        description,
      };

      const client = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL as string,
        process.env.SUPABASE_SERVICE_ROLE_KEY as string
      );

      const { data, error } = await client
        .from("market_userdata")
        .insert([row]);

      return Response.json(
        {
          data: error ? "Insert Error" : "Insert Success",
          status: error ? false : true,
        },
        { status: 200 }
      );
    } else {
      return Response.json(
        { data: "Market not found or invalid log", status: false },
        { status: 400 }
      );
    }
  } catch (error) {
    return Response.json(
      {
        data: "Internal Server Error",
        // functions: [],
      },
      {
        status: 500,
      }
    );
  }
}
