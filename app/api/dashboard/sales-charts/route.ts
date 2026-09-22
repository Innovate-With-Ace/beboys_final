import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { validateUser } from "@/auth-guard";

export async function GET() {
  const { error: authError } = await validateUser(["org:admin", "org:staff"]);
  if (authError) return authError;

  const { data, error } = await supabaseAdmin
    .from("sales_last_7_days")
    .select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
