import { validateUser } from "@/auth-guard";
import { supabaseAdmin } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await validateUser(["org:admin"]);

  if (error) return error;
  const body = await req.json();
  const { id } = await params;

  const { data, error: categoriesError } = await supabaseAdmin
    .from("categories")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (categoriesError) {
    return NextResponse.json(
      { error: categoriesError.message },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await validateUser(["org:admin"]);

  if (error) return error;

  const { id } = await params;

  const { error: categoriesError } = await supabaseAdmin
    .from("categories")
    .delete()
    .eq("id", id);

  if (categoriesError) {
    console.log(categoriesError);
    return NextResponse.json(
      { error: categoriesError.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
