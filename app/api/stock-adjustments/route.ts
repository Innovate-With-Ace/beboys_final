import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { validateUser } from "@/auth-guard";

export async function GET(req: NextRequest) {
  try {
    const { error } = await validateUser(["org:admin"]);
    if (error) return error;

    const { searchParams } = new URL(req.url);
    const ingredientId = searchParams.get("ingredient_id");
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 200);

    let query = supabaseAdmin
      .from("stock_adjustments")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (ingredientId) query = query.eq("ingredient_id", ingredientId);

    const { data, error: queryError } = await query;

    if (queryError) {
      return NextResponse.json({ error: queryError.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
