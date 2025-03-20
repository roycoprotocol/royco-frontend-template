import { http } from "@wagmi/core";
import { Address } from "abitype";
import {
  getSupportedChain,
  isSolidityAddressValid,
  refineSolidityAddress,
  shortAddress,
} from "royco/utils";
import { createPublicClient, erc4626Abi } from "viem";

import { erc20Abi } from "viem";
import { Octokit } from "@octokit/rest";
import { type NextRequest } from "next/server";
import { lpTokenAbi } from "./lp-token-abi";
import { getSupportedToken, UnknownToken } from "royco/constants";
import { getContent } from "../token/route";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const fetchCache = "force-no-store";

const SERVER_RPC_API_KEYS = {
  1: process.env.SERVER_RPC_1_1,
  11155111: process.env.SERVER_RPC_11155111_1,
  42161: process.env.SERVER_RPC_42161_1,
  8453: process.env.SERVER_RPC_8453_1,
  146: process.env.SERVER_RPC_146_1,
  80094: process.env.SERVER_RPC_80094_1,
  80000: process.env.SERVER_RPC_80000_1,
  21000000: process.env.SERVER_RPC_21000000_1,
  98866: process.env.SERVER_RPC_98866_1,
};

/**
 * Chain ID to slug mapping
 *
 * CoinmarketCap refers it as slug
 * Coingecko refers it as asset platform id
 */
export const CHAIN_SLUG = {
  coinmarketcap: {
    1: "ethereum",
    42161: "arbitrum",
    8453: "base",
    146: "sonic",
  },
  coingecko: {
    1: "ethereum",
    42161: "arbitrum-one",
    8453: "base",
    146: "sonic",
  },
};

export const createCommitMessage = (tokenData: any) => {
  return `feat(token-map): Update Token -- ${tokenData.chain_id}-${tokenData.contract_address} -- ${tokenData.name} (${tokenData.symbol}) (${shortAddress(tokenData.contract_address)}) 

Token Details:
- Id: ${tokenData.id}
- Chain Id: ${tokenData.chain_id}
- Contract Address: ${tokenData.contract_address}
- Name: ${tokenData.name}
- Symbol: ${tokenData.symbol}
- Image: ${tokenData.image}
- Decimals: ${tokenData.decimals}
- Source: ${tokenData.source}
- Search Id: ${tokenData.search_id}
- Token 0: ${tokenData.token0}
- Token 1: ${tokenData.token1}`;
};

export const fetchLpTokenFromContract = async ({
  chainId,
  contractAddress,
}: {
  chainId: number;
  contractAddress: string;
}) => {
  const chainClient = createPublicClient({
    chain: getSupportedChain(chainId),
    transport: http(
      SERVER_RPC_API_KEYS[chainId as keyof typeof SERVER_RPC_API_KEYS],
      {
        fetchOptions: {
          headers: {
            Origin: "https://app.royco.org",
          },
        },
      }
    ),
  });

  const contracts = [
    {
      address: contractAddress as Address,
      abi: lpTokenAbi,
      functionName: "token0",
    },
    {
      address: contractAddress as Address,
      abi: lpTokenAbi,
      functionName: "token1",
    },
    {
      address: contractAddress as Address,
      abi: lpTokenAbi,
      functionName: "decimals",
    },
  ];

  const [token0_data, token1_data, decimals_data] = await chainClient.multicall(
    {
      contracts,
    }
  );

  if (
    token0_data.status !== "success" ||
    token1_data.status !== "success" ||
    decimals_data.status !== "success" ||
    typeof token0_data.result !== "string" ||
    typeof token1_data.result !== "string" ||
    typeof decimals_data.result !== "number"
  ) {
    throw new Error("Invalid LP token");
  }

  const token0 = token0_data.result.toLowerCase();
  const token1 = token1_data.result.toLowerCase();
  const decimals = decimals_data.result;

  if (
    !isSolidityAddressValid("address", token0) ||
    !isSolidityAddressValid("address", token1)
  ) {
    throw new Error("Invalid LP token");
  }

  const token0_info = getSupportedToken(`${chainId}-${token0}`);
  const token1_info = getSupportedToken(`${chainId}-${token1}`);

  if (token0_info.symbol === UnknownToken.symbol) {
    throw new Error("Token 0 doesn't exist in SDK");
  } else if (token1_info.symbol === UnknownToken.symbol) {
    throw new Error("Token 1 doesn't exist in SDK");
  }

  // Create enriched token data
  const enrichedTokenData = {
    id: `${chainId}-${contractAddress}`.toLowerCase(),
    chain_id: chainId,
    contract_address: contractAddress.toLowerCase(),
    name: `${token0_info.name}-${token1_info.name} LP Token`,
    symbol: `${token0_info.symbol}-${token1_info.symbol}`,
    image: UnknownToken.image,
    decimals: decimals,
    source: "lp",
    search_id: `${chainId}-${contractAddress}`.toLowerCase(),
    type: "lp",
    token0: token0_info.id,
    token1: token1_info.id,
  };

  return enrichedTokenData;
};

