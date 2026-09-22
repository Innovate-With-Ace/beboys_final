// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { validateUser } from "@/auth-guard";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const clerk = await clerkClient();
    const { error, userId, orgRole } = await validateUser([
      "org:admin",
      "org:staff",
      "org:customer",
    ]);
    if (error) return error;

    let ordersQuery = supabaseAdmin
      .from("orders")
      .select("*, items:order_items(*)")
      .order("created_at", { ascending: false });

    // Staff/admin need the full order list to run the register and the
    // kitchen queue. A customer only gets their own orders — this used to
    // return every order in the system and rely on the mobile client to
    // filter down to "my orders" after the fact, which meant anyone
    // signed in as org:customer could call this endpoint directly and
    // read every other customer's order history.
    if (orgRole === "org:customer") {
      ordersQuery = ordersQuery.eq("cashier_id", userId);
    }

    const { data, error: ordersError } = await ordersQuery;

    if (ordersError) {
      return NextResponse.json({ error: ordersError.message }, { status: 500 });
    }

    const userIDs = [...new Set(data.map((o) => o.cashier_id))];
    // An empty array here isn't "no filter" to Clerk — skip the call
    // entirely rather than risk fetching an unfiltered user list.
    const users = userIDs.length
      ? (await clerk.users.getUserList({ userId: userIDs })).data
      : [];
    const nameMap = new Map(
      users.map((u) => [
        u.id,
        `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() ||
          u.emailAddresses[0]?.emailAddress,
      ]),
    );

    const ordersWithNames = data.map((order) => ({
      ...order,
      cashier_name: nameMap.get(order.cashier_id),
    }));

    return NextResponse.json(ordersWithNames);
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
