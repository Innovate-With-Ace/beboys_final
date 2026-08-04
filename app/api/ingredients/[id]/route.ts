// app/api/ingredients/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { validateUser } from "@/auth-guard";
import { ingredientSchema } from "@/lib/schemas/ingredient"; // Adjust path as needed

// Create a partial schema for PATCH requests
const patchIngredientSchema = ingredientSchema.partial();

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { error } = await validateUser(["org:admin"]);
    if (error) return error;

    const { id } = await params;
    const body = await req.json();

    // 1. Validate incoming body with Zod (partial)
    const result = patchIngredientSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 },
      );
    }

    // 2. Update database using the validated data
    const { data, error: ingredientError } = await supabaseAdmin
      .from("ingredients")
      .update(result.data)
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
    console.error(err);
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
      console.log(ingredientError.message);
      return NextResponse.json(
        { error: ingredientError.message },
        { status: 400 },
      );
    }

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
