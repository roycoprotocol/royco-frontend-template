import { OwnershipProofMessage } from "@/components/constants";
import { isSolidityAddressValid } from "royco/utils";
import { recoverMessageAddress } from "viem";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/components/data";
import axios from "axios";
import validator from "validator";
import { Resend } from "resend";
import jwt from "jsonwebtoken";
import { RegisterUserTemplate } from "@/components/constants";
import { createHash } from "crypto";

export const isWalletValid = async ({
  account_address,
  proof,
}: {
  account_address: string | null | undefined;
  proof: string | null | undefined;
}) => {
  try {
    if (!account_address || !proof) return false;

    if (!isSolidityAddressValid("address", account_address)) return false;

    const message_signer = await recoverMessageAddress({
      message: OwnershipProofMessage,
      signature: proof as `0x${string}`,
    });

    if (message_signer.toLowerCase() !== account_address.toLowerCase())
      return false;

    return true;
  } catch (err) {
    return false;
  }
};

export const isUsernameValid = async ({
  username,
}: {
  username: string | null | undefined;
}) => {
  try {
    if (!username) return false;

    if (typeof username !== "string") return false;

    if (username.length < 3) return false;

    const supabaseClient = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );

    const { data, error } = await supabaseClient
      .from("users")
      .select("*")
      .eq("username", username)
      .limit(1);

    if (error) return false;

    if (data && data.length > 0) return false;

    return true;
  } catch (error) {
    return false;
  }
};

export const isEmailValid = async ({
  email,
}: {
  email: string | null | undefined;
}) => {
  try {
    if (!email) return false;

    if (typeof email !== "string") return false;

    if (!validator.isEmail(email)) return false;

    const supabaseClient = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );

    const { data, error } = await supabaseClient
      .from("users")
      .select("*")
      .eq("email", email)
      .limit(1);

    if (error) return false;

    if (data && data.length > 0) return false;

    return true;
  } catch (error) {
    return false;
  }
};

export const areWalletsValid = async ({
  wallets,
}: {
  wallets:
    | {
        account_address: string;
        proof: string;
      }[]
    | null
    | undefined;
}) => {
  try {
    if (!wallets) return false;

    if (typeof wallets !== "object") return false;

    if (wallets.length === 0) return false;

    const results = await Promise.all(
      wallets.map(async (wallet) => {
        return isWalletValid({
          account_address: wallet.account_address,
          proof: wallet.proof,
        });
      })
    );

    return results.every((result) => result === true);
  } catch (error) {
    return false;
  }
};

export const isHashValid = async ({
  hash,
}: {
  hash: string | null | undefined;
}) => {
  try {
    if (!hash) return false;

    if (typeof hash !== "string") return false;

    const supabaseClient = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );

    const { data, error } = await supabaseClient
      .from("user_hash_map")
      .select("*")
      .eq("hash", hash)
      .limit(1);

    if (error) return false;

    if (!data || data.length === 0) return false;

    if (data[0].is_used === true) return false;

    return true;
  } catch (error) {
    return false;
  }
};
