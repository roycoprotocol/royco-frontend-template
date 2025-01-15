import { createClient } from "@supabase/supabase-js";
import { Database } from "@/components/data";
import axios from "axios";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const fetchCache = "force-no-store";

export async function GET(request: Request) {
  try {
    return Response.json(
      {
        status: "Success",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/users/email route", error);
    return Response.json({ status: "Internal Server Error" }, { status: 500 });
  }
}
