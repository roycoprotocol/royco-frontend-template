import { createClient } from "@supabase/supabase-js";
import { SupportedMarketMap } from "royco/constants";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const fetchCache = "force-no-store";

export async function GET(request: Request) {
  try {
    const supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );

    // Calculate batch size for the SupportedMarketMap entries
    const mapEntries = Object.values(SupportedMarketMap);
    const batchSize = 100;
    const currentMinute = new Date().getUTCMinutes();
    const batchIndex = currentMinute % Math.ceil(mapEntries.length / batchSize);
    const batchMarkets = mapEntries.slice(
      batchIndex * batchSize,
      (batchIndex + 1) * batchSize
    );

    // Process markets in the current batch
    for (const market of batchMarkets) {
      await supabaseClient.from("market_userdata").upsert({
        id: market.id,
        name: market.name,
        description: market.description,
        is_verified: market.is_verified,
      });
    }

    return Response.json({ status: "Success" }, { status: 200 });
  } catch (error) {
    console.error("Error in route", error);
    return Response.json({ status: "Internal Server Error" }, { status: 500 });
  }
}
