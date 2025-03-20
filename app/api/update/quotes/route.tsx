import { http } from "@wagmi/core";
import { Address } from "abitype";
import {
  getSupportedChain,
  isSolidityAddressValid,
  parseRawAmount,
  parseRawAmountToTokenAmount,
  refineSolidityAddress,
  shortAddress,
} from "royco/utils";
import { createClient } from "@supabase/supabase-js";
import { createPublicClient, erc20Abi } from "viem";
import { Octokit } from "@octokit/rest";
import { type NextRequest } from "next/server";
import { Database } from "royco/types";
import { BigNumber } from "ethers";
import { ethers } from "ethers";

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

// Add getReserves ABI
const getReservesAbi = [
  {
    inputs: [],
    name: "getReserves",
    outputs: [
      { name: "_reserve0", type: "uint112" },
      { name: "_reserve1", type: "uint112" },
      { name: "_blockTimestampLast", type: "uint32" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const generateId = ({
  source,
  search_id,
}: {
  source: string;
  search_id: number | string;
}) => {
  return `${source}-${search_id.toString()}`;
};

export const updateLpTokenQuotesFromContract = async () => {
  const supabaseClient = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string
  );

  // Run initial token fetch in parallel with setting up chain clients
  const [{ data: lpTokensToUpdate, error: lpTokensToUpdateError }] =
    await Promise.all([
      supabaseClient
        .from("token_index")
        .select("search_id")
        .eq("source", "lp")
        .neq("search_id", "")
        .lte("last_updated", new Date(Date.now() - 1 * 60 * 1000).toISOString())
        .order("last_updated", { ascending: true })
        .limit(100),
    ]);

  if (lpTokensToUpdateError) {
    throw new Error(`Supabase Error: ${lpTokensToUpdateError.message}`);
  }

  if (!lpTokensToUpdate || lpTokensToUpdate.length === 0) return;

  const contracts = lpTokensToUpdate.map((token) => {
    const [chain_id, address] = token.search_id.split("-");
    return {
      chain_id: parseInt(chain_id),
      address,
      abi: erc20Abi,
      functionName: "totalSupply",
    };
  });

  // Create all chain clients in parallel
  const chainClients = {
    1: createPublicClient({
      chain: getSupportedChain(1),
      transport: http(SERVER_RPC_API_KEYS[1], {
        fetchOptions: {
          headers: {
            Origin: "https://app.royco.org",
          },
        },
      }),
    }),
    11155111: createPublicClient({
      chain: getSupportedChain(11155111),
      transport: http(SERVER_RPC_API_KEYS[11155111], {
        fetchOptions: {
          headers: {
            Origin: "https://app.royco.org",
          },
        },
      }),
    }),
    42161: createPublicClient({
      chain: getSupportedChain(42161),
      transport: http(SERVER_RPC_API_KEYS[42161], {
        fetchOptions: {
          headers: {
            Origin: "https://app.royco.org",
          },
        },
      }),
    }),

    8453: createPublicClient({
      chain: getSupportedChain(8453),
      transport: http(SERVER_RPC_API_KEYS[8453], {
        fetchOptions: {
          headers: {
            Origin: "https://app.royco.org",
          },
        },
      }),
    }),

    146: createPublicClient({
      chain: getSupportedChain(146),
      transport: http(SERVER_RPC_API_KEYS[146], {
        fetchOptions: {
          headers: {
            Origin: "https://app.royco.org",
          },
        },
      }),
    }),

    21000000: createPublicClient({
      chain: getSupportedChain(21000000),
      transport: http(SERVER_RPC_API_KEYS[21000000], {
        fetchOptions: {
          headers: {
            Origin: "https://app.royco.org",
          },
        },
      }),
    }),

    98866: createPublicClient({
      chain: getSupportedChain(98866),
      transport: http(SERVER_RPC_API_KEYS[98866], {
        fetchOptions: {
          headers: {
            Origin: "https://app.royco.org",
          },
        },
      }),
    }),
  };

  const contractsByChain = contracts.reduce(
    (acc, contract) => {
      if (!acc[contract.chain_id]) {
        acc[contract.chain_id] = [];
      }
      acc[contract.chain_id].push(contract);
      return acc;
    },
    {} as Record<number, typeof contracts>
  );

  const last_updated = new Date().toISOString();
  const quotes: any[] = [];

  // Process all chains in parallel
  await Promise.all(
    Object.entries(contractsByChain).map(async ([chain_id, chainContracts]) => {
      try {
        const client =
          chainClients[parseInt(chain_id) as keyof typeof chainClients];
        if (!client) return;

        // Single multicall with all contract calls
        const results = await client
          .multicall({
            contracts: chainContracts.flatMap(
              (contract) =>
                [
                  {
                    address: contract.address as Address,
                    abi: erc20Abi,
                    functionName: "totalSupply",
                  },
                  {
                    address: contract.address as Address,
                    abi: [
                      {
                        inputs: [],
                        name: "token0",
                        outputs: [{ type: "address", name: "" }],
                        stateMutability: "view",
                        type: "function",
                      },
                    ],
                    functionName: "token0",
                  },
                  {
                    address: contract.address as Address,
                    abi: [
                      {
                        inputs: [],
                        name: "token1",
                        outputs: [{ type: "address", name: "" }],
                        stateMutability: "view",
                        type: "function",
                      },
                    ],
                    functionName: "token1",
                  },
                  {
                    address: contract.address as Address,
                    abi: erc20Abi,
                    functionName: "decimals",
                  },
                  {
                    address: contract.address as Address,
                    abi: getReservesAbi,
                    functionName: "getReserves",
                  },
                ] as const
            ),
          })
          .catch(() => ({
            results: Array(chainContracts.length * 5).fill({ result: null }),
          }));
        // Process results with updated indexing
        for (
          let i = 0;
          i < (Array.isArray(results) ? results.length : 0);
          i += 5
        ) {
          try {
            const totalSupply = Array.isArray(results)
              ? results[i]?.result
              : undefined;
            const token0Address = Array.isArray(results)
              ? results[i + 1]?.result
              : undefined;
            const token1Address = Array.isArray(results)
              ? results[i + 2]?.result
              : undefined;
            const lpDecimals = Array.isArray(results)
              ? results[i + 3]?.result
              : undefined;
            const reserves = Array.isArray(results)
              ? results[i + 4]?.result
              : undefined;

            // Skip if any required data is missing or addresses are invalid
            if (
              !totalSupply ||
              !token0Address ||
              !token1Address ||
              !reserves ||
              !lpDecimals
            )
              continue;
            if (
              !isSolidityAddressValid("address", token0Address.toString()) ||
              !isSolidityAddressValid("address", token1Address.toString())
            )
              continue;

            // Fetch decimals for token0 and token1
            const [token0Decimals, token1Decimals] = await Promise.all([
              client.readContract({
                address: token0Address as Address,
                abi: erc20Abi,
                functionName: "decimals",
              }),
              client.readContract({
                address: token1Address as Address,
                abi: erc20Abi,
                functionName: "decimals",
              }),
            ]);
            // Destructure reserves array after ensuring it's an array
            const [reserve0, reserve1] = Array.isArray(reserves)
              ? reserves
              : [0, 0];

            quotes.push({
              id: `${chain_id}-${chainContracts[i / 5].address.toLowerCase()}`,
              source: "lp",
              search_id: `${chain_id}-${chainContracts[i / 5].address.toLowerCase()}`,
              total_supply: totalSupply.toString(),
              token0_balance: reserve0.toString(),
              token1_balance: reserve1.toString(),
              token0_address: refineSolidityAddress(
                "address",
                token0Address.toString()
              ),
              token1_address: refineSolidityAddress(
                "address",
                token1Address.toString()
              ),
              token0_decimals: token0Decimals,
              token1_decimals: token1Decimals,
              lp_decimals: lpDecimals,
              last_updated,
            });
          } catch (error) {
            console.error(
              `Error processing LP token ${chainContracts[i / 5]?.address} on chain ${chain_id}:`,
              error
            );
            continue;
          }
        }
      } catch (error) {
        console.error(`Error processing chain ${chain_id}:`, error);
      }
    })
  );

  if (quotes.length === 0) return;

  // Fetch token prices in parallel with preparing unique tokens
  const uniqueTokens = new Set<string>();
  quotes.forEach((quote) => {
    uniqueTokens.add(
      `${quote.search_id.split("-")[0]}-${quote.token0_address.toLowerCase()}`
    );
    uniqueTokens.add(
      `${quote.search_id.split("-")[0]}-${quote.token1_address.toLowerCase()}`
    );
  });

  // Updated query to also fetch decimals
  const { data: tokenPrices, error: tokenPricesError } = await supabaseClient
    .from("token_quotes_latest")
    .select("token_id, price, decimals")
    .in("token_id", Array.from(uniqueTokens))
    .limit(10000);

  if (tokenPricesError) {
    throw new Error(`Supabase Error: ${tokenPricesError.message}`);
  }

  // Create price and decimals lookup maps
  const priceMap = new Map(
    tokenPrices?.map((token) => [token.token_id, token.price]) || []
  );
  const decimalsMap = new Map(
    tokenPrices?.map((token) => [token.token_id, token.decimals]) || []
  );

  // Calculate USD prices for LP tokens with proper decimals
  const quotesWithPrices = quotes.map((quote) => {
    const chainId = quote.search_id.split("-")[0];
    const token0SearchId = `${chainId}-${quote.token0_address.toLowerCase()}`;
    const token1SearchId = `${chainId}-${quote.token1_address.toLowerCase()}`;

    const token0Price = priceMap.get(token0SearchId) || 0;
    const token1Price = priceMap.get(token1SearchId) || 0;
    // Use decimals from token_quotes_latest, fallback to the ones from quote
    const token0Decimals =
      decimalsMap.get(token0SearchId) ?? quote.token0_decimals;
    const token1Decimals =
      decimalsMap.get(token1SearchId) ?? quote.token1_decimals;

    // Calculate total value in USD using BigNumber with proper decimals
    const token0Balance = BigNumber.from(quote.token0_balance);
    const token1Balance = BigNumber.from(quote.token1_balance);
    const token0PriceScaled = ethers.utils.parseUnits(
      token0Price.toString(),
      18
    );
    const token1PriceScaled = ethers.utils.parseUnits(
      token1Price.toString(),
      18
    );

    // Adjust for token decimals using the ones from token_quotes_latest
    const token0Value = token0Balance
      .mul(token0PriceScaled)
      .div(BigNumber.from(10).pow(token0Decimals));
    const token1Value = token1Balance
      .mul(token1PriceScaled)
      .div(BigNumber.from(10).pow(token1Decimals));

    const totalValueUSDScaled = token0Value.add(token1Value);
    const totalValueUSD = parseFloat(
      ethers.utils.formatUnits(totalValueUSDScaled, 18)
    );

    // Calculate price per LP token using LP token decimals
    const totalSupply = BigNumber.from(quote.total_supply);
    const pricePerToken = totalSupply.isZero()
      ? 0
      : totalValueUSD /
        parseFloat(ethers.utils.formatUnits(totalSupply, quote.lp_decimals));

    return {
      id: quote.id,
      source: "lp",
      search_id: quote.search_id,
      price: isNaN(pricePerToken) ? 0 : pricePerToken,
      fdv: isNaN(totalValueUSD) ? 0 : totalValueUSD,
      total_supply: parseFloat(
        ethers.utils.formatUnits(totalSupply, quote.lp_decimals)
      ),
      last_updated,
    };
  });

  // Run final database updates in parallel
  const [
    { data: tokensUpdated, error: tokensUpdatedError },
    { data: tokensIndexUpdated, error: tokensIndexUpdatedError },
  ] = await Promise.all([
    supabaseClient.from("raw_token_quotes").upsert(quotesWithPrices),
    supabaseClient
      .from("token_index")
      .update({
        last_updated,
      })
      .in(
        "search_id",
        quotesWithPrices.map((quote) => quote.search_id)
      )
      .eq("source", "lp"),
  ]);

  if (tokensUpdatedError || tokensIndexUpdatedError) {
    throw new Error(
      `Supabase Error: ${tokensUpdatedError?.message || tokensIndexUpdatedError?.message}`
    );
  }
};

export const updateTokenQuotesFromCoingecko = async () => {
  const supabaseClient = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string
  );

  const { data: tokensToUpdate, error: tokensToUpdateError } =
    await supabaseClient
      .from("token_index")
      .select("search_id")
      .eq("source", "coingecko")
      .neq("search_id", "")
      .lte("last_updated", new Date(Date.now() - 1 * 60 * 1000).toISOString())
      .order("last_updated", { ascending: true })
      .limit(100);

  if (tokensToUpdateError) {
    throw new Error(`Supabase Error: ${tokensToUpdateError.message}`);
  }

  if (!tokensToUpdate || tokensToUpdate.length === 0) return;

  const search_ids = tokensToUpdate.map((token) => token.search_id).join(",");

  const req = await fetch(
    `https://pro-api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${search_ids}`,
    {
      headers: {
        "x-cg-pro-api-key": process.env.COINGECKO_API_KEY!,
      },
    }
  );

  const res = await req.json();

  const last_updated = new Date().toISOString();

  const quotes = res.map((quote: any) => {
    return {
      id: generateId({
        source: "coingecko",
        search_id: quote.id,
      }),
      source: "coingecko",
      search_id: quote.id,
      price: quote.current_price ?? 0,
      fdv: quote.fully_diluted_valuation ?? 0,
      total_supply: quote.total_supply ?? 0,
      last_updated,
    };
  });

  if (quotes.length === 0) return;

  const [
    { data: tokensUpdated, error: tokensUpdatedError },
    { data: tokensIndexUpdated, error: tokensIndexUpdatedError },
  ] = await Promise.all([
    supabaseClient.from("raw_token_quotes").upsert(quotes),

    // update the token_index table's last_updated column
    supabaseClient
      .from("token_index")
      .update({
        last_updated,
      })
      .in(
        "search_id",
        quotes.map((quote: any) => quote.search_id)
      )
      .eq("source", "coingecko"),
  ]);

  if (tokensUpdatedError || tokensIndexUpdatedError) {
    throw new Error(
      `Supabase Error: ${tokensUpdatedError?.message || tokensIndexUpdatedError?.message}`
    );
  }
};

export const updateTokenQuotesFromCoinmarketCap = async () => {
  const supabaseClient = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string
  );

  const { data: tokensToUpdate, error: tokensToUpdateError } =
    await supabaseClient
      .from("token_index")
      .select("search_id")
      .eq("source", "coinmarketcap")
      .neq("search_id", "")
      .lte("last_updated", new Date(Date.now() - 1 * 60 * 1000).toISOString())
      .order("last_updated", { ascending: true })
      .limit(100);

  if (tokensToUpdateError) {
    throw new Error(`Supabase Error: ${tokensToUpdateError.message}`);
  }

  if (!tokensToUpdate || tokensToUpdate.length === 0) return;

  const search_ids = tokensToUpdate.map((token) => token.search_id).join(",");

  const req = await fetch(
    `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${search_ids}`,
    {
      headers: {
        "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY!,
      },
    }
  );

  const res = await req.json();

  if (res.status.error_code !== 0) {
    throw new Error(`CoinmarketCap API Error: ${res.status.error_message}`);
  }

  const last_updated = new Date().toISOString();

  const quotes = Object.values(res.data).map((quote: any) => {
    return {
      id: generateId({
        source: "coinmarketcap",
        search_id: quote.id,
      }),
      source: "coinmarketcap",
      search_id: quote.id.toString(),
      price: quote.quote.USD.price ?? 0,
      fdv: quote.quote.USD.fully_diluted_market_cap ?? 0,
      total_supply: quote.total_supply ?? 0,
      last_updated,
    };
  });

  if (quotes.length === 0) return;

  const [
    { data: tokensUpdated, error: tokensUpdatedError },
    { data: tokensIndexUpdated, error: tokensIndexUpdatedError },
  ] = await Promise.all([
    supabaseClient.from("raw_token_quotes").upsert(quotes),

    // update the token_index table's last_updated column
    supabaseClient
      .from("token_index")
      .update({
        last_updated,
      })
      .in(
        "search_id",
        quotes.map((quote: any) => quote.search_id)
      )
      .eq("source", "coinmarketcap"),
  ]);

  if (tokensUpdatedError || tokensIndexUpdatedError) {
    throw new Error(
      `Supabase Error: ${tokensUpdatedError?.message || tokensIndexUpdatedError?.message}`
    );
  }
};

export const updateTokenQuotesFromEnso = async () => {
  const supabaseClient = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string
  );

  const { data: tokensToUpdate, error: tokensToUpdateError } =
    await supabaseClient
      .from("token_index")
      .select("token_id, search_id, decimals")
      .eq("source", "enso")
      .neq("search_id", "")
      .lte("last_updated", new Date(Date.now() - 10 * 60 * 1000).toISOString())
      .order("last_updated", { ascending: true })
      .limit(100);

  if (tokensToUpdateError) {
    throw new Error(`Supabase Error: ${tokensToUpdateError.message}`);
  }

  if (!tokensToUpdate || tokensToUpdate.length === 0) return;

  const chainClient = createPublicClient({
    chain: getSupportedChain(
      parseInt(tokensToUpdate[0].token_id.split("-")[0])
    ),
    transport: http(SERVER_RPC_API_KEYS[80094], {
      fetchOptions: {
        headers: {
          Origin: "https://app.royco.org",
        },
      },
    }),
  });

  const contracts = tokensToUpdate.map((token) => {
    const [chain_id, contract_address] = token.token_id.split("-");
    return {
      address: contract_address as Address,
      abi: erc20Abi,
      functionName: "totalSupply",
    };
  });

  const results = await chainClient.multicall({ contracts });

  for (let i = 0; i < tokensToUpdate.length; i++) {
    const token = tokensToUpdate[i];
    const [chain_id, contract_address] = token.token_id.split("-");

    try {
      const req = await fetch(
        `https://api.enso.finance/api/v1/prices/${chain_id}/${contract_address}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.ENSO_API_KEY}`,
          },
        }
      );

      const res = (await req.json()) as {
        price: number;
      };

      const last_updated = new Date().toISOString();
      const total_supply =
        results[i].status === "success"
          ? parseRawAmountToTokenAmount(
              results[i].result as string,
              token.decimals
            )
          : 0;
      const fdv = total_supply * res.price;

      const quote = {
        id: generateId({
          source: "enso",
          search_id: token.search_id,
        }),
        source: "enso",
        search_id: token.search_id,
        price: res.price,
        fdv,
        total_supply,
        last_updated,
      };

      const { error: upsertError } = await supabaseClient
        .from("raw_token_quotes")
        .upsert([quote]);

      if (upsertError) {
        throw new Error(`Supabase Error: ${upsertError.message}`);
      }

      // update the token_index table's last_updated column
      await supabaseClient
        .from("token_index")
        .update({
          last_updated,
        })
        .eq("search_id", token.search_id)
        .eq("source", "enso");
    } catch (error) {
      console.error(`Error updating token quotes from Enso: ${error}`);
      continue;
    }
  }
};

