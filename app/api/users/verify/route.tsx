import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/components/data";
import axios from "axios";
import validator from "validator";
import { Resend } from "resend";
import jwt from "jsonwebtoken";
import { isSolidityAddressValid } from "royco/utils";
import {
  isEmailValid,
  isHashValid,
  isUsernameValid,
  areWalletsValid,
  isWalletValid,
} from "@/components/user";
import { RegisterUserTemplate } from "@/components/constants";
import { createHash } from "crypto";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const fetchCache = "force-no-store";

const supabaseClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export const updateUserHashMapTable = async ({ hash }: { hash: string }) => {
  try {
    const { data, error } = await supabaseClient
      .from("user_hash_map")
      .update({
        is_used: true,
      })
      .eq("hash", hash);

    if (error) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

export const insertToUsersTable = async ({
  username,
  email,
}: {
  username: string;
  email: string;
}) => {
  try {
    const { data, error } = await supabaseClient.from("users").insert({
      username,
      email,
    });

    if (error) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

export const insertToWalletUserMapTable = async ({
  account_address,
  username,
}: {
  account_address: string;
  username: string;
}) => {
  try {
    const { data, error } = await supabaseClient
      .from("wallet_user_map")
      .insert({
        account_address,
        username,
      });

    if (error) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

export async function POST(request: Request) {
  try {
    const {
      token,
      otp: userOtp,
    }: {
      token: string;
      otp: number;
    } = await request.json();

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      username: string;
      email: string;
      wallets: {
        account_address: string;
        proof: string;
      }[];
      otp: number;
    };

    const { username, email, wallets, otp: actualOtp } = decoded;
    const hash = createHash("sha256").update(token).digest("hex");

    if (userOtp !== actualOtp) {
      return Response.json({ status: "Invalid OTP" }, { status: 400 });
    }

    const [usernameValid, emailValid, walletsValid, hashValid] =
      await Promise.all([
        isUsernameValid({ username }),
        isEmailValid({ email }),
        areWalletsValid({ wallets }),
        isHashValid({ hash }),
      ]);

    if (!hashValid) {
      return Response.json(
        { status: "User already registered" },
        { status: 400 }
      );
    }

    if (!usernameValid) {
      return Response.json(
        { status: "Username already registered" },
        { status: 400 }
      );
    }

    if (!emailValid) {
      return Response.json(
        { status: "Email already registered" },
        { status: 400 }
      );
    }

    if (!walletsValid) {
      return Response.json({ status: "Invalid wallets" }, { status: 400 });
    }

    const result = await Promise.all([
      insertToUsersTable({ username, email }),
      ...wallets.map((wallet) =>
        insertToWalletUserMapTable({
          account_address: wallet.account_address,
          username,
        })
      ),
      updateUserHashMapTable({ hash }),
    ]);

    if (result.some((r) => !r)) {
      return Response.json(
        { status: "Internal Server Error" },
        { status: 500 }
      );
    }

    return Response.json(
      {
        status: "Success",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/users/verify route", error);
    return Response.json({ status: "Internal Server Error" }, { status: 500 });
  }
}