export const checkTokenFileExists = async (
  octokit: Octokit,
  filePath: string
) => {
  try {
    await octokit.repos.getContent({
      owner: "roycoprotocol",
      repo: "royco-sdk",
      path: filePath,
      ref: "main",
    });
    return true;
  } catch (error: any) {
    if (error.status === 404) {
      return false;
    }
    throw error;
  }
};

export const getLpTokenContent = (enrichedTokenData: any) => {
  return Buffer.from(
    `import { defineToken } from "@/sdk/constants";

export default defineToken({
  id: "${enrichedTokenData.id}",
  chain_id: ${enrichedTokenData.chain_id},
  contract_address: "${enrichedTokenData.contract_address}",
  name: "${enrichedTokenData.name}",
  symbol: "${enrichedTokenData.symbol}",
  image: "${enrichedTokenData.image}",
  decimals: ${enrichedTokenData.decimals},
  source: "${enrichedTokenData.source}",
  search_id: "${enrichedTokenData.search_id}",
  type: "${enrichedTokenData.type}",
  token0: "${enrichedTokenData.token0}",
  token1: "${enrichedTokenData.token1}",
});`
  ).toString("base64");
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const chain_id = parseInt(searchParams.get("chain_id") || "0");
    const raw_contract_address = searchParams
      .get("contract_address")
      ?.toLowerCase();

    // Check if chain id is provided
    if (!chain_id) {
      return Response.json({ status: "Chain ID is required" }, { status: 400 });
    }

    // Check if chain id is a number
    if (typeof chain_id !== "number") {
      return Response.json(
        { status: "Chain ID must be a number" },
        { status: 400 }
      );
    }

    // Check if chain is supported
    const chain = getSupportedChain(chain_id);
    if (!chain) {
      return Response.json({ status: "Unsupported chain" }, { status: 400 });
    }

    // Check if contract address is provided
    if (!raw_contract_address) {
      return Response.json(
        { status: "Contract address is required" },
        { status: 400 }
      );
    }

    // Check if contract address is a string
    if (typeof raw_contract_address !== "string") {
      return Response.json(
        { status: "Contract address must be a string" },
        { status: 400 }
      );
    }

    // Refine contract address
    const contract_address = refineSolidityAddress(
      "address",
      raw_contract_address
    );

    // Validate contract address
    if (!isSolidityAddressValid("address", raw_contract_address)) {
      return Response.json(
        { status: "Invalid contract address" },
        { status: 400 }
      );
    }

    // Create file path
    const filePath = `sdk/constants/token-map/${chain_id}/definitions/${chain_id}-${contract_address.toLowerCase()}.ts`;

    // Create octokit client
    const octokit = new Octokit({
      auth: process.env.ROYCO_SDK_GITHUB_TOKEN,
    });

    // Check if token file already exists
    const fileExists = await checkTokenFileExists(octokit, filePath);
    if (fileExists) {
      return Response.json({ status: "Token already exists" }, { status: 409 });
    }

    // Store enriched token data
    let enrichedTokenData = null;

    try {
      // Try to fetch token from coinmarketcap
      enrichedTokenData = await fetchLpTokenFromContract({
        chainId: chain_id,
        contractAddress: contract_address,
      });
    } catch (error) {
      return Response.json(
        { status: "Internal Server Error" },
        { status: 500 }
      );
    }

    if (enrichedTokenData === null) {
      // Token was not found on coinmarketcap or coingecko
      return Response.json(
        { status: "Token is not a valid LP token" },
        { status: 404 }
      );
    }

    const content = getLpTokenContent(enrichedTokenData);

    const commitMessage = createCommitMessage(enrichedTokenData);

    await octokit.repos.createOrUpdateFileContents({
      owner: "roycoprotocol",
      repo: "royco-sdk",
      path: filePath,
      message: commitMessage,
      content,
      branch: "main",
    });

    return Response.json(
      {
        status: "Success",
        data: {
          ...enrichedTokenData,
          filePath: filePath,
          fileUrl: `https://github.com/roycoprotocol/royco-sdk/tree/main/${filePath}`,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in route", error);
    return Response.json({ status: "Internal Server Error" }, { status: 500 });
  }
}
