import { supabaseAdmin } from "@/lib/supabase/server";
import { Dish } from "@/types/Dish";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: Dish = await req.json();

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
      .insert({
        name: body.name,
        price: body.price,
        servings: body.servings,
        servings_left: body.servings_left,
        image: body.image,
        category_id: body.category_id,
        is_available: body.is_available,
      })
      .select()
      .single();

    if (error) {
      console.log(error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    for (const ing of body.ingredients ?? []) {
      const { error: ingError } = await supabaseAdmin
        .from("dish_ingredients")
        .upsert({
          dish_id: data.id,
          ingredient_id: ing.ingredient_id,
          quantity: ing.quantity,
        });

      if (ingError) {
        console.log(ingError.message);
        return NextResponse.json({ error: ingError.message }, { status: 400 });
      }
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("dishes")
      .select("*, ingredients:dish_ingredients(ingredient_id, quantity)")
      .order("name", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
