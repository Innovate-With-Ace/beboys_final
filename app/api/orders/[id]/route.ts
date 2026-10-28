// app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { validateUser } from "@/auth-guard";
import { z } from "zod";

const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "completed", "cancelled", "preparing"]),
});

// Allowed status moves. "completed" and "cancelled" are final.
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  pending: ["preparing", "completed", "cancelled"],
  preparing: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

const ORDER_WITH_ITEMS = "*, items:order_items(*)";

// Give portions back to a dish (used when an order is cancelled).
// Uses an optimistic check on servings_left so a sale happening at the same
// moment can't be overwritten; retries a few times if that happens.
async function restoreServings(dishId: string, quantity: number) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data: dish, error } = await supabaseAdmin
      .from("dishes")
      .select("servings, servings_left")
      .eq("id", dishId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!dish) return; // dish was deleted — nothing to restore

    const next = Math.min(dish.servings, dish.servings_left + quantity);
    if (next === dish.servings_left) return;

    const { data: updated, error: updateError } = await supabaseAdmin
      .from("dishes")
      .update({ servings_left: next })
      .eq("id", dishId)
      .eq("servings_left", dish.servings_left)
      .select("id");

    if (updateError) throw new Error(updateError.message);
    if (updated && updated.length > 0) return;
  }

  throw new Error("Could not restore servings. Please try again.");
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 1. Auth (admin and staff both handle orders)
    const { error } = await validateUser(["org:admin", "org:staff"]);
    if (error) return error;

    // 2. Parse + validate
    const { id } = await params;
    const body = await req.json();

    const result = updateOrderStatusSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 },
      );
    }
    const { status: nextStatus } = result.data;

    // 3. Load the current order
    const { data: current, error: currentError } = await supabaseAdmin
      .from("orders")
      .select("id, status")
      .eq("id", id)
      .maybeSingle();

    if (currentError) {
      return NextResponse.json(
        { error: currentError.message },
        { status: 500 },
      );
    }
    if (!current) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Same status again (double tap / second tab): nothing to do, return as-is
    if (current.status === nextStatus) {
      const { data: same, error: sameError } = await supabaseAdmin
        .from("orders")
        .select(ORDER_WITH_ITEMS)
        .eq("id", id)
        .single();

      if (sameError) {
        return NextResponse.json({ error: sameError.message }, { status: 500 });
      }
      return NextResponse.json(same);
    }

    // 4. Block invalid moves (e.g. reopening a completed/cancelled order)
    const allowed = ALLOWED_TRANSITIONS[current.status] ?? [];
    if (!allowed.includes(nextStatus)) {
      return NextResponse.json(
        {
          error: `This order is already ${current.status} and can't be changed to ${nextStatus}.`,
        },
        { status: 409 },
      );
    }

    // 5. Change the status only if it's still what we just read
    //    (so two people can't cancel the same order twice)
    const { data: claimed, error: claimError } = await supabaseAdmin
      .from("orders")
      .update({ status: nextStatus, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("status", current.status)
      .select("id");

    if (claimError) {
      return NextResponse.json({ error: claimError.message }, { status: 400 });
    }
    if (!claimed || claimed.length === 0) {
      return NextResponse.json(
        { error: "This order was just updated by someone else. Refreshing." },
        { status: 409 },
      );
    }

    // 6. Cancelling gives the portions back to the dishes
    if (nextStatus === "cancelled") {
      try {
        const { data: items, error: itemsError } = await supabaseAdmin
          .from("order_items")
          .select("dish_id, quantity")
          .eq("order_id", id);

        if (itemsError) throw new Error(itemsError.message);

        // Merge duplicate dishes so each dish is restored once
        const perDish = new Map<string, number>();
        for (const item of items ?? []) {
          if (!item.dish_id) continue;
          perDish.set(
            item.dish_id,
            (perDish.get(item.dish_id) ?? 0) + item.quantity,
          );
        }

        for (const [dishId, quantity] of perDish) {
          await restoreServings(dishId, quantity);
        }
      } catch (restoreErr) {
        // Put the order back to what it was so data stays consistent
        await supabaseAdmin
          .from("orders")
          .update({ status: current.status })
          .eq("id", id)
          .eq("status", "cancelled");

        console.error("Failed to restore servings on cancel:", restoreErr);
        return NextResponse.json(
          { error: "Couldn't cancel the order. Please try again." },
          { status: 500 },
        );
      }
    }

    // 7. Return the fresh order
    const { data, error: fetchError } = await supabaseAdmin
      .from("orders")
      .select(ORDER_WITH_ITEMS)
      .eq("id", id)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
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
