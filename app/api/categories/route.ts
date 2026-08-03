import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { validateUser } from "@/auth-guard";

export async function GET(req: NextRequest) {
  try {
    const { error } = await validateUser(["org:admin", "org:staff"]);

    if (error) return error;

    const { data, error: categoriesError } = await supabaseAdmin
      .from("categories")
      .select("*")
      .order("label", { ascending: true });

    if (categoriesError) {
      console.log(categoriesError.message);
      return NextResponse.json(
        { error: categoriesError.message },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { error } = await validateUser(["org:admin"]);
    const body = await req.json();

    if (error) return error;

    if (!body.label || typeof body.label !== "string") {
      return NextResponse.json({ error: "Label is required" }, { status: 400 });
    }
    const { data, error: categoriesError } = await supabaseAdmin
      .from("categories")
      .insert(body)
      .select("*")
      .maybeSingle();

    if (categoriesError) {
      console.log(categoriesError);
      return NextResponse.json(
        { error: categoriesError.message },
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
