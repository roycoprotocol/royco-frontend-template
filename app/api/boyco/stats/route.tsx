import axios from "axios";
import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

const vaults = [
  "0x8f88ae3798e8ff3d0e0de7465a0863c9bbb577f0",
  "0xf401cc9f467c7046796d9a8b44b0c1348b4deec7",
  "0x5717499f3F89e47aDDd714c1f12718A36B8a1Fae",
  "0x083072701572A0ad1827fFe9A953d6932bA4574D",
  "0x83599937c2C9bEA0E0E8ac096c6f32e86486b410",
  "0xC673ef7791724f0dcca38adB47Fbb3AEF3DB6C80",
  "0x34bdba9b3d8e3073eb4470cd4c031c2e39c32da8",
  "0x52c2bc859f5082c4f8c17266a3cd640b5047370e",
  "0x5791Ad4f227eEEBfFbA81037aB287c008A714F72",
  "0xe7f8AAce18Cb4a831d4dFFc08ECb3bdf6C35ef69",
  "0x9dc37e4a901b1e21bd05e75c3b9a633a17001a39",
  "0x1a6945f6AB444394D07c98643C1A669D69f4816E",
  "0x9dc37e4a901b1e21bd05e75c3b9a633a17001a39",
  "0xf80c6636f9597d6a7fc1e5182b168b71e98fd1cb",
  "0xE254B56E24e8939FD513E2CDB060DeC96d9Ee26d",
  "0xefe4c96820f24c4bc6b2d621fd5feb2b46adc1df",
  "0x6dD1736E15857eE65889927f40CE3cbde3c59Cb2",
  "0x83B5ab43b246F7afDf465103eb1034c8dfAf36f2",
  "0xf7cb66145c5Fbc198cD4E43413b61786fb12dF95",
  "0xe4794e30AA190baAA953D053fC74b5e50b3575d7",
  "0x6A2162277aA0c8533E09A9402026e0085cbDBAFb",
  "0x0b5d3121E144cf1410850c9608651a039BFd543e",
  "0x4adD00e818c4ed8fd69718A74B5D54Fa1DbbBb2a",
  "0x298b365CBcb6FdcBB3cFf87fEE9107078922118f",
  "0x4B4E9F11c289dE7cDe3a40B1226Cef592cE043c7",
  "0x61e2de83bbab5a7a5bb2c5d40a5f737135eeaa13",
  "0xcF9273BA04b875F94E4A9D8914bbD6b3C1f08EDb",
  "0x3d93B9e8F0886358570646dAd9421564C5fE6334",
  "0x02A85B10BcaebbCED4141fc0460D6eE3a15716A7",
  "0x3b3501f6778Bfc56526cF2aC33b78b2fDBE4bc73",
  "0xc027EC28F76d92D4124fCbffCF6b25137a84968C",
  "0x8C5DED5CB9cA7AD50d85B1331733a8DE4B111247",
  "0x0178b56FeA3d7B5B9F9e0cDAd486522de948730F",
];

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

    const vaultPromises = vaults.map((vault) =>
      axios.get(
        `https://pro-openapi.debank.com/v1/user/chain_balance?id=${vault}&chain_id=eth`,
        {
          headers: {
            "X-Dune-API-Key": process.env.DUNE_API_KEY,
          },
        }
      )
    );

    const responses = await Promise.all(vaultPromises);

    const totalBalance = responses.reduce(
      (sum, response) => sum + response.data.usd_value,
      0
    );

    const tvlData = {
      vault_tvl: totalBalance,
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
