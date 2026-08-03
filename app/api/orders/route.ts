// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { validateUser } from "@/auth-guard";

export async function GET(req: NextRequest) {
  try {
    const { error } = await validateUser();
    if (error) return error;
    const { data, error: ordersError } = await supabaseAdmin
      .from("orders")
      .select("*, items:order_items(*)")
      .order("created_at", { ascending: false });

    if (ordersError) {
      return NextResponse.json({ error: ordersError.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
