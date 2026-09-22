import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { validateUser } from "@/auth-guard";

export async function GET() {
  const { error: authError } = await validateUser(["org:admin", "org:staff"]);
  if (authError) return authError;

  const { data } = await supabaseAdmin
    .from("best_sellers_today")
    .select("*")
    .limit(5);

  return NextResponse.json(data);
}
