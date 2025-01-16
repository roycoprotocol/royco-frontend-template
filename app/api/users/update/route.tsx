import { createClient } from "@supabase/supabase-js";
import { Database } from "@/components/data";
import axios from "axios";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const fetchCache = "force-no-store";

export async function GET(request: Request) {
  try {
    const supabaseClient = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );

    // Fetch 50 users at a time
    const { data, error } = await supabaseClient
      .from("wallets")
      .select("*")
      .lt(
        "updated_at",
        new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      ) // 24 hours
      .order("updated_at", { ascending: true })
      .limit(50);

    if (!!data && data.length > 0) {
      await Promise.all(
        data.map(async (item) => {
          const account_address = item.account_address.toLowerCase();
          const headers = {
            Accept: "application/json",
            AccessKey: process.env.DEBANK_API_KEY,
          };

          const url = `https://pro-openapi.debank.com/v1/user/total_balance?id=${account_address}`;
          const result = await axios.get(url, {
            headers: headers,
            timeout: 60000,
          });

          // Parse balance
          let balance = parseFloat(result.data.total_usd_value);
          if (isNaN(balance)) {
            balance = 0;
          }

          // Set updated_at to current time
          const updated_at = new Date().toISOString();

          // Update user_wallets table
          const { data: dataUpdate, error: errorUpdate } = await supabaseClient
            .from("wallets")
            .update({
              balance,
              updated_at,
            })
            .eq("account_address", item.account_address);
        })
      );
    }

    return Response.json(
      {
        status: "Success",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/users/update route", error);
    return Response.json({ status: "Internal Server Error" }, { status: 500 });
  }
}
