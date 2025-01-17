import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/components/data";
import { isSolidityAddressValid } from "royco/utils";
import { isWalletValid } from "@/components/user";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const fetchCache = "force-no-store";

const supabaseClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const account_address = searchParams.get("account_address");
    const proof = searchParams.get("proof");

    const walledValid = await isWalletValid({ account_address, proof });

    if (!account_address || !walledValid) {
      return Response.json(
        { message: "Invalid wallet address or proof" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseClient
      .rpc("get_user_info", {
        in_account_address: account_address,
      })
      .throwOnError();

    if (error) {
      return Response.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    const { username, email, wallets, created_at } = data[0];

    // Return user
    return Response.json(
      { username, email, wallets, created_at },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/users/info route", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
