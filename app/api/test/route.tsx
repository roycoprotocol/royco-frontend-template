import { createClient } from "@supabase/supabase-js";
import { http } from "@wagmi/core";
import { Address } from "abitype";
import { getSupportedChain } from "royco/utils";
import { ContractMap } from "royco/contracts";
import { encodeFunctionData, createPublicClient, Chain } from "viem";

import { BigNumber } from "ethers";
import { NULL_ADDRESS } from "royco/constants";
import { erc20Abi } from "viem";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const fetchCache = "force-no-store";

export async function GET(request: Request) {
  try {
    console.log("test api called");

    console.log("request", request);

    return Response.json(
      {
        status: "Success",
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

export async function POST(request: Request) {
  try {
    console.log("test api called");

    console.log("request", request);

    return Response.json(
      {
        status: "Success",
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
