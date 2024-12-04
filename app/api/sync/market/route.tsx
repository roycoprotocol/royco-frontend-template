import { http } from "@wagmi/core";
import { Address } from "abitype";
import {
  getChain,
  getSupportedChain,
  isSolidityAddressValid,
  refineSolidityAddress,
  shortAddress,
} from "royco/utils";
import { createPublicClient } from "viem";
import { RPC_API_KEYS } from "@/components/constants";
import { erc20Abi } from "viem";
import { Octokit } from "@octokit/rest";

export const dynamic = true;

export async function GET(request: Request) {
  try {
    return Response.json(
      {
        status: "Success",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in route", error);
    return Response.json({ status: "Internal Server Error" }, { status: 500 });
  }
}
