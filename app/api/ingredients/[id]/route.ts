import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { validateUser } from "@/auth-guard";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { error } = await validateUser(["org:admin"]);

    if (error) return error;
    const { id } = await params;
    const body = await req.json();

    console.log(body);

    const { data, error: ingredientError } = await supabaseAdmin
      .from("ingredients")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (ingredientError) {
      return NextResponse.json(
        { error: ingredientError.message },
        { status: 400 },
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { error } = await validateUser(["org:admin"]);

    if (error) return error;
    const { id } = await params;

    const { error: ingredientError } = await supabaseAdmin
      .from("ingredients")
      .delete()
      .eq("id", id);

    if (ingredientError) {
      return NextResponse.json(
        { error: ingredientError.message },
        { status: 400 },
      );
    }
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
