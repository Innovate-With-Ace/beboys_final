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
    const { error, userId } = await validateUser(["org:admin"]);
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

    // If stock is being changed, snapshot the previous value first so we
    // can log it to the audit trail (stock_adjustments) after the update.
    let previousStock: number | null = null;
    if (result.data.stock !== undefined) {
      const { data: existing } = await supabaseAdmin
        .from("ingredients")
        .select("stock")
        .eq("id", id)
        .single();
      previousStock = existing?.stock ?? null;
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

    if (previousStock !== null && previousStock !== data.stock) {
      const { error: auditError } = await supabaseAdmin
        .from("stock_adjustments")
        .insert({
          ingredient_id: id,
          ingredient_name: data.name,
          change: data.stock - previousStock,
          previous_stock: previousStock,
          new_stock: data.stock,
          reason: "manual_adjustment",
          changed_by: userId,
        });
      if (auditError) {
        console.error("Failed to log stock adjustment:", auditError.message);
      }
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
