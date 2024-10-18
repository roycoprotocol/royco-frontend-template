// import React from "react";

// import { useContext } from "react";

// import { createBrowserClient } from "@supabase/ssr";
// import type { Database } from "@/types/supabase";
// import type { TypedSupabaseClient } from "@/utils/types";
// import { useMemo } from "react";
// // import { RoycoContext } from "royco";

// import { RoycoContext } from "royco/provider";

// let client: TypedSupabaseClient | undefined;

// const useRoycoClient = () => {
//   // const { roycoUrl, roycoKey } = React.useContext(RoycoContext);
//   const { roycoUrl, roycoKey } = useContext<{
//     roycoUrl: string;
//     roycoKey: string;
//   }>(RoycoContext);

//   if (client) {
//     return client;
//   }

//   client = createBrowserClient<Database>(roycoUrl, roycoKey);

//   return client;
// };

// // function useRoycoClient() {
// //   return useMemo(getRoycoClient, []);
// // }

// export default useRoycoClient;

export * from "./horizontal-tabs";
