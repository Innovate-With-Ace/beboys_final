import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { data, error } = await supabaseAdmin
    .from("categories")
    .select("*")
    .order("label", { ascending: true });

  if (error) {
    console.log(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.label || typeof body.label !== "string") {
    return NextResponse.json({ error: "Label is required" }, { status: 400 });
  }
  const { data, error } = await supabaseAdmin
    .from("categories")
    .insert(body)
    .select("*")
    .maybeSingle();

  if (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
