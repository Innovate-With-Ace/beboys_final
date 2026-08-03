// app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { validateUser } from "@/auth-guard";
import { z } from "zod";

// Create a schema just for updating order status (fixed)
const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "completed", "cancelled", "preparing"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 1. Check auth first (allowed both admin and staff since staff handle orders)
    const { error } = await validateUser(["org:admin", "org:staff"]);
    if (error) return error;

    // 2. Parse parameters and body safely
    const { id } = await params;
    const body = await req.json();

    // 3. Validate status with Zod
    const result = updateOrderStatusSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 },
      );
    }

    const { status } = result.data;

    // 4. Update the order in Supabase
    const { data, error: ordersError } = await supabaseAdmin
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select("*, items:order_items(*)")
      .single();

    if (ordersError) {
      return NextResponse.json({ error: ordersError.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
