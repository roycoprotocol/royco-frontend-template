import axios from "axios";
import { NextResponse } from "next/server";

import { TransactionOptionsType } from "royco/types";
import { createPublicClient, http } from "viem";
import { BerachainTestnet, BerachainMainnet } from "royco/constants";
import { BERA_AIRDROP_ABI, BERA_AIRDROP_ADDRESS } from "./constants";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const fetchCache = "force-no-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chain_id = parseInt(searchParams.get("chain_id") as string);
  const id = searchParams.get("id");
  const address = searchParams.get("address");

  if (!id)
    return NextResponse.json({ error: "Missing merkle id" }, { status: 400 });

  if (!address)
    return NextResponse.json(
      { error: "Missing wallet address" },
      { status: 400 }
    );

  try {
    const response = await axios.get(
      chain_id === 80069
        ? `${process.env.BERA_AIRDROP_API_URL_80069}/v1/merkle-tree/${id.toLowerCase()}/wallet/${address.toLowerCase()}`
        : `${process.env.BERA_AIRDROP_API_URL_80094}/v1/merkle-tree/${id.toLowerCase()}/wallet/${address.toLowerCase()}`
    );

    const amount = response.data.amount;
    const proof = response.data.proof;
    const wallet = response.data.wallet.toLowerCase();
    const markets: Array<{
      royco_market_id: string;
      amount: string;
    }> = response.data.markets;

    const client = createPublicClient({
      chain: chain_id === 80069 ? BerachainTestnet : BerachainMainnet,
      transport: http(
        chain_id === 80069
          ? (process.env.RPC_API_KEY_80069_1 as string)
          : (process.env.RPC_API_KEY_80094_1 as string)
      ),
    });

    const is_claimed_response = await client.readContract({
      address:
        BERA_AIRDROP_ADDRESS[
          chain_id as unknown as keyof typeof BERA_AIRDROP_ADDRESS
        ],
      abi: BERA_AIRDROP_ABI,
      functionName: "claimed",
      args: [id as `0x${string}`, wallet as `0x${string}`],
    });

    const is_claimed = BigInt(is_claimed_response) === BigInt(0) ? false : true;

    const txOptions: TransactionOptionsType = {
      contractId: `${chain_id}-${BERA_AIRDROP_ADDRESS[chain_id as unknown as keyof typeof BERA_AIRDROP_ADDRESS]}`,
      chainId: chain_id,
      id: "claim_bera_airdrop",
      label: "Claim BERA Airdrop",
      address:
        BERA_AIRDROP_ADDRESS[
          chain_id as unknown as keyof typeof BERA_AIRDROP_ADDRESS
        ],
      abi: [BERA_AIRDROP_ABI[5]],
      functionName: "claim",
      marketType: "recipe",
      args: [
        [
          {
            identifier: id as `0x${string}`,
            account: address as `0x${string}`,
            amount: amount,
            merkleProof: proof,
          },
        ],
      ],
      txStatus: "idle",
      txHash: null,
    };

    return NextResponse.json({
      is_eligible: true,
      is_claimed,
      amount,
      proof,
      markets,
      tx_options: txOptions,
    });
  } catch (err) {
    console.log("err", err);

    return NextResponse.json(
      {
        is_eligible: false,
        is_claimed: false,
        amount: 0,
        proof: [],
        markets: [],
        wallet: address,
        tx_options: null,
      },
      { status: 500 }
    );
  }
}
