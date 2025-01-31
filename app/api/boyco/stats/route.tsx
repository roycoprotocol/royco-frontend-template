import axios from "axios";
import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function GET() {
  try {
    // Try to get cached values first
    const cachedData = await kv.get("boyco_vault_stats");
    const cacheTime = await kv.get("boyco_vault_stats_timestamp");

    // Check if cache exists and is less than 5 minutes old
    if (
      cachedData &&
      cacheTime &&
      Date.now() - Number(cacheTime) < 5 * 60 * 1000
    ) {
      return NextResponse.json(cachedData);
    }

    const response = await axios.get(
      `https://api.dune.com/api/v1/query/4477598/results?limit=1000`,
      {
        headers: {
          "X-Dune-API-Key": process.env.DUNE_API_KEY,
        },
      }
    );

    const totalVaultTvl = response.data.result.rows.find(
      (row: any) => row.projects === "Total"
    );

    const tvlData = {
      vault_tvl: totalVaultTvl.deposited_usd,
    };

    // Store the new values in KV
    await kv.set("boyco_vault_stats", tvlData);
    await kv.set("boyco_vault_stats_timestamp", Date.now());

    return NextResponse.json(tvlData);
  } catch (error) {
    // Try to return cached data if available, even if expired
    const cachedData = await kv.get("boyco_vault_stats");
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    return NextResponse.json(
      { error: "Failed: getting market stats" },
      { status: 500 }
    );
  }
}
