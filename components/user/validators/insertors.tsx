import { Database } from "@/components/data";
import { createClient } from "@supabase/supabase-js";

export const insertToWalletsTable = async ({
  account_address,
  balance,
  updated_at,
}: {
  account_address: string;
  balance: number;
  updated_at?: string;
}) => {
  const supabaseClient = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string
  );

  const { data, error } = await supabaseClient
    .from("wallets")
    .upsert({ account_address, balance, updated_at });
};

export const insertToWalletBreakdownTable = async ({
  account_address,
  breakdown,
  updated_at,
}: {
  account_address: string;
  breakdown: Array<{
    id: string;
    community_id: number;
    name: string;
    native_token_id: string;
    logo_url: string;
    wrapped_token_id: string;
    usd_value: number;
  }>;
  updated_at?: string;
}) => {
  const supabaseClient = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string
  );

  const { data, error } = await supabaseClient
    .from("wallet_breakdown")
    .upsert(
      breakdown.map((item) => ({ account_address, ...item, updated_at }))
    );
};
