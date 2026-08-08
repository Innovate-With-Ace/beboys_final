// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { validateUser } from "@/auth-guard";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const clerk = await clerkClient();
    const { error } = await validateUser(["org:admin", "org:staff"]);
    if (error) return error;

    const { data, error: ordersError } = await supabaseAdmin
      .from("orders")
      .select("*, items:order_items(*)")
      .order("created_at", { ascending: false });

    if (ordersError) {
      return NextResponse.json({ error: ordersError.message }, { status: 500 });
    }

    const userIDs = [...new Set(data.map((o) => o.cashier_id))];
    const { data: users } = await clerk.users.getUserList({ userId: userIDs });
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
