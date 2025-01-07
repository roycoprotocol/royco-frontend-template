import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getSupportedMarket, SupportedMarketMap } from "royco/constants";
import { RPC_API_KEYS } from "@/components/constants";
import { createPublicClient, http } from "viem";
import { getSupportedChain } from "royco/utils";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const fetchCache = "force-no-store";

export async function GET(request: Request) {
  try {
    let underlying_annual_change_ratio = 0;

    try {
      // Fetch the custom APY from your API
      const custom_apy_res = await fetch(
        "https://app.nest.credit/api/nest-rwa-vault"
      );

      // Parse the response as JSON
      const custom_apy_data = await custom_apy_res.json();

      console.log(custom_apy_data.estimatedApy);

      // Extract the underlying yield from the custom APY data & perform calculations, if needed and then update the underlying_annual_change_ratio
      underlying_annual_change_ratio =
        Number(custom_apy_data.estimatedApy) ?? 0;
    } catch (error) {
      console.error(error);
    }

    return Response.json(
      {
        status: "Success",
        data: underlying_annual_change_ratio,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/sync/yield route", error);
    return Response.json({ status: "Internal Server Error" }, { status: 500 });
  }
}
