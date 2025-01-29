import axios from "axios";
import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

const walletAddress = "0x63E8209CAa13bbA1838E3946a50d717071A28CFB";
const tokenAddresses = [
  "0x004375dff511095cc5a197a54140a24efef3a416",
  "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc",
  "0xbb2b8038a1640196fbe3e38816f3e67cba72d940",
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  "0xdac17f958d2ee523a2206206994597c13d831ec7",
  "0x004375dff511095cc5a197a54140a24efef3a416",
  "0x3041cbd36888becc7bbcbc0045e3b1f144466f5f",
];

export async function GET() {
  try {
    // Try to get cached values first
    const cachedData = await kv.get("tvl_stats");
    const cacheTime = await kv.get("tvl_stats_timestamp");

    // Check if cache exists and is less than 5 minutes old
    if (
      cachedData &&
      cacheTime &&
      Date.now() - Number(cacheTime) < 5 * 60 * 1000
    ) {
      return NextResponse.json(cachedData);
    }

    const chainId = "eth";
    const response = await axios.get(
      `https://pro-openapi.debank.com/v1/user/token_list?id=${walletAddress}&chain_id=${chainId}&is_all=true`,
      {
        headers: {
          AccessKey: process.env.DEBANK_API_ACCESS_KEY,
        },
      }
    );

    let majorTvl = response.data.reduce((acc: number, token: any) => {
      if (tokenAddresses.includes(token.id.toLowerCase())) {
        return acc + token.amount * token.price;
      }
      return acc;
    }, 0);

    let tvl = response.data.reduce((acc: number, token: any) => {
      return acc + token.amount * token.price;
    }, 0);

    let thirdPartyTvl = response.data.reduce((acc: number, token: any) => {
      if (!tokenAddresses.includes(token.id.toLowerCase())) {
        return acc + token.amount * token.price;
      }
      return acc;
    }, 0);

    const tvlData = {
      major_tvl: majorTvl,
      third_party_tvl: thirdPartyTvl,
      tvl,
    };

    // Store the new values in KV
    await kv.set("tvl_stats", tvlData);
    await kv.set("tvl_stats_timestamp", Date.now());

    return NextResponse.json(tvlData);
  } catch (error) {
    // Try to return cached data if available, even if expired
    const cachedData = await kv.get("tvl_stats");
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    return NextResponse.json(
      { error: "Failed: getting market stats" },
      { status: 500 }
    );
  }
}
