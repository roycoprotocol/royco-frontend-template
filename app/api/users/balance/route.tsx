import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/components/data";
import { isSolidityAddressValid } from "royco/utils";
import {
  insertToWalletsTable,
  insertToWalletBreakdownTable,
} from "@/components/user";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const fetchCache = "force-no-store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const account_address = searchParams.get("account_address")?.toLowerCase();

    if (!account_address) {
      return Response.json(
        { status: "Wallet address not provided" },
        { status: 400 }
      );
    }

    if (!isSolidityAddressValid("address", account_address)) {
      return Response.json(
        { status: "Invalid wallet address" },
        { status: 400 }
      );
    }

    const supabaseClient = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );

    const { data, error } = await supabaseClient
      .from("wallets")
      .select("*")
      .eq("account_address", account_address)
      .limit(1)
      .throwOnError();

    if (data && data.length > 0) {
      const balance = data[0].balance;
      return Response.json({ balance }, { status: 200 });
    }

    // Set headers
    const headers = {
      Accept: "application/json",
      AccessKey: process.env.DEBANK_API_KEY,
    };

    // Create Debank API request
    const url = `https://pro-openapi.debank.com/v1/user/total_balance?id=${account_address}`;

    // Fetch balance from Debank API
    const result = await axios.get(url, {
      headers: headers,
      timeout: 60000,
    });

    // const result = {
    //   data: {
    //     total_usd_value: Math.random() * 1000000,
    //     chain_list: [],
    //   },
    // };

    // Parse balance
    let balance = result.data.total_usd_value;
    if (isNaN(balance)) {
      balance = 0;
    }

    // Update database
    await Promise.all([
      insertToWalletsTable({ account_address, balance }),
      insertToWalletBreakdownTable({
        account_address,
        breakdown: result.data.chain_list,
      }),
    ]);

    // Return balance
    return Response.json({ balance }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/users/balance route", error);
    return Response.json(
      { status: "Internal Server Error", balance: 0 },
      { status: 500 }
    );
  }
}
