import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  try {
    // 1. Get today's date (right now)
    const today = new Date();

    // 2. Create yesterday's date
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // 3. Set yesterday's time to midnight (00:00:00) to get the very start of the day
    yesterday.setHours(0, 0, 0, 0);

    // 4. Convert both to standard ISO strings for the database
    const startDate = yesterday.toISOString();
    const endDate = today.toISOString(); // Up to this exact second

    // 5. Fetch using a date range (gte = greater than or equal, lte = less than or equal)
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .gte("created_at", startDate)
      .lte("created_at", endDate);

    // 6. Return a proper Next.js error response
    if (error) {
      console.error("Error fetching orders:", error.message);
      return NextResponse.json(
        { error: "Failed to fetch orders" },
        { status: 500 },
      );
    }

    // 7. Return a proper Next.js success response
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
