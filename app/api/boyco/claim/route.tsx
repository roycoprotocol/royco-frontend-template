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
  const id = searchParams.get("id");

  if (!id)
    return NextResponse.json({ error: "Missing merkle id" }, { status: 400 });

  try {
    const response = await axios.get(
      `${process.env.BERA_AIRDROP_API_URL_80094}/v1/merkle-tree/${id.toLowerCase()}/markets`
    );

    const market_ids = response.data.markets;

    return NextResponse.json({
      market_ids,
    });
  } catch (err) {
    console.log("err", err);

    return NextResponse.json(
      {
        market_ids: [],
      },
      { status: 500 }
    );
  }
}
