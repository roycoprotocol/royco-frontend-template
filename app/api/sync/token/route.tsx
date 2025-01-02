import { createClient } from "@supabase/supabase-js";
import { SupportedTokenMap } from "royco/constants";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const fetchCache = "force-no-store";

export async function GET(request: Request) {
  try {
    const supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );

    // Calculate batch size for the SupportedTokenMap entries
    const mapEntries = Object.values(SupportedTokenMap);
    const batchSize = 100;
    const currentTime = Math.floor(Date.now() / (1000 * 60)); // Convert to minutes since epoch
    const totalBatches = Math.ceil(mapEntries.length / batchSize);
    const batchIndex = currentTime % totalBatches;
    const batchTokens = mapEntries.slice(
      batchIndex * batchSize,
      (batchIndex + 1) * batchSize
    );

    console.log(
      `Processing batch ${batchIndex + 1} of ${totalBatches}, tokens: ${batchTokens.length}`
    );

    // Convert batch tokens to upsert records
    const upsertRecords = batchTokens.map((token) => ({
      token_id: token.id,
      chain_id: token.chain_id,
      contract_address: token.contract_address,
      source: token.source,
      name: token.name,
      symbol: token.symbol,
      is_active: true,
      search_id: token.search_id,
      decimals: token.decimals,
    }));

    // Perform batch upsert
    const { data, error } = await supabaseClient
      .from("token_index")
      .upsert(upsertRecords);

    if (error) {
      console.error("Error in route", error);
      return Response.json(
        { status: "Internal Server Error" },
        { status: 500 }
      );
    }

    return Response.json({ status: "Success" }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/sync/token route", error);
    return Response.json({ status: "Internal Server Error" }, { status: 500 });
  }
}
