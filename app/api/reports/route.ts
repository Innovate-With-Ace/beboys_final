import { NextResponse, NextRequest } from "next/server";
import { validateUser } from "@/auth-guard";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const { error } = await validateUser(["org:admin"]);
    if (error) return error;

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "startDate and endDate are required" },
        { status: 400 },
      );
    }

    const { data, error: revenueError } = await supabaseAdmin
      .from("revenue_over_time")
      .select("*")
      .gte("day", startDate)
      .lte("day", endDate)
      .order("day", { ascending: true });

    if (revenueError) {
      return NextResponse.json(
        { error: revenueError.message },
        { status: 500 },
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
