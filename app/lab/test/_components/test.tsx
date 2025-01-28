"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";
import { useRoycoClient } from "royco/client";
// import { Database } from "@/components/data";

export const Test = () => {
  const roycoClient = useRoycoClient();

  const testFunction = async () => {
    try {
      // const client = createClient<Database>(
      //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
      //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      // );

      // const { data, error } = await client.rpc(
      //   "get_enriched_markets_test",
      //   {
      //     custom_token_data: [
      //       {
      //         token_id: "0x1",
      //         price: "100",
      //         fdv: "1000",
      //         total_supply: "1000000",
      //       },
      //     ],
      //   },
      //   {
      //     get: true,
      //   }
      // );

      // console.log(data);

      const { data, error } = await roycoClient.rpc("get_token_quotes_test", {
        token_ids: ["0x1"],
        custom_token_data: [
          {
            token_id: "0x1",
            price: 100,
            fdv: 1000,
            total_supply: 1000000,
          },
        ],
      });

      console.log("data", data);
      console.log("error", error);
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
