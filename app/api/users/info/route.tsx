import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/components/data";
import { isSolidityAddressValid } from "royco/utils";
import { isWalletValid } from "@/components/user";
import { verify } from "jsonwebtoken";

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

    // This proof is actually a jwt and has message being signed as account_address
    const sign_in_token = searchParams.get("sign_in_token");
    const req_account_address = searchParams
      .get("account_address")
      ?.toLowerCase();

    if (!sign_in_token) {
      return Response.json(
        { message: "Sign in token is required" },
        { status: 400 }
      );
    }

    if (!req_account_address) {
      return Response.json(
        { message: "Account address is required" },
        { status: 400 }
      );
    }

    const { account_address } = verify(
      sign_in_token,
      process.env.JWT_SECRET as string
    ) as { account_address: string };

    if (!account_address) {
      return Response.json({ message: "Invalid proof" }, { status: 400 });
    }

    if (req_account_address.toLowerCase() !== account_address.toLowerCase()) {
      return Response.json({ message: "Invalid proof" }, { status: 400 });
    }

    const { data, error } = await supabaseClient
      .rpc("get_user_info", {
        in_account_address: account_address.toLowerCase(),
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
