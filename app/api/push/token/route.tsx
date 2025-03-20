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
  98865: process.env.SERVER_RPC_98865_1,
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
    80094: "berachain",
  },
  coingecko: {
    1: "ethereum",
    42161: "arbitrum-one",
    8453: "base",
    146: "sonic",
    80094: "berachain-ecosystem",
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
- Search Id: ${tokenData.search_id}`;
};

export const fetchTokenFromCoinmarketCap = async ({
  chainId,
  contractAddress,
  decimals,
}: {
  chainId: number;
  contractAddress: string;
  decimals: number;
}) => {
  const fetchResponse = await fetch(
    `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?address=${contractAddress}`,
    {
      headers: {
        "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY!,
      },
    }
  );
  const fetchData = await fetchResponse.json();

  // Get search id
  const searchId = Object.keys(fetchData.data)[0];

  // Get raw token data
  const tokenData = fetchData.data[searchId];

  // Get chain slug
  const chainSlug =
    CHAIN_SLUG.coinmarketcap[chainId as keyof typeof CHAIN_SLUG.coinmarketcap];

  // Find contract address for the chain
  const contractInfo = tokenData.contract_address.find(
    (c: any) => c.platform.coin.slug === chainSlug
  );

  // Check if contract info is found
  if (!contractInfo) {
    return null;
  }

  // Create enriched token data
  const enrichedTokenData = {
    id: `${chainId}-${contractAddress}`.toLowerCase(),
    chain_id: chainId,
    contract_address: contractAddress,
    name: tokenData.name,
    symbol: tokenData.symbol,
    image: tokenData.logo,
    decimals: decimals,
    source: "coinmarketcap",
    search_id: searchId.toString(),
    type: "token",
  };

  return enrichedTokenData;
};

export const fetchTokenFromCoingecko = async ({
  chainId,
  contractAddress,
  decimals,
}: {
  chainId: number;
  contractAddress: string;
  decimals: number;
}) => {
  // Get asset platform id
  const chainSlug =
    CHAIN_SLUG.coingecko[chainId as keyof typeof CHAIN_SLUG.coingecko];

  const fetchResponse = await fetch(
    // Public API endpoint (can be used with Demo API key on free plan)
    // `https://api.coingecko.com/api/v3/coins/${chainSlug}/contract/${contractAddress}`,

    // Pro API endpoint (requires paid plan)
    `https://pro-api.coingecko.com/api/v3/coins/${chainSlug}/contract/${contractAddress}`,
    {
      headers: {
        // Demo API key
        // "x-cg-demo-api-key": process.env.COINGECKO_API_KEY!,

        // Pro API key
        "x-cg-pro-api-key": process.env.COINGECKO_API_KEY!,
      },
    }
  );
  const fetchData = await fetchResponse.json();

  // Get search id
  const searchId = fetchData.id;

  // Get raw token data
  const tokenData = fetchData;

  // Find contract address for the chain
  const contractInfo = tokenData.detail_platforms[chainSlug];

  // Check if contract info is found
  if (!contractInfo) {
    return null;
  }

  // Create enriched token data
  const enrichedTokenData = {
    id: `${chainId}-${contractAddress}`.toLowerCase(),
    chain_id: chainId,
    contract_address: contractAddress,
    name: tokenData.name,
    symbol: tokenData.symbol.toUpperCase(),
    image: tokenData.image.large,
    decimals: decimals,
    source: "coingecko",
    search_id: searchId,
    type: "token",
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

export const getContent = (enrichedTokenData: any) => {
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

    // const body = await request.json();
    // let { chain_id, contract_address: raw_contract_address } = body;

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

    // Create public client
    const publicClient = createPublicClient({
      // @ts-ignore
      chain: getSupportedChain(chain_id),
      transport: http(
        SERVER_RPC_API_KEYS[chain_id as keyof typeof SERVER_RPC_API_KEYS],
        {
          fetchOptions: {
            headers: {
              Origin: "https://app.royco.org",
            },
          },
        }
      ),
    });

    // Get token decimals
    const decimals = await publicClient.readContract({
      address: contract_address as Address,
      abi: erc20Abi,
      functionName: "decimals",
    });

    // Check if decimals is a number
    if (typeof decimals !== "number" || isNaN(decimals)) {
      return Response.json({ status: "Invalid ERC20 token" }, { status: 400 });
    }

    // Store enriched token data
    let enrichedTokenData = null;

    try {
      // Try to fetch token from coinmarketcap
      enrichedTokenData = await fetchTokenFromCoinmarketCap({
        chainId: chain_id,
        contractAddress: contract_address,
        decimals: decimals,
      });
    } catch (error) {
      try {
        // Try to fetch token from coingecko
        enrichedTokenData = await fetchTokenFromCoingecko({
          chainId: chain_id,
          contractAddress: contract_address,
          decimals: decimals,
        });
      } catch (error) {}
    }

    if (enrichedTokenData === null) {
      // Token was not found on coinmarketcap or coingecko
      return Response.json(
        { status: "Token not found on coinmarketcap or coingecko" },
        { status: 404 }
      );
    }

    const content = getContent(enrichedTokenData);

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
