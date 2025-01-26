import { http } from "@wagmi/core";
import { Address } from "abitype";
import {
  getSupportedChain,
  isSolidityAddressValid,
  refineSolidityAddress,
  shortAddress,
} from "royco/utils";
import { createClient } from "@supabase/supabase-js";
import { erc20Abi } from "viem";
import { Octokit } from "@octokit/rest";
import { type NextRequest } from "next/server";
import { Database } from "royco/types";

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
};

export const generateId = ({
  source,
  search_id,
}: {
  source: string;
  search_id: number | string;
}) => {
  return `${source}-${search_id.toString()}`;
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
      last_updated: new Date().toISOString(),
    };
  });

  if (quotes.length === 0) return;

  const [{ data: tokensUpdated, error: tokensUpdatedError }] =
    await Promise.all([supabaseClient.from("raw_token_quotes").upsert(quotes)]);

  if (tokensUpdatedError) {
    throw new Error(`Supabase Error: ${tokensUpdatedError.message}`);
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
      last_updated: new Date().toISOString(),
    };
  });

  if (quotes.length === 0) return;

  const [{ data: tokensUpdated, error: tokensUpdatedError }] =
    await Promise.all([supabaseClient.from("raw_token_quotes").upsert(quotes)]);

  if (tokensUpdatedError) {
    throw new Error(`Supabase Error: ${tokensUpdatedError.message}`);
  }
};

export async function GET(request: NextRequest) {
  try {
    const results = await Promise.allSettled([
      updateTokenQuotesFromCoingecko(),
      updateTokenQuotesFromCoinmarketCap(),
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
