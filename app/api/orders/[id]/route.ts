// app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { validateUser } from "@/auth-guard";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { error } = await validateUser(["org:admin"]);
    const { id } = await params;
    const body = await req.json();

    if (error) return error;

    const { data, error: ordersError } = await supabaseAdmin
      .from("orders")
      .update({ status: body.status })
      .eq("id", id)
      .select("*, items:order_items(*)")
      .single();

    if (ordersError) {
      return NextResponse.json({ error: ordersError.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
