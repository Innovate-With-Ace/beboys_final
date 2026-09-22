import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { validateUser } from "@/auth-guard";
import { orderInputSchema } from "@/lib/schemas/order";

export async function POST(req: NextRequest) {
  try {
    const { error, userId, orgRole } = await validateUser([
      "org:admin",
      "org:staff",
      "org:customer",
    ]);

    if (error) {
      return error;
    }

    const body = await req.json();

    // 1. Validate incoming payload using Zod (lightweight input schema)
    const result = orderInputSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 },
      );
    }

    const validBody = result.data;

    // create_pos_order marks source "pos" orders completed immediately
    // (staff at the physical register already handed over the food). A
    // customer ordering from the mobile app hasn't been served yet, so
    // force "mobile" regardless of what they send — otherwise a customer
    // could self-report their own order as fulfilled and skip the
    // kitchen/staff confirmation step entirely.
    if (orgRole === "org:customer") {
      validBody.source = "mobile";
    }

    // Order creation, order_items insert, and decrementing
    // dishes.servings_left all happen atomically inside create_pos_order
    // (one Postgres transaction, with the dish rows locked to prevent
    // overselling under concurrent checkouts). Raw ingredient stock is
    // NOT touched here — it was already deducted when the dish/batch was
    // created (see app/api/dishes/route.ts).
    const { data: order, error: rpcError } = await supabaseAdmin.rpc(
      "create_pos_order",
      {
        p_cashier_id: userId,
        p_source: validBody.source,
        p_items: validBody.items.map((i) => ({
          dish_id: i.item.id,
          quantity: i.quantity,
        })),
      },
    );

    if (rpcError) {
      // Postgres RAISE EXCEPTION messages (not found / insufficient stock)
      // surface here as rpcError.message.
      const status = /not found|not enough stock/i.test(rpcError.message)
        ? 400
        : 500;
      return NextResponse.json({ error: rpcError.message }, { status });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
