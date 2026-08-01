import { NextRequest, NextResponse } from "next/server";
import { Order } from "@/types/Order";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { data } = await supabaseAdmin
    .from("best_sellers_today")
    .select("*")
    .limit(5);

  return NextResponse.json(data);
}