const updateTokenQuotesFromPendle = async () => {
  const supabaseClient = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string
  );

  const { data: tokensToUpdate, error: tokensToUpdateError } =
    await supabaseClient
      .from("token_index")
      .select("token_id, search_id, decimals")
      .eq("source", "pendle")
      .neq("search_id", "")
      .lte("last_updated", new Date(Date.now() - 10 * 60 * 1000).toISOString())
      .order("last_updated", { ascending: true })
      .limit(10);

  if (tokensToUpdateError) {
    throw new Error(`Supabase Error: ${tokensToUpdateError.message}`);
  }

  if (!tokensToUpdate || tokensToUpdate.length === 0) return;

  const chainClient = createPublicClient({
    chain: getSupportedChain(
      parseInt(tokensToUpdate[0].token_id.split("-")[0])
    ),
    transport: http(SERVER_RPC_API_KEYS[146], {
      fetchOptions: {
        headers: {
          Origin: "https://app.royco.org",
        },
      },
    }),
  });

  const contracts = tokensToUpdate.map((token) => {
    const [chain_id, contract_address] = token.token_id.split("-");
    return {
      address: contract_address as Address,
      abi: erc20Abi,
      functionName: "totalSupply",
    };
  });

  const results = await chainClient.multicall({ contracts });

  for (let i = 0; i < tokensToUpdate.length; i++) {
    const token = tokensToUpdate[i];
    const [chain_id, contract_address] = token.token_id.split("-");

    try {
      const total_supply =
        results[i].status === "success"
          ? parseRawAmountToTokenAmount(
              results[i].result as string,
              token.decimals
            )
          : 0;

      const req = await fetch(
        `https://api-v2.pendle.finance/core/v1/${chain_id}/assets/prices?addresses=${contract_address}`
      );

      const res = await req.json();

      const quote = {
        id: generateId({
          source: "pendle",
          search_id: token.search_id,
        }),
        source: "pendle",
        search_id: token.search_id,
        price: res.prices[contract_address],
        fdv: total_supply * res.prices[contract_address],
        total_supply,
        last_updated: new Date().toISOString(),
      };

      const { error: upsertError } = await supabaseClient
        .from("raw_token_quotes")
        .upsert([quote]);

      if (upsertError) {
        throw new Error(`Supabase Error: ${upsertError.message}`);
      }
    } catch (error) {
      console.error(`Error updating token quotes from Pendle: ${error}`);
      continue;
    }
  }

  const [{ data: tokensIndexUpdated, error: tokensIndexUpdatedError }] =
    await Promise.all([
      // update the token_index table's last_updated column
      supabaseClient
        .from("token_index")
        .update({
          last_updated: new Date().toISOString(),
        })
        .in(
          "search_id",
          tokensToUpdate.map((quote: any) => quote.search_id)
        )
        .eq("source", "pendle"),
    ]);

  if (tokensIndexUpdatedError) {
    throw new Error(`Supabase Error: ${tokensIndexUpdatedError?.message}`);
  }
};

export async function GET(request: NextRequest) {
  try {
    const results = await Promise.allSettled([
      updateTokenQuotesFromCoingecko(),
      updateTokenQuotesFromCoinmarketCap(),
      updateLpTokenQuotesFromContract(),
      updateTokenQuotesFromEnso(),
      updateTokenQuotesFromPendle(),
    ]);

    // Check for any errors
    const errors = results
      .filter(
        (result): result is PromiseRejectedResult =>
          result.status === "rejected"
      )
      .map((result) => result.reason);

    if (errors.length > 0) {
      // Log all errors
      errors.forEach((error) => {
        console.error("Error updating token quotes:", error);
      });
    }

    // Return success even if there are some errors, as long as the request itself completed
    return Response.json(
      {
        status: "success",
        errors: errors.length > 0 ? errors.map((e) => e.message) : undefined,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/update/quotes route", error);
    return Response.json({ status: "Internal Server Error" }, { status: 500 });
  }
}
