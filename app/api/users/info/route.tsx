import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/components/data";
import { isSolidityAddressValid } from "royco/utils";
import { isCachedWalletValid } from "@/components/user";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const fetchCache = "force-no-store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const account_address = searchParams.get("account_address");
    const proof = searchParams.get("proof");

    if (!account_address) {
      return Response.json(
        { message: "Wallet address not provided" },
        { status: 400 }
      );
    }

    if (!isSolidityAddressValid("address", account_address)) {
      return Response.json(
        { message: "Invalid wallet address" },
        { status: 400 }
      );
    }

    if (!proof) {
      return Response.json(
        { message: "Ownership proof not provided" },
        { status: 400 }
      );
    }

    if (typeof proof !== "string") {
      return Response.json(
        { message: "Invalid ownership proof" },
        { status: 400 }
      );
    }

    const isOwnershipProofValid = await isCachedWalletValid({
      account_address,
      proof,
    });

    if (!isOwnershipProofValid) {
      return Response.json(
        { message: "Mismatch between wallet address and ownership proof" },
        { status: 400 }
      );
    }

    const supabaseClient = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );

    const { data: wallet_user_data, error: wallet_user_error } =
      await supabaseClient
        .from("wallet_user_map")
        .select("*")
        .eq("account_address", account_address)
        .limit(1)
        .throwOnError();

    if (!wallet_user_data || wallet_user_data.length === 0) {
      return Response.json({ message: "User not found" }, { status: 400 });
    }

    const username = wallet_user_data[0].username;

    const [user_data, wallets_data] = await Promise.all([
      supabaseClient
        .from("users")
        .select("*")
        .eq("username", username)
        .limit(1)
        .throwOnError(),
      supabaseClient
        .from("wallet_user_map")
        .select("*")
        .eq("username", username)
        .throwOnError(),
    ]);

    if (!user_data.data || user_data.data.length === 0) {
      return Response.json({ message: "User not found" }, { status: 400 });
    }

    const email = user_data.data[0].email;
    const created_at = user_data.data[0].created_at;
    const wallets =
      wallets_data.data?.map((wallet) => wallet.account_address) || [];

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
