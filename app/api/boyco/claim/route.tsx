import axios from "axios";
import { NextResponse } from "next/server";

import { Database } from "royco/types";
import { createClient } from "@supabase/supabase-js";
import { Address, createPublicClient, erc20Abi, http } from "viem";
import { berachain, berachainTestnet } from "viem/chains";
import { BERA_AIRDROP_ABI, BERA_AIRDROP_ADDRESS } from "./constants";
import { BigNumber } from "ethers";
import { BerachainMainnet, BerachainTestnet } from "royco/constants";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const fetchCache = "force-no-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chain_id = parseInt(searchParams.get("chain_id") as string);
  const id = searchParams.get("id");

  if (!id)
    return NextResponse.json({ error: "Missing merkle id" }, { status: 400 });

  try {
    const client = createPublicClient({
      chain: chain_id === 80069 ? BerachainTestnet : BerachainMainnet,
      transport: http(
        chain_id === 80069
          ? (process.env.RPC_API_KEY_80069_1 as string)
          : (process.env.RPC_API_KEY_80094_1 as string)
      ),
    });

    const reward_response = await client.readContract({
      address:
        BERA_AIRDROP_ADDRESS[
          chain_id as unknown as keyof typeof BERA_AIRDROP_ADDRESS
        ],
      abi: BERA_AIRDROP_ABI,
      functionName: "rewards",
      args: [id as `0x${string}`],
    });

    const active_at = parseInt(BigNumber.from(reward_response?.[2]).toString());
    return NextResponse.json({
      active_at,
    });
  } catch (err) {
    console.log("err", err);

    return NextResponse.json(
      {
        active_at: 0,
      },
      { status: 500 }
    );
  }
}
