import { createClient } from "@supabase/supabase-js";
import { SupportedMarketMap } from "royco/constants";
import { RPC_API_KEYS } from "@/components/constants";
import { createPublicClient, http } from "viem";
import { getSupportedChain } from "royco/utils";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const fetchCache = "force-no-store";

export async function GET(request: Request) {
  try {
    const supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );

    // Filter markets and calculate batch
    const mapEntries = Object.values(SupportedMarketMap).filter(
      (market) => typeof market.native_yield === "function"
    );
    const batchSize = 100;
    const currentMinute = new Date().getUTCMinutes();
    const batchIndex = currentMinute % Math.ceil(mapEntries.length / batchSize);
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
            transport: http(RPC_API_KEYS[chain_id]),
          });

          const yieldData = await market.native_yield!({
            roycoClient: supabaseClient,
            chainClient,
          });

          return {
            id: market.id,
            chain_id,
            market_type,
            market_id,
            annual_change_ratio: yieldData.native_annual_change_ratio,
            updated_at: new Date(),
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

    return Response.json(
      {
        status: "Success",
        processed: batchMarkets.length,
        successful: validResults.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/sync/yield route", error);
    return Response.json({ status: "Internal Server Error" }, { status: 500 });
  }
}
