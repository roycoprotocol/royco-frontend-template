import { createClient } from "@supabase/supabase-js";
import { SupportedTokenMap } from "royco/constants";

export const dynamic = true;

export async function GET(request: Request) {
  try {
    const supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );

    // Calculate batch size for the SupportedTokenMap entries
    const mapEntries = Object.values(SupportedTokenMap);
    const batchSize = 100;
    const currentMinute = new Date().getUTCMinutes();
    const batchIndex = currentMinute % Math.ceil(mapEntries.length / batchSize);
    const batchTokens = mapEntries.slice(
      batchIndex * batchSize,
      (batchIndex + 1) * batchSize
    );

    // Process tokens in the current batch
    for (const token of batchTokens) {
      await supabaseClient.from("token_index").upsert({
        token_id: token.id,
        chain_id: token.chain_id,
        contract_address: token.contract_address,
        source: token.source,
        name: token.name,
        symbol: token.symbol,
        is_active: true,
        search_id: token.search_id,
        decimals: token.decimals,
      });
    }

    return Response.json({ status: "Success" }, { status: 200 });
  } catch (error) {
    console.error("Error in route", error);
    return Response.json({ status: "Internal Server Error" }, { status: 500 });
  }
}
