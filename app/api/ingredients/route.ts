import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { validateUser } from "@/auth-guard";

export async function GET() {
  try {
    const { error } = await validateUser(["org:admin", "org:staff"]);

    if (error) return error;

    const { data, error: ingredientsError } = await supabaseAdmin
      .from("ingredients")
      .select("*")
      .order("name", { ascending: false });

    if (ingredientsError) {
      return NextResponse.json(
        { error: ingredientsError.message },
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

export async function POST(req: NextRequest) {
  try {
    const { error } = await validateUser(["org:admin", "org:staff"]);

    if (error) return error;
    const body = await req.json();

    const { data, error: ingredientsError } = await supabaseAdmin
      .from("ingredients")
      .insert(body)
      .select()
      .single();

    if (ingredientsError) {
      return NextResponse.json(
        { error: ingredientsError.message },
        { status: 400 },
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
