import { createClient } from "@supabase/supabase-js";
import { http, createConfig, multicall } from "@wagmi/core";
import {
  baseSepolia,
  base,
  arbitrumSepolia,
  mainnet,
  sepolia,
  arbitrum,
} from "@wagmi/core/chains";
import { Address } from "abitype";
import {
  getChain,
  getSupportedChain,
  isSolidityAddressValid,
  refineSolidityAddress,
  shortAddress,
} from "@/sdk/utils";
import { ContractMap } from "@/sdk/contracts";
import {
  encodeFunctionData,
  createPublicClient,
  Chain,
  erc4626Abi,
} from "viem";
import { RPC_API_KEYS } from "@/components/constants";
import { BigNumber } from "ethers";
import { NULL_ADDRESS } from "@/sdk/constants";
import { erc20Abi } from "viem";
import { Octokit } from "@octokit/rest";
import path from "path";

export const dynamic = true;

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [sepolia.id]: http(RPC_API_KEYS[sepolia.id]),
    [mainnet.id]: http(RPC_API_KEYS[mainnet.id]),
    [arbitrumSepolia.id]: http(RPC_API_KEYS[arbitrumSepolia.id]),
    [arbitrum.id]: http(RPC_API_KEYS[arbitrum.id]),
    [baseSepolia.id]: http(RPC_API_KEYS[baseSepolia.id]),
    [base.id]: http(RPC_API_KEYS[base.id]),
  },
});

/**
 * Chain ID to CMC slug mapping
 *
 * CoinmarketCap refers it as slug
 * Coingecko refers it as asset platform id
 */
export const CHAIN_SLUG = {
  coinmarketcap: {
    1: "ethereum",
    42161: "arbitrum",
    8453: "base",
  },
  coingecko: {
    1: "ethereum",
    42161: "arbitrum-one",
    8453: "base",
  },
};

export const createCommitMessage = (tokenData: any) => {
  return `feat(token-map): Add ${tokenData.name} (${tokenData.symbol}) (${shortAddress(tokenData.contract_address)}) 

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

  // Check if contract address is found
  if (!contractInfo) {
    return null;
  }

  // Enrich token data
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
  };

  return enrichedTokenData;
};

export const fetchTokenFromCoingecko = async ({
  chainId,
  contractAddress,
}: {
  chainId: number;
  contractAddress: string;
}) => {
  // Get asset platform id
  const chainSlug =
    CHAIN_SLUG.coinmarketcap[chainId as keyof typeof CHAIN_SLUG.coinmarketcap];

  const fetchResponse = await fetch(
    // Public API endpoint (can be used with Demo API key on free plan)
    `https://api.coingecko.com/api/v3/coins/${chainSlug}/contract/${contractAddress}`

    // Pro API endpoint (requires paid plan)
    // `https://pro-api.coingecko.com/api/v3/coins/${chainSlug}/contract/${contractAddress}`
  );
  const fetchData = await fetchResponse.json();

  // Get token id
  const tokenId = fetchData.id;
  const tokenData = {};

  return fetchData;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { chain_id, contract_address: raw_contract_address } = body;

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

    // Create public client
    const publicClient = createPublicClient({
      chain: getChain(chain_id),
      transport: http(RPC_API_KEYS[chain_id]),
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
      enrichedTokenData = await fetchTokenFromCoinmarketCap({
        chainId: chain_id,
        contractAddress: contract_address,
        decimals: decimals,
      });
    } catch (error) {
      // Token was not found on coinmarketcap
    }

    // 4. Check if file already exists
    const octokit = new Octokit({
      auth: process.env.ROYCO_SDK_GITHUB_TOKEN,
    });

    // Create file path
    const filePath = `sdk/constants/token-map/${chain_id}/json/${chain_id}-${contract_address.toLowerCase()}.json`;

    try {
      await octokit.repos.getContent({
        owner: "roycoprotocol",
        repo: "royco-sdk",
        path: filePath,
        ref: "main",
      });

      return Response.json({ status: "Token already exists" }, { status: 409 });
    } catch (error: any) {
      if (error.status === 404) {
        const content = Buffer.from(
          JSON.stringify(enrichedTokenData, null, 2)
        ).toString("base64");

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
          { status: "Success", data: enrichedTokenData },
          { status: 200 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error(error);
    return Response.json({ status: "Internal Server Error" }, { status: 500 });
  }
}
