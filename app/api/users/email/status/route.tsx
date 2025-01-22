import { createClient } from "@supabase/supabase-js";
import { Database } from "@/components/data";
import axios from "axios";
import validator from "validator";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const fetchCache = "force-no-store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return Response.json({ status: "Email is required" }, { status: 400 });
    }

    if (!validator.isEmail(email)) {
      return Response.json(
        { status: "Invalid email address" },
        { status: 400 }
      );
    }

    const supabaseClient = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );

    const { data, error } = await supabaseClient
      .from("users")
      .select("*")
      .eq("email", email)
      .limit(1)
      .throwOnError();

    if (error || !data || data.length === 0) {
      return Response.json({ status: "Email not found" }, { status: 404 });
    }

    return Response.json(
      {
        status: "Success",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/users/email/status route", error);
    return Response.json({ status: "Internal Server Error" }, { status: 500 });
  }
}
