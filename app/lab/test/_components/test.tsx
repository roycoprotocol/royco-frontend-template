"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/components/data";

export const Test = () => {
  const testFunction = async () => {
    try {
      const client = createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data, error } = await client.rpc(
        "get_enriched_markets_test",
        {
          custom_token_data: [
            {
              token_id: "0x1",
              price: "100",
              fdv: "1000",
              total_supply: "1000000",
            },
          ],
        },
        {
          get: true,
        }
      );

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Button onClick={testFunction}>Click Me</Button>
    </div>
  );
};
