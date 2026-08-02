import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { Dish } from "@/types/Dish";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const body: Dish = await req.json();
    const { id } = await params;

    if (
      !body.name ||
      !body.price ||
      !body.servings ||
      !body.servings_left ||
      !body.category_id ||
      body.is_available === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("dishes")
      .update({
        name: body.name,
        price: body.price,
        servings: body.servings,
        servings_left: body.servings_left,
        image: body.image,
        category_id: body.category_id,
        is_available: body.is_available,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // wipe old recipe rows first, so removed ingredients don't linger
    const { error: deleteError } = await supabaseAdmin
      .from("dish_ingredients")
      .delete()
      .eq("dish_id", id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 400 });
    }

    // insert the current set of ingredients fresh
    const ingredients = body.ingredients ?? [];
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
    const { id } = await params;

    const { error } = await supabaseAdmin.from("dishes").delete().eq("id", id);

    if (error) {
      console.log("Error deleting dish:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
