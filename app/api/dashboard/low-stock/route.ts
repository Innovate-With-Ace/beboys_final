import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { validateUser } from "@/auth-guard";

export async function GET() {
  try {
    const { error } = await validateUser(["org:admin"]);

    if (error) return error;

    const { data, error: lowIngredientError } = await supabaseAdmin
      .from("low_stock_ingredients")
      .select("*");

    if (lowIngredientError) {
      return NextResponse.json(
        { error: lowIngredientError.message },
        { status: 400 },
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
