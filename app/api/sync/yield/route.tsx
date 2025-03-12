import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { SupportedMarketMap } from "royco/constants";
import { createPublicClient, http } from "viem";
import { getSupportedChain } from "royco/utils";
import { Database } from "royco/types";
import { TypedRoycoClient } from "royco/client";

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

const updateExternalIncentives = async ({
  supabaseClient,
  origin,
}: {
  supabaseClient: SupabaseClient<Database>;
  origin: string;
}) => {
  // Filter markets and calculate batch
  const mapEntries = Object.values(SupportedMarketMap).filter(
    (market) => market.external_incentives !== undefined
  );
  const batchSize = 10;
  const currentMinute = Math.floor(Date.now() / (1000 * 60));
  const minuteInterval = Math.floor(currentMinute);
  const batchIndex = minuteInterval % Math.ceil(mapEntries.length / batchSize);
  const batchMarkets = mapEntries.slice(
    batchIndex * batchSize,
    (batchIndex + 1) * batchSize
  );

  // Fetch incentives in parallel
  const incentiveResults = await Promise.all(
    batchMarkets.map(async (market) => {
      try {
        const chain_id = parseInt(market.id.split("_")[0]);
        const market_type = parseInt(market.id.split("_")[1]);
        const market_id = market.id.split("_")[2];

        const chain = getSupportedChain(chain_id);

        const chainClient = createPublicClient({
          chain: chain,
          transport: http(
            SERVER_RPC_API_KEYS[chain_id as keyof typeof SERVER_RPC_API_KEYS],
            {
              fetchOptions: {
                headers: {
                  Origin: origin,
                },
              },
            }
          ),
        });

        const token_ids = market.external_incentives!.map(
          (incentive_token) => incentive_token.token_id
        );

        const values = await Promise.all(
          market.external_incentives!.map(async (incentie_token) => {
            const value = await incentie_token.value!({
              // @ts-ignore
              roycoClient: supabaseClient as TypedRoycoClient,
              chainClient,
            });
            return value;
          })
        );

        return {
          id: market.id,
          chain_id,
          market_type,
          market_id,
          token_ids,
          values,
          updated_at: new Date().toISOString(),
        };
      } catch (error) {
        console.error(`Error fetching yield for market ${market.id}:`, error);
        return null;
      }
    })
  );

  // Filter out failed requests and upsert to database
  const validResults = incentiveResults.filter(
    (result): result is NonNullable<typeof result> => result !== null
  );

  if (validResults.length > 0) {
    await supabaseClient.from("raw_external_incentives").upsert(validResults);
  }
};

const updateNativeYields = async ({
  supabaseClient,
  origin,
}: {
  supabaseClient: SupabaseClient<Database>;
  origin: string;
}) => {
  // Filter markets and calculate batch
  const mapEntries = Object.values(SupportedMarketMap).filter(
    (market) => market.native_yield !== undefined
  );
  const batchSize = 10;
  const currentMinute = Math.floor(Date.now() / (1000 * 60));
  const minuteInterval = Math.floor(currentMinute);
  const batchIndex = minuteInterval % Math.ceil(mapEntries.length / batchSize);
  const batchMarkets = mapEntries.slice(
    batchIndex * batchSize,
    (batchIndex + 1) * batchSize
  );

  // Fetch yields in parallel
  const yieldResults = await Promise.all(
    batchMarkets.map(async (market) => {
      try {
        const chain_id = parseInt(market.id.split("_")[0]);
        const market_type = parseInt(market.id.split("_")[1]);
        const market_id = market.id.split("_")[2];

        const chain = getSupportedChain(chain_id);

        const chainClient = createPublicClient({
          chain: chain,
          transport: http(
            SERVER_RPC_API_KEYS[chain_id as keyof typeof SERVER_RPC_API_KEYS],
            {
              fetchOptions: {
                headers: {
                  Origin: origin,
                },
              },
            }
          ),
        });

        const token_ids = market.native_yield!.map(
          (incentive_token) => incentive_token.token_id
        );

        const annual_change_ratios = await Promise.all(
          market.native_yield!.map(async (incentie_token) => {
            const annual_change_ratio =
              await incentie_token.annual_change_ratio!({
                // @ts-ignore
                roycoClient: supabaseClient as TypedRoycoClient,
                chainClient,
              });
            return annual_change_ratio;
          })
        );

        const annual_change_ratio = annual_change_ratios.reduce(
          (acc, curr) => acc + curr,
          0
        );

        return {
          id: market.id,
          chain_id,
          market_type,
          market_id,
          token_ids,
          annual_change_ratios,
          annual_change_ratio,
          updated_at: new Date().toISOString(),
        };
      } catch (error) {
        console.error(`Error fetching yield for market ${market.id}:`, error);
        return null;
      }
    })
  );

  // Filter out failed requests and upsert to database
  const validResults = yieldResults.filter(
    (result): result is NonNullable<typeof result> => result !== null
  );

  if (validResults.length > 0) {
    await supabaseClient.from("raw_native_yields").upsert(validResults);
  }
};

const updateUnderlyingYields = async ({
  supabaseClient,
  origin,
}: {
  supabaseClient: SupabaseClient<Database>;
  origin: string;
}) => {
  // Filter markets and calculate batch
  const mapEntries = Object.values(SupportedMarketMap).filter(
    (market) => market.underlying_yield !== undefined
  );
  const batchSize = 10;
  const currentMinute = Math.floor(Date.now() / (1000 * 60));
  const minuteInterval = Math.floor(currentMinute);
  const batchIndex = minuteInterval % Math.ceil(mapEntries.length / batchSize);
  const batchMarkets = mapEntries.slice(
    batchIndex * batchSize,
    (batchIndex + 1) * batchSize
  );

  // Fetch yields in parallel
  const yieldResults = await Promise.all(
    batchMarkets.map(async (market) => {
      try {
        const chain_id = parseInt(market.id.split("_")[0]);
        const market_type = parseInt(market.id.split("_")[1]);
        const market_id = market.id.split("_")[2];

        const chain = getSupportedChain(chain_id);

        const chainClient = createPublicClient({
          chain: chain,
          transport: http(
            SERVER_RPC_API_KEYS[chain_id as keyof typeof SERVER_RPC_API_KEYS],
            {
              fetchOptions: {
                headers: {
                  Origin: origin,
                },
              },
            }
          ),
        });

        const annual_change_ratio = await market.underlying_yield!({
          // @ts-ignore
          roycoClient: supabaseClient as TypedRoycoClient,
          chainClient,
        });

        return {
          id: market.id,
          chain_id,
          market_type,
          market_id,
          annual_change_ratio,
          updated_at: new Date().toISOString(),
        };
      } catch (error) {
        console.error(`Error fetching yield for market ${market.id}:`, error);
        return null;
      }
    })
  );

  // Filter out failed requests and upsert to database
  const validResults = yieldResults.filter(
    (result): result is NonNullable<typeof result> => result !== null
  );

  console.log(validResults);

  if (validResults.length > 0) {
    await supabaseClient.from("raw_underlying_yields").upsert(validResults);
  }
};

export async function GET(request: Request) {
  try {
    const origin = request.headers.get("origin") || "https://app.royco.org";
    const supabaseClient = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );

    await Promise.all([
      updateNativeYields({ supabaseClient, origin }),
      updateUnderlyingYields({ supabaseClient, origin }),
      updateExternalIncentives({ supabaseClient, origin }),
    ]);

    return Response.json(
      {
        status: "Success",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/sync/yield route", error);
    return Response.json({ status: "Internal Server Error" }, { status: 500 });
  }
}
