import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  const { data } = await supabaseAdmin
    .from("low_stock_ingredients")
    .select("*");

  return NextResponse.json(data);
}
