import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { validateUser } from "@/auth-guard";
import { dishSchema } from "@/lib/schemas/dish";

// Create a partial schema specifically for PATCH (all fields optional)
const patchDishSchema = dishSchema.partial();

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { error } = await validateUser(["org:admin"]);
    if (error) return error;

    const body = await req.json();
    const { id } = await params;

    // Validate using the partial schema
    const result = patchDishSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 },
      );
    }

    // Separate ingredients from the rest of the fields
    const { ingredients, ...dishData } = result.data;

    // 1. Update only the fields that were actually provided in the request
    // We omit 'image: null' so existing images don't get accidentally wiped out
    const { data, error: dishError } = await supabaseAdmin
      .from("dishes")
      .update(dishData)
      .eq("id", id)
      .select()
      .single();

    if (dishError) {
      return NextResponse.json({ error: dishError.message }, { status: 400 });
    }

    // 2. Only update ingredients if they were actually provided in the payload
    if (ingredients !== undefined) {
      // Wipe old recipe rows first
      const { error: deleteError } = await supabaseAdmin
        .from("dish_ingredients")
        .delete()
        .eq("dish_id", id);

      if (deleteError) {
        return NextResponse.json(
          { error: deleteError.message },
          { status: 400 },
        );
      }

      // Insert the new set of ingredients fresh (if any exist)
      if (ingredients.length > 0) {
        const { error: insertError } = await supabaseAdmin
          .from("dish_ingredients")
          .insert(
            ingredients.map((ing) => ({
              dish_id: id,
              ingredient_id: ing.ingredient_id,
              quantity: ing.quantity,
            })),
          );

        if (insertError) {
          return NextResponse.json(
            { error: insertError.message },
            { status: 400 },
          );
        }
      }
    }

    return NextResponse.json(data);
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

    const { error: dishError } = await supabaseAdmin
      .from("dishes")
      .delete()
      .eq("id", id);

    if (dishError) {
      console.log("Error deleting dish:", dishError.message);
      return NextResponse.json({ error: dishError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
